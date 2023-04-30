import chroma, { EmbeddingFunction } from "@/modules/chroma"
import openai from "@/modules/openai"
import { lowercaseRandomString } from "@/modules/util"
import { redBright } from "ansi-colors"
import { OpenAIEmbeddingFunction } from "chromadb"

const BATCH_SIZE = 10

/**
 * @typedef GenerateAnswersBody
 * @property {string} questionId
 * @property {number} amount
 */


export default async function handler(req, res) {

    // get collection metadata - looks like the only way to get metadata
    // is to list all collections
    const collectionData = (await chroma.listCollections()).find(collection => collection.name === req.body.questionId)?.metadata

    if (!collectionData)
        throw new Error("Question not found: " + req.body.questionId)

    // get collection itself
    const collection = await chroma.getCollection(req.body.questionId, EmbeddingFunction)

    // generate answers
    const answers = await generateAnswers(collectionData.question, req.body.amount)

    // generate IDs
    const answerIds = answers.map(() => lowercaseRandomString())

    console.log(`Generated ${redBright(answers.length)} answers`)

    // add to collection
    await collection.add(
        answerIds,
        undefined,
        answers.map(() => ({ timestamp: Date.now(), match: "NULL" })),
        answers
    )

    // response with generated answers
    res.json({
        answers: answers.map((answer, i) => ({
            id: answerIds[i],
            text: answer,
        })),
    })
}


async function generateAnswers(question, numAnswers) {

    const numBatches = Math.floor(numAnswers / BATCH_SIZE)
    const additional = numAnswers % BATCH_SIZE > 0

    const promises = Array(numBatches).fill().map(() => generateAnswersForBatch(question))
    additional && promises.push(
        generateAnswersForBatch(question, numAnswers % BATCH_SIZE)
    )

    return (await Promise.all(promises)).flat()
}


async function generateAnswersForBatch(question, numAnswers = BATCH_SIZE) {

    // prompt model
    const resp = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Here's a list of ${numAnswers} answers to the question "${question}":\n\n`,
        max_tokens: 2048,
        temperature: 1,
    })

    const answers = resp.data.choices[0].text
        // split by line breaks
        .split(/[\n\r]+/g)
        // remove numbers at the beginning
        .map(line => line.replace(/^\d+\.\s*/, "").trim())
        // remove empty lines
        .filter(x => !!x)

    return answers
}

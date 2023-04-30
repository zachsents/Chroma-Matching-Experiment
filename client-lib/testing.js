
/** @type {import("openai").OpenAIApi} */
const OpenAI = global.OpenAI


const BATCH_SIZE = 10


export async function generateAnswers(question, numAnswers) {

    const numBatches = Math.floor(numAnswers / BATCH_SIZE)
    const additional = numAnswers % BATCH_SIZE > 0

    const promises = Array(numBatches).fill().map(() => generateAnswersForBatch(question))
    additional && promises.push(generateAnswersForBatch(question, numAnswers % BATCH_SIZE))

    return (await Promise.all(promises)).flatMap(x => x)
}


async function generateAnswersForBatch(question, numAnswers = BATCH_SIZE) {
    const resp = await OpenAI.createCompletion({
        model: "text-davinci-003",
        prompt: `Here's a list of ${numAnswers} answers to the question "${question}":\n\n`,
        max_tokens: 2048,
        temperature: 1,
    })

    const completionResult = resp.data.choices[0].text

    const answers = completionResult
        // split by line breaks
        .split(/[\n\r]+/g)
        // remove numbers at the beginning
        .map(line => line.replace(/^\d+\.\s*/, ""))

    return answers
}

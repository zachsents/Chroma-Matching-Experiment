import chroma, { EmbeddingFunction } from "@/modules/chroma"
import { redBright } from "ansi-colors"

/**
 * @typedef ListAnswersQueryParams
 * @property {string} questionId
 */


/**
 * Lists the responses to a question.
 */
export default async function handler(req, res) {
    // get question collection
    const collection = await chroma.getCollection(req.query.questionId, EmbeddingFunction)

    // get all answers & map to answer objects
    const _answers = await collection.get()
    const answers = _answers.ids?.map((id, i) => ({
        id,
        ..._answers.metadatas[i],
        text: _answers.documents[i],
    })) ?? []

    console.log(`Found ${redBright(answers.length)} answers`)

    // sort by timestamp descending
    answers.sort((a, b) => b.timestamp - a.timestamp)

    res.json(answers)
}

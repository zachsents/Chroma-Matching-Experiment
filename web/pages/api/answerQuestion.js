import chroma, { EmbeddingFunction } from "@/modules/chroma"
import { lowercaseRandomString } from "@/modules/util"
import { OpenAIEmbeddingFunction } from "chromadb"

/**
 * @typedef AnswerQuestionQueryParams
 * @property {string} questionId
 */

/**
 * @typedef AnswerQuestionBody
 * @property {string} answer
 */


/**
 * Submits a response to a question.
 */
export default async function handler(req, res) {

    const collection = await chroma.getCollection(req.query.questionId, EmbeddingFunction)

    const { answer, ...metadata } = req.body

    const answerId = lowercaseRandomString()

    await collection.add(answerId, undefined, {
        ...metadata,
        timestamp: Date.now(),
        match: "NULL",
    }, answer)

    res.json({
        answerId,
    })
}

import chroma, { EmbeddingFunction } from "@/modules/chroma"
import { OpenAIEmbeddingFunction } from "chromadb"

/**
 * @typedef DeleteAnswerQueryParams
 * @property {string} questionId
 */

/**
 * @typedef DeleteAnswerBody
 * @property {string} answerId
 */


/**
 * Deletes a response to a question.
 */
export default async function handler(req, res) {

    const collection = await chroma.getCollection(req.query.questionId, EmbeddingFunction)

    await collection.delete([req.body.answerId])

    res.json({
        deleted: true,
        answerId: req.body.answerId,
    })
}

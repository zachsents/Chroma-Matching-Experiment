import { OpenAIEmbeddingFunction } from "chromadb"
import { convertToUnderscoreName, lowercaseRandomString } from "./utils.js"


/**
 * @typedef Response
 * @property {string} text
 * @property {string} user
 */


export function listQuestions() {
    return client.listCollections()
}


/**
 * Creates a collection for a question.
 *
 * @async
 * @param {string} question
 * @return {Promise<import("chromadb").Collection>} 
 */
export async function createQuestion(question) {
    return await client.createCollection(
        convertToUnderscoreName(question),
        {
            question,
        },
        new OpenAIEmbeddingFunction(process.env.OPENAI_SECREY_KEY)
    )
}


/**
 * Adds a response to a question collection.
 *
 * @async
 * @param {import("chromadb").Collection} questionCollection
 * @param {Response[]} responses
 * @return {Promise<void>}
 */
export async function addResponse(questionCollection, ...responses) {
    await questionCollection.add(
        // map to IDs
        responses.map(() => lowercaseRandomString()),
        // don't include any embeddings
        undefined,
        // add other response data as metadata object
        responses.map(({ text, ...otherData }) => otherData),
        // add the response text as the data
        responses.map(({ text }) => text),
    )
}
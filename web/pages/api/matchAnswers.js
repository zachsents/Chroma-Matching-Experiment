import chroma, { EmbeddingFunction } from "@/modules/chroma"
import { redBright } from "ansi-colors"
import { OpenAIEmbeddingFunction } from "chromadb"

/**
 * @typedef MatchAnswersQueryParams
 * @property {string} questionId
 */


/**
 * Chooses pairs of responses to a question.
 */
export default async function handler(req, res) {

    // get question collection
    const collection = await chroma.getCollection(req.query.questionId, EmbeddingFunction)

    // track matches
    const successulMatches = []

    while (true) {
        // find unmatched answer
        const _unmatchedAnswer = await collection.get(undefined, {
            match: "NULL",
        }, 1, undefined, ["documents", "embeddings", "metadatas"])
        const unmatchedAnswer = {
            id: _unmatchedAnswer.ids[0],
            document: _unmatchedAnswer.documents[0],
            metadata: _unmatchedAnswer.metadatas[0],
            embedding: _unmatchedAnswer.embeddings[0],
        }

        if (!unmatchedAnswer.id)
            break

        // query a match
        const matches = await collection.query(unmatchedAnswer.embedding, 2, {
            match: "NULL",
        })
        const matchIndex = matches.ids[0].findIndex(id => id != unmatchedAnswer.id)
        const match = {
            id: matches.ids[0][matchIndex],
            document: matches.documents[0][matchIndex],
            metadata: matches.metadatas[0][matchIndex],
        }

        if (!match.id)
            break

        // update the documents so they have the match stored -- for some reason,
        // the update function doesn't work with arrays, or I'm probably using it wrong
        await Promise.all([
            collection.update(unmatchedAnswer.id, undefined, {
                ...unmatchedAnswer.metadata,
                match: match.id,
            }, unmatchedAnswer.document),
            collection.update(match.id, undefined, {
                ...match.metadata,
                match: unmatchedAnswer.id,
            }, match.document),
        ])

        // add to successful matches
        successulMatches.push([unmatchedAnswer.id, match.id])
        console.log(`Matched ${redBright(unmatchedAnswer.id)} with ${redBright(match.id)}`)
    }

    // console.log(unmatchedAnswer, match)

    // console.log(await EmbeddingFunction.generate(["Blue", "Red", "Green"]))

    // console.log(answers)

    // await collection.query(
    //     query_embeddings=[[1.1, 2.3, 3.2], [5.1, 4.3, 2.2]],
    //     n_results=2,
    //     where={"style": "style2"}
    // )

    // console.log(`Found ${redBright(answers.length)} answers`)

    // sort by timestamp descending
    // answers.sort((a, b) => b.timestamp - a.timestamp)

    res.json({
        successulMatches,
    })
}

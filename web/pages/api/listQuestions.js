import chroma from "@/modules/chroma"
import { redBright } from "ansi-colors"


/**
 * Lists all questions (represented as Chroma collections)
 */
export default async function handler(req, res) {
    // list collections
    const collections = await chroma.listCollections()

    // map to question objects
    const questions = collections.map(collection => ({
        id: collection.name,
        ...collection.metadata,
    }))

    console.log(`Found ${redBright(questions.length)} questions`)

    // sort by timestamp descending
    questions.sort((a, b) => b.timestamp - a.timestamp)

    res.json(questions)
}

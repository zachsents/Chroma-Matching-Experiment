import chroma, { EmbeddingFunction } from "@/modules/chroma"
import { convertToUnderscoreName } from "@/modules/util"
import { redBright } from "ansi-colors"


export default async function handler(req, res) {

    const questionId = convertToUnderscoreName(req.body.question)

    console.log(redBright(req.body.question))

    await chroma.createCollection(questionId, {
        question: req.body.question,
        timestamp: Date.now(),
    }, EmbeddingFunction)

    res.json({
        questionId,
    })
}
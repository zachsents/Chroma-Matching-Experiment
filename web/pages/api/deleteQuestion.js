import chroma from "@/modules/chroma"


export default async function handler(req, res) {
    await chroma.deleteCollection(req.body.questionId)

    res.json({
        deleted: true,
        questionId: req.body.questionId,
    })
}
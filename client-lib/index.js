import { ChromaClient } from "chromadb"
import * as dotenv from "dotenv"
import { Configuration as OpenAIConfig, OpenAIApi } from "openai"


// Environment variables
dotenv.config()
dotenv.config({
    path: "./.env.secret"
})

// ChromaDB
const Chroma = new ChromaClient(process.env.CHROMA_SERVER)
global.Chroma = Chroma

// Open AI
const OpenAI = new OpenAIApi(new OpenAIConfig({
    apiKey: process.env.OPENAI_SECREY_KEY,
}))
global.OpenAI = OpenAI


// await createQuestion("What's your mother's maiden name?")

// console.log(await client.listCollections())
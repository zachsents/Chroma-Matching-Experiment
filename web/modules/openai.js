import { Configuration, OpenAIApi } from "openai"

// Open AI
export default new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_SECREY_KEY,
}))
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb"

export default new ChromaClient(process.env.CHROMA_SERVER)

export const EmbeddingFunction = new OpenAIEmbeddingFunction(process.env.OPENAI_SECREY_KEY)
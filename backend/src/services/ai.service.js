import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { searchWeb } from "./tavily.service.js";
import { configDotenv } from "dotenv";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain"
import * as z from "zod"

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

const searchWebTool = tool(
    searchWeb,
    {
        name: "searchWeb",
        description: "use this tool to search the web for latest information. Input should be a search query string. The output will be the search results. Use this tool when the user asks for information that is not available in the chat history or when the user asks for information that is time-sensitive or requires up-to-date information.",
        inputSchema: z.object({
            query: z.string().describe("The search query string to search the web for.")
        })
    }
)


const agent = createAgent({
    model: geminiModel,
    tools: [searchWebTool],
})

export async function generateResponse(messages) {

    const response = await agent.invoke({
        messages: messages.map(msg => {
            if (msg.role == "User") {
                return new HumanMessage(msg.content)
            }
            else if (msg.role == "AI") {
                return new AIMessage(msg.content)
            }
        })
    })

    return response.messages[response.messages.length-1].text

}

export async function generateChatTitle(message) {
    const response = await mistralModel.invoke([
        new SystemMessage(`You are a helpful assistant that generates a concise and descriptive title for a chat conversation based on the user's message.
            The title should be no more than 4 words and should capture the essence of the conversation. Please provide only the title without any additional text.
                `),
        new HumanMessage(`
                Generate a title for the following first message: "${message}"
                `)
    ])
    return response.text;
}

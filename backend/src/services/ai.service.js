import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"

import { configDotenv } from "dotenv";
import { HumanMessage, SystemMessage } from "langchain"

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})


export async function generateResponse(message) {

    const response = await geminiModel.invoke([
        new HumanMessage(message)
    ])

    return response.text

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

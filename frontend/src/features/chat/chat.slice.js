import { createSlice, current } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null
    },
    reducers: {
        createNewchat: (state, action) => {
            const { chatId, title } = action.payload
            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    chatId: chatId,
                    title,
                    messages: [],
                    lastUpdated: new Date().toISOString(),
                }
            }

        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload
            state.chats[chatId].messages.push({ content, role })
        },
        addMessages: (state, action) => {
            const { chatId, formattedMessages } = action.payload
           
            state.chats[chatId].messages = formattedMessages
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setChats, setCurrentChatId, setLoading, setError, createNewchat, addNewMessage, addMessages } = chatSlice.actions

export default chatSlice.reducer
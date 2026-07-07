import { initSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getMessages, deleteMessages } from "../services/chat.api";
import { useDispatch } from "react-redux";
import { setChats, setLoading, setCurrentChatId, setError, createNewchat, addNewMessage, addMessages } from "../chat.slice";

export const useChat = () => {

    const dispatch = useDispatch()

    async function handSendMessage({message, chatId}) {
        dispatch(setLoading(true))

        const data = await sendMessage({message, chatId})

        const {chat, aiMessage} = data

        dispatch(createNewchat({
            chatId: chat._id,
            title: chat.title
        }))
        dispatch(addNewMessage({
            chatId: chat._id,
            content: message,
            role: "User"
        }))
        dispatch(addNewMessage({
            chatId: chat._id,
            content: aiMessage.content,
            role: "AI"
        }))
        dispatch(setCurrentChatId(chat._id))
        dispatch(setLoading(false))


    }

    async function handleGetChats(chatId){
        dispatch(setLoading(true))

        const data = await getChats()
        const {chats} = data

        dispatch(setChats(chats.reduce((acc, chat)=>{
            acc[chat._id] = {
                chatId: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt
            }
            return acc
        },{})))

        setLoading(false)
        
    }

    async function handleOpenChat(chatId){
        dispatch(setLoading(true))
        const data = await getMessages(chatId)

        const {messages} = data
       
        const formattedMessages = messages.map(msg => {
            return {
                content: msg.content,
                role: msg.role
            }
        })

       
        dispatch(addMessages({chatId, formattedMessages}))
        dispatch(setCurrentChatId(chatId))
        dispatch(setLoading(false))
    }

    return {
        initSocketConnection, handSendMessage, handleGetChats, handleOpenChat
    }

}
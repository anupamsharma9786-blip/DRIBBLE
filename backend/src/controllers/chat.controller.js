import { generateResponse, generateChatTitle } from "../services/ai.service.js"
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"
import { response } from "express"



export async function sendMessage(req, res) {
    const { message, chatId } = req.body

    

    let title = null, chat = null

    if (!chatId) {
        title = await generateChatTitle(message)
        chat = await chatModel.create({
            user: req.user.id,
            title: title
        })
    }else{
        chat = await chatModel.findById(chatId)
    }

    const userMessage = await messageModel.create({
        chat: chatId || chat._id,
        role: "User",
        content: message
    })

    const messages = await messageModel.find({chat: userMessage.chat})

  
    const result = await generateResponse(messages)



    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        role: "AI",
        content: result

    })




    return res.status(201).json({
        chat,
        aiMessage
    })


}

export async function getChats(req, res) {
    const userId = req.user.id

    const chats  = await chatModel.find({user: userId})
    
    return res.status(200).json({
        message: "chats fetched successfully",
        chats
    })
}

export async function getMessages(req, res) {
    const userId = req.user.id
    const { chatId } = req.params

    const chat = await chatModel.findOne({
        _id: chatId,
        user: userId
    })

    console.log(chatId)

    if(!chat){
        return res.status(404).json({
            message: "chat not found"
        })
    }

    const messages  = await messageModel.find({chat: chatId})
    
    return res.status(200).json({
        message: "Messages fetched successfully",
        messages
    })
}

export async function deleteChats(req, res){
    const userId = req.user.id
    const {chatId} = req.params

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: userId
    })

    if(!chat){
        return res.status(404).json({
            message: "chat not found"
        })
    }

    await messageModel.deleteMany({
        chat: chatId
    })

    res.status(200).json({
        message: "chat deleted successfully"
    })
}
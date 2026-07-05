import { generateResponse, generateChatTitle} from "../services/ai.service.js"



export async function sendMessage(req, res){
    const { message } = req.body

    const title = await generateChatTitle(message)
    console.log(title)
    const result = await generateResponse(message)
    

    

    return res.json({
        aimessage: result,
        title: title
    })
    

}
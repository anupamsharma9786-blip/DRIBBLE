import userModel from "../models/user.model.js";

import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {

    const {username, email, password} = req.body

    const isUserExists = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(isUserExists){
        return res.status(409).json({
            message: isUserExists.email==email? "Email already exists":"Username already exists",
            success: false,
            err: "user already exists"
        })
    }

    const user = await userModel.create({
        username: username,
        email: email,
        password: password
    })

    await sendEmail({
        to: email,
        subject: "welcome to perplexity",
        html: "his this anupamndasndkjasndjkasdjk"
    })
    
    return res.status(201).json({
        message: "user registered successfully",
        user: {
            username,
            email
        }
    })

    
}
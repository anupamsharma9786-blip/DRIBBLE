import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv"

import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {

    const { username, email, password } = req.body

    const isUserExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserExists) {
        return res.status(409).json({
            message: isUserExists.email == email ? "Email already exists" : "Username already exists",
            success: false,
            err: "user already exists"
        })
    }

    const user = await userModel.create({
        username: username,
        email: email,
        password: password
    })

    const emailVerificationToken = jwt.sign({
        email: user.email
    }, process.env.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `<h1>Welcome to Perplexity</h1>
        <p>Click the link below to verify your email</p>
        <a href="http://localhost:3000/api/auth/verify-email/${emailVerificationToken}">Verify Email</a>
        <p>If you didnt create that account, please ignore this</p>
        `
    })

    return res.status(201).json({
        message: "user registered successfully",
        user: {
            username,
            email
        }
    })


}

export async function login(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({
        email: email
    })

    if(!user){
        return res.status(400).json({
            message: "Invalid credentials",
            success: false,
            err: "user not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password)

    if(!isPasswordMatch){
        return res.status(400).json({
            message: "Invalid credentials",
            success: false,
            err: "Incorrect Password"
        })
    }

    if(!user.verified){
        return res.status(400).json({
            message: "please verify your email before login",
            success: false,
            err: "email not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        email: email
    }, process.env.JWT_SECRET, {expiresIn: "7d"})

    res.cookie("token",token)

    res.status(200).json({
        message: "user logged in successfully",
        success: true,
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })
}

export async function getMe(req, res){

    console.log(req.user)

    const userId = req.user.id
    
    const user = await userModel.findById(userId).select("-password")

    if(!user){
        return res.status(404).json({
            message: "user doesn't exists",
            success: false,
            err: "User not found"
        })
    }

    return res.status(200).json({
        message: "user fetched successfully",
        success: true,
        user
    })



}

export async function verifyEmail(req, res) {
    const { emailVerificationToken } = req.params
    try {
        const decoded = jwt.verify(emailVerificationToken, process.env.JWT_SECRET)

        const user = await userModel.findOne({ email: decoded.email })

        if (!user) {
            return res.status(404).json({
                message: "user doesn't exists",
                success: false,
                err: "User not found"
            })
        }

        if (user.verified) {
            return res.status(409).json({
                message: "User already verified",
                success: false,
                err: "user already verified"
            })
        }

        user.verified = true;

        await user.save()

        const html = `<h1>Email verified successfully</h1>
                    <p>You can now login to your account</p>
                    <a href="http://localhost:3000/login">Login</a>
    `
        res.send(html)

    } catch (err) {
        return res.status(400).json({
            message: "Invalid token",
            success: false,
            err: err.message
        })
    }
}   
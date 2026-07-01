import jwt from "jsonwebtoken"
import {configDotenv}  from "dotenv"

export async function authUser(req, res, next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "unauthorized",
            success: false,
            err: "No token provided"
        })
    }

    let decoded;

    try{
        
        decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded

        next()
    }catch(err){
        return res.status(400).json({
            message: "Invalid token",
            success: false,
            err: "token is invalid"
        })
    }

}

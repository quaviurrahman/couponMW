import jwt from "jsonwebtoken"
import { createError } from "../errorHandler/error.js"

export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token
    if(!token){
        return res.status(400).json({
            error:true,
            message:"Token in required!"
        })
    }
    jwt.verify(token,process.env.JWT,(err,user)=> {
        if (err) return res.status(401).json({
            error:true,
            message:"Invalid Token!"
        })
        req.user = user;
        return res
        .status(500)
        .json({
            user: user,
            token
        })
        next()
    })
}
export default verifyToken
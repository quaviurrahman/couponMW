import users from "../models/users.js"

export const createUser = async (req,res) => {
    const newuser = new dummyUsers({...req.body,status:"active"})
    await newuser.save()
    res.json({
        status:200,
        response:"Successfull",
        Message:"User created Successfully!"
    })
}

export default createUser
import mongoose from "mongoose"

const users = new mongoose.Schema ({
    username : { type:String, required : true},
    name : { type:String, required : true},
    email : { type:String, required : true},
    passphrase : { type:String, required : true},
    status : { type:String, required : true},
    operatorType : { type:String, required : true, default:"operator"} //initially there will be 3 different types - admin, operator, approver
},
{timestamps : true})

export default mongoose.model("dummyUser",users)
import mongoose from "mongoose"

const batchCouponIssueTask = new mongoose.Schema ({
    task_name:{type:String,required:true},
    code:{type:String,required:true},
    holder_type:{type:String,required:true},
    holderId:{type:[String],required:true},
    desc_1:{type:String,required:false},
    desc_2:{type:String,required:false},
    desc_3:{type:String,required:false},
    discountType:{type:String,required:true}, //There are two type of discount that can be passed - "percentage", "flat"
    discountAmount:{type:Number,required:true}, //This is the percentage or flat value amount of the discount
    discountOrderComponent:{type:String,required:true}, //Initially an order component is devided in 2 parts - "principal", "charge"
    max_discountAmount:{type:Number,required:false},
    redeemingServiceID:{type:[String],required:true},
    discountShare:{type:[{
        redeemingPartyID: {type:String, required:true},
        shareRate: {type:Number, required:true}
    }],required:false},
    discountShareRate:{type:Number, required:true},
    image_1:{type:String,required:false},
    image_2:{type:String,required:false},
    image_3:{type:String,required:false},
    min_trnx_amount:{type:Number,required:true},
    validity_start_from:{type:Date,required:true},
    validity_end_on:{type:Date,required:true},
    task_created_at:{type:Date,required:true},
    scheduled_for_issue_at:{type:Date,required:false},
    taskStatus:{type:String,required:true}
},
{timestamps : true})

export default mongoose.model("batchCouponIssueTask",batchCouponIssueTask)
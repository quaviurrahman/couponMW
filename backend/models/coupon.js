import mongoose from "mongoose"

const coupon = new mongoose.Schema ({
    code:{type:String,required:true},
    holder_type:{type:String,required:true},
    holderId:{type:String,required:true},
    desc_1:{type:String,required:false},
    desc_2:{type:String,required:false},
    desc_3:{type:String,required:false},
    discountType:{type:String,required:true},
    discountAmount:{type:Number,required:true},
    max_discountAmount:{type:Number,required:false},
    redeemingServiceID:{type:Number,required:true},
    redeemingOrgID:{type:String,required:true},
    image_1:{type:String,required:false},
    image_2:{type:String,required:false},
    image_3:{type:String,required:false},
    max_trnx_amount:{type:Number,required:true},
    validity_start_from:{type:Date,required:true},
    validity_end_on:{type:Date,required:true},
    status:{type:String,required:true}, //status can be the following - valid, expired, cancelled, scheduled, redeemed,failed
    created_at:{type:Date,required:true},
    cancelled_at:{type:Date,required:false},
    redeemed_at:{type:Date,required:false},
    locked_at:{type:Date,required:false},
    unlocked_at:{type:Date,required:false},
    scheduled_for_issue_at:{type:Date,required:false}
},
{timestamps : true})

export default mongoose.model("coupons",coupon)
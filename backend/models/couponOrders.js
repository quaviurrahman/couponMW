import mongoose from "mongoose"

const couponOrders = new mongoose.Schema({
    coupon_ID: { type:String, required: true},
    ref_Order_ID: { type:String, required: false},
    created_at: { type:Date, required: true},
    status: { type:String, required: true}, //Pending, Cancelled, Successfull, Failed
    cancelled_at: { type:Date, required: false},
    discount_applied_on: { type:String, required:true},
    original_principal_amount: { type:Number, required:true},
    original_charge_amount:  { type:Number, required:true},
    discount_amount: { type:Number, required:true},
    discounted_principal_amount : { type:Number, required:true},
    discounted_charge_amount : { type:Number, required:true},
    original_order_amount : { type:Number, required:true},
    discounted_order_amount : { type:Number, required:true}
},
    { timestamps: true })

export default mongoose.model("coupons", coupon)
/////////////////////////Merchant Payment with coupon/////////////////////////////
/*
This is the transaction request generated from a client end like a app where the customer requested to initiate a transaction. This payment module is going to
validate the transaction, do necessary queries to gather enough information for calculation, request to process the transaction with this information.

This function is responsible for processing a transaction by calling necessary API's sequentially and ensure the transaction processesing is completed.
*/

import axios from "axios"

export const merchant_payment_with_coupon = async (req,res)=> {
const coupon_id = req.body.couponID

//////////////////////Lock Coupon
const firstStep = lockCoupon(coupon_id)
const lockcouponresponse = await firstStep

/////////////////////Process Transaction
if(lockcouponresponse.status == 200) {
    const secondStep = processtransaction()
    const processtransactionresponse = await secondStep
    
 /////////////////////Redeem/Unlock Coupon
    if(processtransactionresponse.status == 200) {
        const thirdStep = redeemcoupon(coupon_id)
        const redeemcouponresult = await thirdStep
        res.json({
            "status":200,
            "response":"Successful",
            "message":"Transaction has been processed successfully. Coupon has been redeemed!",
            "lockCouponResponse":{lockcouponresponse},
            "processTrnxResponse":{processtransactionresponse},
            "redeemCouponResponse":{redeemcouponresult}
    })
}

} else {
    const secondStep = unlockcoupon(coupon_id)
    const unlockcouponresponse = await secondStep
    res.json({
        "status":200,
        "response":"Successful",
        "message":"Transaction has been processed successfully. Coupon has been redeemed!",
        "lockCouponResponse":{lockcouponresponse},
        "processTrnxResponse":"Skipped!",
        "redeemCouponResponse":{unlockcouponresponse}
})
}
}

//////////////////////////////////Middleware API calls///////////////////////////////////

async function lockCoupon (couponID) {
    const URL = `http://localhost:8800/coupons/lock/${couponID}`
    const result = await axios.put(URL)
    return await result.data
}

async function processtransaction () {
    const URL = 'http://localhost:8800/cps/transactions/init_trans_merchant_payment'
    const result = await axios.post(URL)
        if(await result.data == undefined) { return error.response.data} else { return result.data}
}

async function redeemcoupon (couponID) {
    const URL = `http://localhost:8800/coupons/redeem/${couponID}`
    const result = await axios.put(URL)
    return await result.data
}

async function unlockcoupon (couponID) {
    const URL = `http://localhost:8800/coupons/unlock/${couponID}`
    const result = await axios.put(URL)
    return await result.data
}

export default merchant_payment_with_coupon

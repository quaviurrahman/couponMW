/////////////////////////Merchant Payment with coupon/////////////////////////////
/*
This is the transaction request generated from a client end like a app where the customer requested to initiate a transaction. This payment module is going to
validate the transaction, do necessary queries to gather enough information for calculation, request to process the transaction with this information.

This function is responsible for processing a transaction by calling necessary API's sequentially and ensure the transaction processesing is completed.
*/

import axios from "axios"

export const merchant_payment_with_coupon = (req,res)=> {
const coupon_id = req.body.couponID
    
//////////////////////Lock Coupon

    const URL = `http://localhost:8800/coupons/lock/${coupon_id}`
    axios.put(URL)
    .then(function(response){
        const result = response.data
        res.json(result)
    })

/////////////////////Process Transaction


/////////////////////Redeem/Unlock Coupon
}
export default merchant_payment_with_coupon

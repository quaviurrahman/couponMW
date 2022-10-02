import axios from "axios"
///////////////////////////////////////couponOrderCalc////////////////////////////////////

/* This particular controller function will recieve some data through API containing order values and the coupn
applied by the user in the order. After receiving the data it will use it to calculate the order discount order value,
discount amount in response. It will also calculate the share rate amount of the redeeming organisation and coupon issuer.

There are four cases here:
1. Discount is flat amount
2. Discount in percentage with/without cap
3. Discount on principal order value [considering share rate]
4. Discount on order charge value */

export const couponOrderCalc = async (req,res) => {
    //global const throughout this function
    const principal_order_value = req.body.principalOrderValue
    const charge_value = req.body.chargeValue
    const coupon_applied_id = req.body.couponID

    const coupon_discount_details = await queryCoupon(coupon_applied_id)
    const redeeming_party_share_rates =  coupon_discount_details.discountShare
    const redeeming_party_share_rate = redeeming_party_share_rates.map(findShareRate)
    const shareRateAmount = redeeming_party_share_rate.filter(function (element) {
        return element != null
    })
    
    function findShareRate (shareRates) {
        const share_Rate = shareRates
        if (req.body.redeemingPartyID == share_Rate.redeemingPartyID) {
            const result = share_Rate.shareRate
            return result
        }else return null
        }
    
    //Discount on Principal order value [considering share rate]
if(coupon_discount_details.discountOrderComponent == "principal") {
    if(coupon_discount_details.discountType == "percentage") {
        const discountValue = (principal_order_value*(coupon_discount_details.discountAmount/100))
        if(discountValue >= coupon_discount_details.max_discountAmount) {
            const discountValue = coupon_discount_details.max_discountAmount
            const discountedPrincipalValue = principal_order_value - discountValue
            const discountedTotalOrderValue =  discountedPrincipalValue + charge_value
            const redeeming_party_share_rate_amount = (discountValue*(shareRateAmount/100))
            res.json({
                "status":200,
                "response":"Successful",
                "message":{
                    "originalPrincipalValue":principal_order_value,
                    "discountValue":discountValue,
                    "discountedPrincipalValue":discountedPrincipalValue,
                    "originalChargeValue":charge_value,
                    "discountedTotalOrderValue":discountedTotalOrderValue,
                    "redeemingPartyDiscountShareAmount":redeeming_party_share_rate_amount
                }
            })
        } else {
            const discountedPrincipalValue = principal_order_value - discountValue
            const discountedTotalOrderValue =  discountedPrincipalValue + charge_value
            const redeeming_party_share_rate_amount = (discountValue*(shareRateAmount/100))
            res.json({
                "status":200,
                "response":"Successful",
                "message":{
                    "originalPrincipalValue":principal_order_value,
                    "discountValue":discountValue,
                    "discountedPrincipalValue":discountedPrincipalValue,
                    "originalChargeValue":charge_value,
                    "discountedTotalOrderValue":discountedTotalOrderValue,
                    "redeemingPartyDiscountShareAmount":redeeming_party_share_rate_amount
                 }
                })
            }
    } else if (coupon_discount_details.discountType == "flat") {
        const discountValue = coupon_discount_details.discountAmount
        const discountedPrincipalValue = (principal_order_value - discountValue)
        const redeeming_party_share_rate_amount = (discountValue*(shareRateAmount/100))
        if(discountedPrincipalValue < 0) {
            res.json({
                "status":400,
                "response":"Failed",
                "message":"Discount amount has exceeded the principal value of the order!"
                })
        } else {
            const discountedTotalOrderValue = discountedPrincipalValue + charge_value
            res.json({
                "status":200,
                "response":"Successful",
                "message":{
                    "originalPrincipalValue":principal_order_value,
                    "discountValue":discountValue,
                    "discountedPrincipalValue":discountedPrincipalValue,
                    "originalChargeValue":charge_value,
                    "discountedTotalOrderValue":discountedTotalOrderValue,
                    "redeemingPartyDiscountShareAmount":redeeming_party_share_rate_amount
                 }
                })
        }

    }
} 
// Discount on Principal order value [NOT considering share rate]
else if(coupon_discount_details.discountOrderComponent == "charge"){
    const discountValue = req.body.chargeValue
    const discountedChargeValue = charge_value - discountValue
    const discountedTotalOrderValue = principal_order_value + discountedChargeValue
    res.json({
        "status":200,
        "response":"Successful",
        "message":{
            "originalChargeValue":charge_value,
            "discountValue":discountValue,
            "originalPrincipalValue":principal_order_value,
            "discountedChargeValue":discountedChargeValue,
            "discountedTotalOrderValue":discountedTotalOrderValue
        }
    })

} else {
    res.json({
        "status":200,
        "response":"Successfull",
        "message":"The discount is applied on order charge value!"
        })
}
}

//////////////////////////////////Middleware API calls///////////////////////////////////

async function queryCoupon (couponID) {
    const URL = `http://localhost:8800/coupons/lock/${couponID}`
    const result = await axios.put(URL)
    return await result.data
}

export default couponOrderCalc
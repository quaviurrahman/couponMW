import axios from "axios"
///////////////////////////////////////couponOrderCalc////////////////////////////////////

/* This particular controller function will recieve some data through API containing order values and the coupn
applied by the user in the order. After receiving the data from the client it will query the coupon details from 
the coupon system. Then using the payment information and the coupon details it will calculate the discount amount
and generate related breakdowns which it will provide back as reponse to the client.It will also calculate the 
share rate amount of the redeeming organisation and coupon issuer.

There are four cases here:
1. Discount is flat amount
2. Discount in percentage with/without cap
3. Discount on principal order value [considering share rate]
4. Discount on order charge value 

In case of share rate calculation there are 2 different cases:
1. the discountShare is a null array with no value : in this case system will not check redeeming party id and 
will calculate the share for the provided redeeming party id using the discountShareRate parameter value.
2. the discountShare is NOT null array: in this case the system will check redeeming party id. If redeeming party id
is in the list of discountShare parameter array list then it will check whether shareRate value is provided. If the
shareRate parameter value is provided for the redeeming party id then system will calculate using this shareRate value.
*/

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
    const general_discount_share_rate = coupon_discount_details.discountShareRate
 
    
if(redeeming_party_share_rates[0] == null) { //If the redeeming party share rate array is null then execute this block
     var considered_share_rate = general_discount_share_rate
} else { // or else if the redeeming party share rate array contains redeeming party and share rate information then execute this block
        var considered_share_rate = shareRateAmount
}
    function findShareRate (shareRates) { //this function checks for a match of redeeming party id and returns the share rate for thar redeeming party id
        const share_Rate = shareRates
        if(share_Rate != null) {
            if (req.body.redeemingPartyID == share_Rate.redeemingPartyID) {
                const result = share_Rate.shareRate
                return result
            }else return null
            } else return null
        }
        
    
    //Discount on Principal order value [considering share rate]
if(coupon_discount_details.discountOrderComponent == "principal") {
    if(coupon_discount_details.discountType == "percentage") {
        const discountValue = (principal_order_value*(coupon_discount_details.discountAmount/100))
        if(discountValue >= coupon_discount_details.max_discountAmount) {
            const discountValue = coupon_discount_details.max_discountAmount
            const discountedPrincipalValue = principal_order_value - discountValue
            const discountedTotalOrderValue =  discountedPrincipalValue + charge_value
            const redeeming_party_share_rate_amount = (discountValue*(considered_share_rate/100))
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
            const redeeming_party_share_rate_amount = (discountValue*(considered_share_rate/100))
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
        const redeeming_party_share_rate_amount = (discountValue*(considered_share_rate/100))
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
    const URL = `http://localhost:8800/coupons/querybyid/${couponID}`
    const result = await axios.get(URL)
    if(await result.data == undefined) { return error.response.data} else { return result.data}
}

export default couponOrderCalc
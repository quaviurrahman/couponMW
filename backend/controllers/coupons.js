///////////////////////////////////CONTENT///////////////////////////////////////
/*
# Coupon Issue
# Coupon Cancel
# Coupon Lock
# Coupon Unlock
# Coupon Redeem
# Coupon Retry Create
# Coupon Query All
# Coupon Query By ID
# Coupon Order Calc
# Coupon Query By Status
# Coupon Query by ID & Active Status
# Coupon Query by HolderID and Active Status
# Activate Scheduled Coupons
# Expire Active Coupons
# Coupon Validate
*/


import coupons from "../models/coupon.js"

/////////////////////////////////couponIssue/////////////////////////////////////

/*determining the status of the coupon created. If there is NO schedule date then the status will be in "scheduled" status
 if validity start date is in the future date or else the status will be "valid". On the other hand if there is a schedule
 date and its still in the future date then the status will be "scheduled" or else it will check whether the validity start
 is still in the future date compared to the current date and time. If yes, then the status will be "scheduled" or else the
 status will be "valid" */

 export const couponIssue = async (req,res) => {
    const validityEndDate = Date.parse(req.body.validity_end_on)
    const validityStartedAt = Date.parse(req.body.validity_start_from)
    const createdAt = Date.parse(Date())

    var status
    if(createdAt<validityStartedAt) {
        status = "scheduled"
    }
    else if (createdAt>validityStartedAt && createdAt<validityEndDate) {
        status = "active"
    }
    else if (createdAt>validityEndDate) {
        status = "expired"
    }
    else {
        status = "unknown"
    }

    const newcoupon = new coupons({...req.body,created_at:Date(),status:status})
    await newcoupon.save()
    res.json({
        status:200,
        response:"Successful",
        message:"Coupon Created Successfully"
    })
}
//////////////////////////////////couponCancel///////////////////////////////////////

/*checking the current status of the coupon before cancelling a coupon. If the current status of the coupon is "redeemed",
"expired" or "cancelled" then the status cannot be made to "cancelled". Only if the coupon is in "valid" or "scheduled"
state the coupon can be "cancelled"*/

export const couponCancel = async (req,res) => {
    const coupon = await coupons.findById(req.params.id)
    const couponstatus = coupon.status
    if (couponstatus== "redeemed" || couponstatus == "expired" || couponstatus == "cancelled") {
        res.json({
            status:409,
            response:"Denied",
            message:"Cannot be cancelled from current coupon status!"    
        })
    } else {
        await coupons.findByIdAndUpdate(req.params.id,{status:"cancelled"},{cancelled_at:Date()},{new : true})
        res.json({
            status:200,
            response:"Successful",
            message:"Coupon Cancelled Successfully"
        })
    }

}
/////////////////////////////////////couponLock//////////////////////////////////////

/* This will mainly used to lock the coupon before redemption or for any 3rd party confirmation for a successfull
transaction before a coupon is to be redeemed*/

export const couponLock = async (req,res) => {
    const coupon = await coupons.findById(req.params.id)
    const couponstatus = coupon.status
//checking the current status of the coupon before locking a coupon as coupon can be only locked when its it "valid" status
    if(couponstatus == "active") {
        await coupons.findByIdAndUpdate(req.params.id,{status:"locked", locked_at:Date()},{new : true})
        res.json({
            status:200,
            response:"Successful",
            message:"Coupon Locked successfully!"
        })
    } else {
        res.json({
            status:409,
            response:"Denied",
            message:"Coupon cannot be locked from current coupon status!"
        })
    }
    
}
///////////////////////////////////couponUnlock/////////////////////////////////////

/*checking the status of the coupon before unlocking a coupon as only coupon in "locked" status can be "unlocked". However,
while unlocking there must be a check whether to change the status to "valid","scheduled" or expired state based on the
coupon VALIDITY compared to the status update date and time*/

export const couponUnlock = async (req,res) => {
    const coupon = await coupons.findById(req.params.id)
    const couponstatus = coupon.status
    const validityStartDate = Date.parse(coupon.validity_start_from)
    const validityEndDate = Date.parse(coupon.validity_end_on)
    const createdAt = Date.parse(Date())


    if(couponstatus == "locked") {
        if(validityStartDate<createdAt && validityEndDate>createdAt) {
            await coupons.findByIdAndUpdate(req.params.id,{status:"active",unlocked_at:Date()},{new : true})
            res.json({
                status:200,
                response:"Successful",
                message:"Coupon Unlocked successfully!"
            })
        }
        else if(validityStartDate>createdAt) {
            await coupons.findByIdAndUpdate(req.params.id,{status:"scheduled",unlocked_at:Date()},{new : true})
            res.json({
                status:200,
                response:"Successful",
                message:"Coupon Unlocked successfully!"
            })
        } else {
            await coupons.findByIdAndUpdate(req.params.id,{status:"expired",unlocked_at:Date()},{new : true})
            res.json({
                status:200,
                response:"Successful",
                message:"Coupon Unlocked successfully!"
            })
        }

    } else {
        res.json({
            status:409,
            response:"Denied",
            message:"Coupon cannot be unlocked from current coupon status!"
        })
    }
}
////////////////////////////////////couponRedeem////////////////////////////////////////

export const couponRedeem = async (req,res) => {
    const coupon = await coupons.findById(req.params.id)
    const couponstatus = coupon.status
    if(couponstatus == "active" || couponstatus == "locked") {
        await coupons.findByIdAndUpdate(req.params.id,{status:"redeemed",redeemed_at:Date()},{new :true})
        res.json({
            status:200,
            response:"Successful",
            message:"Coupon Redeemed Successfully"
        })
    } else {
        res.json({
            status:409,
            response:"Denied",
            message:"The Coupon cannot be redeemed from the current status!"
        })
    }
    
}
//////////////////////////////////couponRetryCreate///////////////////////////////////
export const couponRetryCreate = async (req,res) => {
    res.json({
        status:200,
        response:"Successful",
        message:"Coupon Created Successfully"
    })
}
//////////////////////////////////////couponGetAll//////////////////////////////////////
export const couponGetAll = async (req,res) => {
    const coupon = await coupons.find()
    res
    .status(200)
    .json(coupon)
}
//////////////////////////////////////couponGetById//////////////////////////////////////
export const couponGetById = async (req,res) => {
    const coupon = await coupons.findById(req.params.id)
    res
    .status(200)
    .json(coupon)
}

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
    const coupon_discount_details = await coupons.findById(coupon_applied_id)
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

///////////////////////////////////////couponGetByStatus/////////////////////////////////////
export const couponGetByStatus = async (req,res) => {
    const coupon = await coupons.find({"status":req.params.status})
    res
    .status(200)
    .json(coupon)
}

/////////////////////////////////////activateScheduledCoupons/////////////////////////////////

/* The function of this is to check whether there is any scheduled coupon which is supposed to be activated now and then
make the status change from scheduled to active if the condition is true. This function will be consumed by scheduler which will
run periodically automatically to update the status of the coupons where necessary.*/

export const activateScheduledCoupons = async (req,res) => {
    const scheduledcouponlist = await coupons.find({"status":"scheduled"})
    scheduledcouponlist.map(activatecoupon)
    res.json({
        "status":200,
        "response":"Successfull",
        "message":"All scheduled coupons today are activated!"
    })
    }

/////////////////////////////////////expireActiveCoupons/////////////////////////////////

/*The function of this is to check whether there is any active coupn which is supposed to be expired now and then make the 
status change from active to expired if the condition is true. This function will be consumed by scheduler which will
run periodically automatically to update the status of the coupons where necessary.*/

export const expireActiveCoupons = async (req,res) => {
    const activecouponlist = await coupons.find({"status":"active"})
    activecouponlist.map(expirecoupon)
    res.json({
        "status":200,
        "response":"Successfull",
        "message":"All active coupons with expiration today have been made expired!"
    })
    
  async function expirecoupon(expirecoupons) {
        const expirecoupon = expirecoupons
            if(Date.parse(expirecoupon.validity_end_on)>=Date.parse(Date())) {
            const result = await coupons.findByIdAndUpdate(expirecoupon.id,{status:"expired"},{new : true})
            return result
        }
    }
}

///////////////////Active Coupon Query by ID, Service and Redeeming Org for a specific Coupon Holder////////////////////////

export const activecouponlistofuser = async (req,res) => {
    //This are the parameters fetched from the API request parameters
    const holder_id = req.body.holderID
    const service_id = req.body.serviceID
    const redeeming_org_id = req.body.redeemingOrgID
    const principal_order_value = req.body.principalOrderValue

    //The API parameters will be used to filter out coupon data here
    const couponlistforuser = await coupons.find({"holderId":holder_id})
    const activecouponlistforuser = couponlistforuser.filter(function(status) {
        return status.status == "active"
    })
    const activecouponlistforuserfilteredbyservice = activecouponlistforuser.filter(function(service) {
        for(let items in service.redeemingServiceID){
        return service.redeemingServiceID[items] == service_id
        }
    })
    const activecouponlistforuserfilteredbyserviceandredeemingorg = activecouponlistforuserfilteredbyservice.filter(function(redeemingorg) {
        for(let item in redeemingorg.discountShare) {
            const items = redeemingorg.discountShare[item]
            if(items.redeemingPartyID == redeeming_org_id){
                return true }
        }
    })
    const filterMinTrnxAmountCheck = activecouponlistforuserfilteredbyserviceandredeemingorg.filter(function (list) {
        return list.min_trnx_amount <= principal_order_value
    })

    //const getserviceids = await activecouponlistforuser.redeemingServiceID

    res.json({
        "status":200,
        "response":"Successful",
        "filteredListWithoutMinTrnxCheck": activecouponlistforuserfilteredbyserviceandredeemingorg,
        "filteredListWithMinTrnxCheck": filterMinTrnxAmountCheck
    })
}
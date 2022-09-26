import coupons from "../models/coupon.js"

/////////////////////////////////couponIssue/////////////////////////////////////
export const couponIssue = async (req,res) => {
    const validityEndDate = Date.parse(req.body.validity_end_on)
    const validityStartedAt = Date.parse(req.body.validity_start_from)
    const createdAt = Date.parse(Date())
 //determining the status of the coupon created. If there is NO schedule date then the status will be in "scheduled" status
 //if validity start date is in the future date or else the status will be "valid". On the other hand if there is a schedule
 //date and its still in the future date then the status will be "scheduled" or else it will check whether the validity start
 //is still in the future date compared to the current date and time. If yes, then the status will be "scheduled" or else the
 //status will be "valid"
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
export const couponCancel = async (req,res) => {
    const coupon = await coupons.findById(req.params.id)
    const couponstatus = coupon.status
//checking the current status of the coupon before cancelling a coupon. If the current status of the coupon is "redeemed",
//"expired" or "cancelled" then the status cannot be made to "cancelled". Only if the coupon is in "valid" or "scheduled"
//state the coupon can be "cancelled"
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
export const couponLock = async (req,res) => {
    const coupon = await coupons.findById(req.params.id)
    const couponstatus = coupon.status
//checking the current status of the coupon before locking a coupon as coupon can be only locked when its it "valid" status
    if(couponstatus == "valid") {
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
export const couponUnlock = async (req,res) => {
    const coupon = await coupons.findById(req.params.id)
    const couponstatus = coupon.status
    const validityStartDate = Date.parse(coupon.validity_start_from)
    const validityEndDate = Date.parse(coupon.validity_end_on)
    const createdAt = Date.parse(Date())
//checking the status of the coupon before unlocking a coupon as only coupon in "locked" status can be "unlocked". However,
//while unlocking there must be a check whether to change the status to "valid","scheduled" or expired state based on the
//coupon VALIDITY compared to the status update date and time

    if(couponstatus == "locked") {
        if(validityStartDate<createdAt && validityEndDate>createdAt) {
            await coupons.findByIdAndUpdate(req.params.id,{status:"valid",unlocked_at:Date()},{new : true})
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
    if(couponstatus == "valid" || couponstatus == "locked") {
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
//////////////////////////////////couponScheduledIssue////////////////////////////////
export const couponScheduledIssue = async (req,res) => {
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
export const couponOrderCalc = async (req,res) => {
    res.json({
        status:200,
        response:"Successful",
        message:"Coupon Created Successfully"
    })
}

///////////////////////////////////////couponGetByStatus/////////////////////////////////////
export const couponGetByStatus = async (req,res) => {
    const coupon = await coupons.find({"status":req.params.status})
    res
    .status(200)
    .json(coupon)
}
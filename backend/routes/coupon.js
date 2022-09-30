import express from "express"
import {
    couponIssue,
    couponCancel,
    couponLock,
    couponUnlock,
    couponRedeem,
    couponRetryCreate,
    couponGetAll,
    couponGetById,
    couponOrderCalc,
    couponGetByStatus,
    activateScheduledCoupons,
    expireActiveCoupons,
    activecouponlistofuser
} from "../controllers/coupons.js"

const router = express.Router()

router.post("/create",couponIssue)
router.put("/cancel/:id",couponCancel)
router.put("/lock/:id",couponLock)
router.put("/unlock/:id",couponUnlock)
router.put("/redeem/:id",couponRedeem)
router.post("/retry",couponRetryCreate)
router.get("/queryall",couponGetAll)
router.get("/querybyid/:id",couponGetById)
router.post("/calculate",couponOrderCalc)
router.get("/querybystatus/:status",couponGetByStatus)
router.put("/activatescheduledcoupons",activateScheduledCoupons)
router.put("/expireactivecoupons",expireActiveCoupons)
router.get("/activecouponlistofuser",activecouponlistofuser)


export default router
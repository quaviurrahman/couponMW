import express from "express"
import {
    couponIssue,
    couponCancel,
    couponLock,
    couponUnlock,
    couponRedeem,
    couponRetryCreate,
    couponScheduledIssue,
    couponGetAll,
    couponGetById,
    couponOrderCalc,
    couponGetByStatus
} from "../controllers/coupons.js"

const router = express.Router()

router.post("/create",couponIssue)
router.put("/cancel/:id",couponCancel)
router.put("/lock/:id",couponLock)
router.put("/unlock/:id",couponUnlock)
router.put("/redeem/:id",couponRedeem)
router.post("/retry",couponRetryCreate)
router.post("/schedule",couponScheduledIssue)
router.get("/getall",couponGetAll)
router.get("/getbyid/:id",couponGetById)
router.post("/calculate",couponOrderCalc)
router.get("/getbystatus/:status",couponGetByStatus)

export default router
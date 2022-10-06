import express from "express"
import generateCouponCode from "../controllers/couponCodeGenerator.js"

const router = express.Router()

router.post("/",generateCouponCode)

export default router
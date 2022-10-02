import express from "express"
import merchant_payment_with_coupon from "../controllers/transactionProcessor.js"

const router = express.Router()

router.post("/merchant_payment_with_coupon",merchant_payment_with_coupon)

export default router
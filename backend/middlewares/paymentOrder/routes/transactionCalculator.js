import express from "express"
import couponOrderCalc from "../controllers/transactionCalculator.js"

const router = express.Router()

router.post("/calculate/transaction_with_coupon",couponOrderCalc)

export default router
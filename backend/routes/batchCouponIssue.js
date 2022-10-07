import express from "express"
import uploadCouponHolderIDgsheet from "../controllers/batchCouponIssue.js"

const router = express.Router()

router.get("/getHolderIDlist",uploadCouponHolderIDgsheet)

export default router
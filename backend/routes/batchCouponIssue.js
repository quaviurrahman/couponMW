import express from "express"
import { uploadCouponHolderIDgsheet,createBatchCouponIssueTask,getALLbatchCouponIssueTasks } from "../controllers/batchCouponIssue.js"

const router = express.Router()

router.get("/uploadHolderIDlistFromGsheet",uploadCouponHolderIDgsheet)
router.post("/createbatchcouponissuetask",createBatchCouponIssueTask)
router.get("/getALLbatchCouponIssueTasks",getALLbatchCouponIssueTasks)

export default router
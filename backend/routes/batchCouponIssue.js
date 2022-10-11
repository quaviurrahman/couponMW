import express from "express"
import { 
    uploadCouponHolderIDgsheet,
    createBatchCouponIssueTask,
    getALLbatchCouponIssueTasks,
    uploadShareRatesgsheet,
    executeCouponIssueBatchTask 
} from "../controllers/batchCouponIssue.js"

const router = express.Router()

router.post("/uploadHolderIDlistFromGsheet",uploadCouponHolderIDgsheet)
router.post("/createbatchcouponissuetask",createBatchCouponIssueTask)
router.get("/getALLbatchCouponIssueTasks",getALLbatchCouponIssueTasks)
router.post("/uploadShareRateFromGsheet",uploadShareRatesgsheet)
router.post("/executeCouponIssueBatchTask",executeCouponIssueBatchTask)

export default router
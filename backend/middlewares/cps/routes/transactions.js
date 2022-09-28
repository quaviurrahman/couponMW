import {init_trans_merchant_payment,
        init_trans_cashout_from_app}
         from "../controllers/transactions.js"
import express from "express"

const router = express.Router()

router.post("/init_trans_merchant_payment",init_trans_merchant_payment)
router.post("/init_trans_cashout_from_app",init_trans_cashout_from_app)

export default router
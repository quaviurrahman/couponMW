export const init_trans_merchant_payment = async (req,res) => {
    res
    .status(200)
    .json({
        "status":200,
        "message":"Transaction Successfull",
        "transactionType":"merchant_payment",
        "Transaction_id":"XD998D0083",
        "created_at":Date()
    })
}

export const init_trans_cashout_from_app = async (req,res) => {
    res
    .status(200)
    .json({
        "status":200,
        "message":"Transaction Successfull",
        "transactionType":"cash_out",
        "Transaction_id":"XD998D0083",
        "created_at":Date()
    })
}
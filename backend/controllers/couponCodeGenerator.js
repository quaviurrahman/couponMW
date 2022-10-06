import voucher_codes from "voucher-code-generator"

export const generateCouponCode = async (req,res)=> { 
    const length = req.body.length
    const count = req.body.count
    const charset = req.body.charset
    const prefix = req.body.prefix
    const postfix = req.body.postfix
    const pattern = req.body.pattern
    const isSequential = req.body.isSequential
    const sequentialOffset = req.body.sequentialOffset

    if(isSequential == 0) {
        try {
            res.send(voucher_codes.generate({
                count: count,
                length: length,
                charset: voucher_codes.charset(charset),
                prefix: prefix,
                postfix: postfix,
                pattern: pattern,
        
            }))}
            catch (e) {
                res.send("Sorry! Codes cannot be generator due to wrong configuration parameter combination! Try with a different combination of configuaration parameter value!")
            }
    
} else {
        try {
            res.send(voucher_codes.generate({
                count: count,
                length: length,
                charset: voucher_codes.charset(charset),
                prefix: prefix,
                postfix: postfix,
                pattern: pattern,
        
            },
            sequentialOffset)) }
            catch (e) {
                res.send("Sorry! Codes cannot be generator due to wrong configuration parameter combination! Try with a different combination of configuaration parameter value!")
            }
}
}

export default generateCouponCode
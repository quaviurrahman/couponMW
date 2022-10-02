import express from "express"
import users from "./routes/user.js"
import coupons from "./routes/coupon.js"
import cps_transactions from "./middlewares/cps/routes/transactions.js"
import paymentOrder_transactions from "./middlewares/paymentOrder/routes/transactionProcessor.js"
import paymentOrder_calculations from "./middlewares/paymentOrder/routes/transactionCalculator.js"
import dotenv from "dotenv"
import mongoose, { get } from "mongoose"
import cron from "node-cron"
import axios from "axios"

dotenv.config();
const port = process.env.PORT
const app = express ()
var scheduledcoupons

///////////////////////////////Coupon_Middleware////////////////////////////////
app.use(express.json())
app.use("/users",users)
app.use("/coupons",coupons)

///////////////////////////////CPS_Middleware [MOCK]////////////////////////////////

app.use("/cps/transactions",cps_transactions)

///////////////////////////////PaymentOrder_Middleware [MOCK]///////////////////////

app.use("/paymentOrder/process",paymentOrder_transactions)
app.use("/paymentOrder/calculate",paymentOrder_calculations)

////////////////////////////mongoDB initialize//////////////////////////////
mongoose
  .connect(process.env.MONGODB_URL)
 .then(() => { 
    console.log("Database Connected!")
  })

  /////////////////////////application initialize///////////////////////////
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

////////////////////////////////schedulers//////////////////////////////////

// scheduler to activate scheduled coupons which runs every 6 hours
//cron.schedule('* * */6 * * *',()=>{
//  axios
//  .get('http://localhost:8800/coupons/activatescheduledcoupons')
//  .then(console.log(response.data))
//})

// scheduler to expire coupons which runs every 6 hours
//cron.schedule('* * */6 * * *',()=>{
//  axios
//  .get('http://localhost:8800/coupons/expireactivecoupons')
//  .then(console.log(response.data))
//})


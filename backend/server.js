import express from "express"
import users from "./routes/user.js"
import coupons from "./routes/coupon.js"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cron from "node-cron"
import axios from "axios"

dotenv.config();
const port = process.env.PORT
const app = express ()
var scheduledcoupons

///////////////////////////////middlewares////////////////////////////////
app.use(express.json())
app.use("/users",users)
app.use("/coupons",coupons)

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

// this is a cron job to fetch the list of coupons which are in sheduled status



/* This is where all the necessary functions will be written in order to acheive bulk coupon issue functionality

Following things are the sub-functionalities required to achieve the bulk coupon issue functionality:
# get provide basic coupon details to be provided to all the targeted users
# save the batch config in DB
# uploading a excel file in a web directory
# read the data of that file and validate the data provided
# once validated get data and save in batch DB for that batchID
# once batch operation config is saved the coupon issue can start

To perform the above functionality the following API needs to be invoked:
# Create batch coupon issue task
# Validate customer list from a list source 
# Inititate issue Batch coupon task
# Query batch coupon issue task status

*/

import batchCouponIssueTask from "../models/batchCouponIssue.js"
import * as xlsx from "xlsx/xlsx.mjs"
import * as fs from "fs"
import google from "googleapis"
import axios from "axios"
//######################################## Create  coupon issue task ############################################


export const createBatchCouponIssueTask = async (req,res) => {
    const newbatchcouponissuetask = new batchCouponIssueTask({...req.body,created_at:Date(),taskStatus:"drafted"})
    await newbatchcouponissuetask.save()
}

//######################################## Upload coupon Holder id from gsheet ############################################


export const uploadCouponHolderIDgsheet = async (req,res) => {
const gsheetdata = await axios('https://script.googleusercontent.com/macros/echo?user_content_key=Q6-L3vksgNdoz4a3WZSrHnVz1JyeKYiDlLJOIiliffFT3E_stMKLYVHSmWTkHi3-bw74TPI9-ocKTOwORkFb1DRbehZVwhV5m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF_7rUKRqeFZ3WjXzAe5CG5dMZipato9T-gPigPP10e3TdimX4-7QDKVeXbx6WOqGjWVqixcsXFAltHogL9ElDi_6WNyKEQrJg&lib=MsdJAmit53eBqgUfqLEe39b8lFvJ_Aw0O')
                        .then((response) => {
                            return response
                        })
                        res.send(gsheetdata.data)
                    }

export default uploadCouponHolderIDgsheet
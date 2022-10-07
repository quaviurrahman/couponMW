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
//######################################## Create batch coupon issue task ############################################


export const createBatchCouponIssueTask = async (req,res) => {
    const newbatchcouponissuetask = new batchCouponIssueTask({...req.body,created_at:Date(),taskStatus:"drafted"})
    await newbatchcouponissuetask.save()
}

//######################################## Upload coupon Holder id from gsheet ############################################


export const uploadCouponHolderIDgsheet = async(req,res) => {
const gsheetdata = fetch('https://script.google.com/macros/s/AKfycby-aAGke5agDxOt87cZR8km1y_SC8bdrdgnV4itHUiycXMG90sClLplVEtkmKYXK5ET/exec')
                        .then(response => {
                            return response
                        })
}
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
    const newbatchcouponissuetask = new batchCouponIssueTask({...req.body,task_created_at:Date(),taskStatus:"drafted"})
    await newbatchcouponissuetask.save()
    res.json(newbatchcouponissuetask)
}

//######################################## Upload coupon Holder id from gsheet ############################################


export const uploadCouponHolderIDgsheet = async (req,res) => {
    const gsheetdata = await axios('https://script.google.com/macros/s/AKfycbwPTuJTTqhZJ4Ix3zc5WIBjIKtHwS_qelFkRoGwxIMjfkfIiliyrz3_4v5iA1M0Aute/exec')
                        .then((response) => {
                            return response
                        })
                        //res.send(gsheetdata.data)
                        var result = []
                        gsheetdata.data[0].data.forEach(i => {
                            result.push(i.holderID)
                        })
                        const fetchedTask = await batchCouponIssueTask.findById(req.body.taskID)
                        result.forEach(i => {
                            fetchedTask.holderId.push(i)
                        })
                        await batchCouponIssueTask.findByIdAndUpdate(req.body.taskID,fetchedTask,{new:true})
                        res.json({
                            "status":200,
                            "message":"HolderID data pushed successfully!",
                            "tasksID":req.body.taskID,
                            "holderID":fetchedTask

                        })
                    }


//######################################## Get ALL coupon issue task details #############################################

export const getALLbatchCouponIssueTasks = async (req,res) => {
    const result = await batchCouponIssueTask.find()
    res.json(result)
}


export default { 
    uploadCouponHolderIDgsheet,
    createBatchCouponIssueTask,
    getALLbatchCouponIssueTasks
}

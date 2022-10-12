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
# Query batch coupon issue task statusÏ

*/

import batchCouponIssueTask from "../models/batchCouponIssue.js"
import * as xlsx from "xlsx/xlsx.mjs"
import * as fs from "fs"
import google from "googleapis"
import axios from "axios"

//######################################## Create  coupon issue task ############################################


export const createBatchCouponIssueTask = async (req, res) => {
    const newbatchcouponissuetask = new batchCouponIssueTask({ ...req.body, task_created_at: Date(), taskStatus: "drafted" })
    await newbatchcouponissuetask.save()
    res.json(newbatchcouponissuetask)
}

//######################################## Upload coupon Holder id from gsheet ############################################


export const uploadCouponHolderIDgsheet = async (req, res) => {
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
    await batchCouponIssueTask.findByIdAndUpdate(req.body.taskID, fetchedTask, { new: true })
    res.json({
        "status": 200,
        "message": "HolderID data pushed successfully!",
        "tasksID": req.body.taskID,
        "holderID": fetchedTask

    })
}


//######################################## Get ALL coupon issue task details #############################################

export const getALLbatchCouponIssueTasks = async (req, res) => {
    const result = await batchCouponIssueTask.find()
    res.json(result)
}


//######################################## Upload coupon SHARE RATES from gsheet ############################################


export const uploadShareRatesgsheet = async (req, res) => {
    const gsheetdata = await axios('https://script.google.com/macros/s/AKfycbxWNaXNjw1-iR25NOo234iVZjSCia0C8ullJd7kYotkY6Mno67X8Ay1RV9dqIUi1kU/exec')
        .then((response) => {
            return response
        })
    // res.send(gsheetdata.data)
    var result = []
    gsheetdata.data[0].data.forEach(i => {
        result.push({ "redeemingPartyID": i.payerIdentityID, "shareRate": i.contributionPerc })
    })
    const fetchedTask = await batchCouponIssueTask.findById(req.body.taskID)
    result.forEach(i => {
        fetchedTask.discountShare.push(i)
    })
    await batchCouponIssueTask.findByIdAndUpdate(req.body.taskID, fetchedTask, { new: true })
    res.json({
        "status": 200,
        "message": "Share Rate data pushed successfully!",
        "tasksID": req.body.taskID,
        "holderID": fetchedTask

    })
}

export const executeCouponIssueBatchTask = async (req, res) => {
    const batchTaskID = req.body.taskID
    const batchTask = await batchCouponIssueTask.findById(batchTaskID)
    const newIssuedCoupons = await batchTask.holderId.forEach(i => {
        const url = 'http://localhost:8800/coupons/create'
        const params = {
            "code": "AWWD9932",
            "holder_type": batchTask.holder_type,
            "desc_1": batchTask.desc_1,
            "desc_2": batchTask.desc_2,
            "desc_3": batchTask.desc_3,
            "discountType": batchTask.discountType,
            "discountAmount": batchTask.discountAmount,
            "discountOrderComponent": batchTask.discountOrderComponent,
            "max_discountAmount": batchTask.max_discountAmount,
            "redeemingServiceID": batchTask.redeemingServiceID,
            "discountShare": batchTask.discountShare,
            "discountShareRate": batchTask.discountShareRate,
            "image_1": batchTask.image_1,
            "image_2": batchTask.image_2,
            "image_3": batchTask.image_3,
            "min_trnx_amount": batchTask.min_trnx_amount,
            "validity_start_from": batchTask.validity_start_from,
            "validity_end_on": batchTask.validity_end_on,
            "valid_for": batchTask.valid_for,
            "scheduled_for_issue_at": batchTask.scheduled_for_issue_at,
            "holderId": i
        }
        axios
            .post(url, params)
            .then((response) => { return response })
    })
    res.json(newIssuedCoupons)
}

export default {
    uploadCouponHolderIDgsheet,
    createBatchCouponIssueTask,
    getALLbatchCouponIssueTasks,
    uploadShareRatesgsheet
}
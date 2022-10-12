import profiles from "../models/profiles.js"
import bcrypt from "bcryptjs"
import { createError } from "../utils/errorHandler/error.js";
import jwt from "jsonwebtoken";

//################################################ Register ##################################################

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.passphrase, salt);
        const newProfile = new profiles({
            username: req.body.username,
            passphrase: hash,
            role: req.body.role,
            status: "incomplete"
        });

        await newProfile.save()
        res.status(200).send("User has been created")
    } catch (err) {
        next(err)
    }
}

//############################################# Login ############################################

export const login = async (req, res, next) => {
    try {
        const user = await profiles.findOne({ username: req.body.username })
        if (!user) return next(createError(404, "User not found!"))

        const isPasswordCorrect = await bcrypt.compare(req.body.passphrase, user.passphrase)
        if (!isPasswordCorrect) return next(createError(400, "Wrong passphrase or username!"))
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT);

        const { passphrase, role, ...otherDetails } = user._doc;
        res
            .cookie("access_token", token, {
                httpOnly: true
            })
            .status(200)
            .json({ ...otherDetails })

    } catch (err) {
        next(err)
    }
}

//############################################# Update Profile Information ############################################

export const updateProfile = async (req,res,next) => {
    try{
        const updatedProfile = await profiles.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new : true})
        res.status(200).json(updatedProfile)
       } catch(err) {
        next(err)
       }
}

//############################################# Deactivate Profile Status ############################################

export const deactivateProfile = async (req,res,next) => {
    try{
        await profiles.findByIdAndUpdate({"status":"Active"})
        res.status(200).json("User has been deactivated!")
       } catch(err) {
        next(err)
       }
}

//############################################# Get by id profile information ############################################

export const getProfile = async (req,res,next) => {
    try{
        const user = await profiles.findById(
            req.params.id)
        res.status(200).json(user)
       } catch(err) {
        next(err)
       }
}

//############################################# Get all profile information ############################################

export const getAllProfiles = async (req,res,next) => {
    try{
        const users = await profiles.find()
        res.status(200).json(users)
       } catch(err) {
        next(err)
       }
}
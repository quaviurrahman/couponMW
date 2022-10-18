import express from "express"
import {
    login, 
    register, 
    updateProfile, 
    deactivateProfile, 
    getProfile, 
    getAllProfiles
} from "../controllers/profiles.js"
import { verifyToken } from "../utils/auth/verifyToken.js"

const router = express.Router()

router.post("/auth/login", login)
router.post("/auth/register", register)
router.post("/updateProfile", updateProfile)
router.post("/deactivateProfile", deactivateProfile)
router.get("/getProfile", getProfile)
router.get("/getAllProfiles", getAllProfiles)
router.get("/verifyToken",verifyToken)


export default router
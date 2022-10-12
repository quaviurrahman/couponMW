import express from "express"
import {
    login, 
    register, 
    updateProfile, 
    deactivateProfile, 
    getProfile, 
    getAllProfiles
} from "../controllers/profiles.js"

const router = express.Router()

router.post("/auth/login", login)
router.post("/auth/register", register)
router.post("/updateProfile", updateProfile)
router.post("/deactivateProfile", deactivateProfile)
router.get("/getProfile", getProfile)
router.get("/getAllProfiles", getAllProfiles)

export default router
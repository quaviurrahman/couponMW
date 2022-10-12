import mongoose from "mongoose"

const individualKYC = new mongoose.Schema({
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: String, required: true },
    mobileNumber: {
        type: [{
            cellNumber: { type: String, required: false },
            isVerified: { type: Number, required: false },
            isPreferred: { type: Number, required: false },
            UUID: { type: String, required: false }
        }], required: false
    },
    profileID: { type: Number, required: true },
    email: {
        type: [{
            email_provider: { type: String, required: false },
            email: { type: String, required: false },
            isVerified: { type: Number, required: false },
            isPreferred: { type: Number, required: false }
        }], required: false
    },
    profile_image: { type: String, required: false },
    blood_group: { type: String, required: false }
}, {
    timestamps: true
})

export default mongoose.model("individualKYC", individualKYC)
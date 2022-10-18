import mongoose from "mongoose"

const organizationKYC = new mongoose.Schema({
    name: { type: String, required: true },
    shortcode: { type: String, required: true },
    status: { type: String, required: true },
    aggregatorID: { type: Number, required: false },
    organizationID: { type: Number, required: false },
    individualID: { type: Number, required: true },
    fingerprint: { type: String, required: false },
    govtIssuedUniqueID: {
        type: [{
            documentType: { type: String, required: false },
            documentID: { type: TypeError, required: false },
            isVerified: { type: Number, required: false },
            documentImage: { type: String, required: false }
        }], required: false
    }
}, {
    timestamps: true
})

export default mongoose.model("profiles", profiles)
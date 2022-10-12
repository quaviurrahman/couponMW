import mongoose from "mongoose"

const profiles = new mongoose.Schema({
    username: { type: String, required: true },
    passphrase: { type: String, required: true },
    status: { type: String, required: true },
    aggregatorID: { type: Number, required: false },
    organizationID: { type: Number, required: false },
    individualID: { type: Number, required: false },
    fingerprint: { type: String, required: false },
    govtIssuedUniqueID: {
        type: [{
            documentType: { type: String, required: false },
            documentID: { type: String, required: false },
            isVerified: { type: Number, required: false },
            documentImage: { type: String, required: false }
        }], required: false
    },
    role: { type: String, required: false }
}, {
    timestamps: true
})

export default mongoose.model("profiles", profiles)
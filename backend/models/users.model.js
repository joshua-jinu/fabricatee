import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const itemSchema = new mongoose.Schema({
    design: { type: mongoose.Schema.Types.ObjectId, ref: "Design", required: true },
    fabric: { type: mongoose.Schema.Types.ObjectId, ref: "Fabric", required: true },
    measurementProfile: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    price: {
        fabric: { type: Number, required: true },
        stitching: { type: Number, required: true },
    },
});

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phoneNumber: { type: String, default:"NA" },
        password: { type: String, required: true },
        address: [
            {
                name: { type: String, required: true },
                line1: { type: String, required: true },
                city: { type: String, required:true },
                state: { type: String, required: true },
                pincode: { type: Number, required: true },
            },
        ],
        measurements: {
            type: Map,
            of: new mongoose.Schema({
                name: { type: String, required: true },
                dimensions: {
                    type: Map,
                    of: Number,
                    required: true,
                },
            }),
        },
        wishlist: { type: [itemSchema], default: [] },
        cart: {
            items: { type: [itemSchema], default: [] },
            price: {
                totalmrp: { type: Number, default: 0 },
                discount: { type: Number, default: 0 },
                tax: { type: Number, default: 0 },
                delivery: { type: Number, default: 0 },
                total: { type: Number, default: 0 },
            },
        },
        orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
        profilePic: {
            url: { type: String, default: "https://res.cloudinary.com/dabeupfqq/image/upload/v1735668108/profile_sgelul.png" },
            alt: { type: String, default: "Profile Photo" },
        },
    },
    { timestamps: true }
);

// Pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(new Error("Password encryption failed. Please try again."));
    }
});

// Instance method for password validation
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
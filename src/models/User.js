const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

// User Schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        uniqueKey: {
            type: String,
            unique: true,
            required: true,
        },
    },
    {timestamps: true}
);


// Hashing the password before saving the user
userSchema.pre("save", async function(next){
    
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

module.exports = mongoose.model("User", userSchema);

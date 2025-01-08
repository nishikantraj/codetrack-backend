const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const registerUser = async (req,res)=>{
    
    const {name, email, password} = req.body;
    try {
        //Check if user already exists
        
        const existingUser = await User.findOne({email})
        if(existingUser)
            return res.status(400).json({message:"User already exists"});
        //Generate unique key
        const uniqueKey = `key-${Math.random().toString(36).substring(2,9)}`;

        //Create and save new user
        const user = new User({ name, email, password, uniqueKey }); 
        await user.save();
        res.status(201).json({message:"User registered successfully", uniqueKey});

    } catch (error) {
        res.status(500).json({message:"Server error", error:error.message})        
    }
};

const loginUser = async (req,res)=>{
    const {email, password}= req.body

    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"User not found"})
        
        //Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(401).json({message:"Invalid credentails"})
        
        // Generate JWT
        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )
        res.status(200).json({message:"Login Successful", token, uniqueKey:user.uniqueKey})
    } catch (error) {
        res.status(500).json({message:"Server error", error: error.message})   
    }
};

module.exports = {registerUser, loginUser}
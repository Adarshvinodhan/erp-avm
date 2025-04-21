import {User} from "../models/user.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

//Register User
const registerUser = async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        const existingUser = await User.findOne({$or:[{username},{email}]});
        if(existingUser){
            if(existingUser && (existingUser.username === username || existingUser.email === email)){
                return res.status(400).json({
                    message:"username or email already Registered"
            })
        }}else{
            const hashedPassword = await bcrypt.hash(password,10)
            const newUser = new User(
                {
                 username,
                 email,
                 password:hashedPassword
                })
            await newUser.save()

            res.status(201).json({
                message:"User created successfully",
                user:{username,email}
            })

        }

    }
    catch(e){
        console.log(e)
        res.status(500).json({
            message:"Register failed,Try again"
        })
    }
}


//Login User

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "Username not found" });
        }

        const pass = await bcrypt.compare(password, user.password);
        if (!pass) {
            return res.status(404).json({ message: "Password incorrect" });
        }
        
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.SECRET_KEY
        );

        return res.status(200).json({
            message: "Login successful",
            user: { username: user.username, email: user.email },
            token: token
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Login failed. Please try again."
        });
    }
};

export { registerUser, loginUser };

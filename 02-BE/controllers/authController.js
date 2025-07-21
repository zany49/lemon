import { hashPassword, comparePassword } from "../helper/auth.js";
import User from "../models/user.js";
import { emailCheck, passwordCheck, phoneCheck } from "../helper/regexvalidations.js";
import jwt from "jsonwebtoken";


export const registerController = async (req, res) => {
  try {
     const {email,password} = req.body
        if(!emailCheck(email)){
          return res.status(400).json({error:"Valid Email Required"})
         }

        if(!passwordCheck(password)){
           return res.status(400).json({ message: `Password must be at least 6 characters and include letters and numbers`});
        }
        if (email && email.trim() !== '') {
            const existingEmail = await User.findOne({ email: email.toLowerCase() });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already registered' });
            }
        }

        const hashPwd = await hashPassword(password);
        const createuser = new User({
            email: email && email.trim() !== '' ? email.toLowerCase() : undefined,
            password:hashPwd
        });
     await createuser.save();
     res.status(200).json({ message: "User Created", data:createuser });
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
};


export const loginController = async (req, res)=>{
try{
    const {email , password}= req.body;
    if(!emailCheck(email)){
        return res.status(400).json({error:"Valid Email Required"})
    }
    if(!passwordCheck(password)){
      return res.status(400).json({ message: `Password must be at least 6 characters and include letters and numbers`});
    }
    const user = await User.findOne({ email })
    if(!user)  
    {
      return res.json({error:"No user Found"})
    }
    const match = await comparePassword(password, user.password)
    if(!match) 
    {
      return res.json({error:"Wrong password"})
    }
    const token = jwt.sign({_id: user.id},process.env.JWT_SECRET,{
      expiresIn: "7d",
    });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
    res.status(200).json({
      message:"Login Successful",
      token,
      user,
    })

}catch(err){
    console.error(err);
    res.json({error:"error,try again"})
    
}
};

export const currentUser =async(req,res) =>{
try{
    const user = await User.findOne({_id:req.auth._id});
    if(!user){
      res.status(401).json({message:"Un Authorized"})
    }
    // res.json(user);
    res.status(200).json({ok: true})
  }catch(err){
    console.log(err);
    res.sendStatus(400);
  }
};

export const logoutController = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
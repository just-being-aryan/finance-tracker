import bcrypt from 'bcryptjs'
import { User } from '../models/user.model.js'
import {ApiError} from '../utils/apiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.SECRET_KEY, {
        expiresIn : '7d',
    });
};



//@route POST /api/isers/register

export const registerUser = asyncHandler(async (req,res) =>{ 
    const {username,email,password} = req.body

    if(!username || !password || !email) {
        throw new ApiError(400,'All fields are required')
    }

    const existingUser = await User.findOne({email}) //because email is unique

    if(existingUser){
        throw new ApiError(409, 'User already exists!')
    }

    const hashedPassword = await bcrypt.hash(password,8);

    const newUser = await User.create({
        username,
        email,
        password : hashedPassword,

    })

    res.status(201)
    .json({
        success : true,
        message : 'User Registered Successfully',
        user : {
            _id :newUser._id,
            username : newUser.username,
            email : newUser.email,
            token : generateToken(newUser._id)
        }
    })

})



// POST /api/users/login

export const loginUser = asyncHandler( async (req,res) => {

    const {email,password} = req.body

    if(!email || !password) {
        throw new ApiError(400, 'Email and password are required!')
    }

    const user = await User.findOne({email});

    if(!user) {
        throw new ApiError(401,'Invalid email or password')
    }
    

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) {
        throw new ApiError(401,'Invalid email or password')
    }

    const token = generateToken(user._id)


     res.cookie('token', token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'lax',
     maxAge: 7 * 24 * 60 * 60 * 1000 
    })

    res.status(200)
    .json({
        success : true,
        message : 'Logged in Successfully',
        user : {
            _id : user._id,
            username : user.username,
            email : user.email,
            token : token
        }
    })

})


//GET /api/users/getUser

export const getUser = asyncHandler( async(req,res) => {
    const user = req.user

    res.status(200).json({
        success : true,
        user : {
            _id : user._id,
            username : user.username,
            email : user.email,
            role : user.role
        }
    })
})

//POST /api/users/deleteUser

export const deleteUser = asyncHandler( async(req,res) => {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
    throw new ApiError(404, 'User not found');
    }

    res.status(200)
    .json(
        {
            success : true,
            message : "User deleted successfully",
            user : {
                _id : user._id,
                username : user.username,
                email : user.email,
                role : user.role
            }
        }
    )

} )





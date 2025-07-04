import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'

//To Protect Private routes by verifying JWT Tokens

export const protect = async (req,res,next) => {
    const authHeaders = req.headers.authorization;

    if(!authHeaders?.startsWith('Bearer')) {
        return res.status(401).json({message : "Unauthorized : No token provided"})
    }


    try {
        const token = authHeaders.split(' ')[1];
        const decoded = jwt.verify(token,process.env.SECRET_KEY)

        const user = await User.findById(decoded.userId).select('-password');
        if(!user) throw new Error('User not found')
        
        req.user = user
        next();
    }catch(err) {
        res.status(401).json({message : "Unauthorized : Invalid Token"})
    }
} 
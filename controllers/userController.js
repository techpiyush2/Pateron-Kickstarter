import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import {PrismaClient } from "@prisma/client";
import {generatePassword} from "../utils/genPass.js"
import {compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { renameSync } from "fs";


const prisma = new PrismaClient();


export const register = catchAsyncError(async (req, res, next) => {
  const {email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let user = await prisma.user.findUnique({
    where : { email }
  });
  
  if (user) return next(new ErrorHandler("User Already Exist", 409));
    console.log(password);
    
    let bcryptPass = await generatePassword(password)
    
  user = await prisma.user.create({
    data : {
        email,
        password : bcryptPass
    }
  });

  sendToken(res, user, "Registered Successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please enter all field", 400));

  const user = await prisma.user.findUnique({where : { email }});

  if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

  const isMatch = await compare(password, user.password);

  if (!isMatch)
    return next(new ErrorHandler("Incorrect Email or Password", 401));

  sendToken(res, user, `Welcome back, ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  
  const user = await prisma.user.findUnique({
    where : {
     id : req.user.id
    }
  })

  res.status(200).json({
    success: true,
    user,
  });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("Please enter all field", 400));


  const user = await prisma.user.findUnique({
    where : {id : req.user.id}
  })

  const isMatch = await compare(oldPassword, user.password);
  
  if (!isMatch) return next(new ErrorHandler("Incorrect Old Password", 400));
  
  const password = await generatePassword(newPassword);

  console.log(password);
  await prisma.user.update({
    where :{
      email : user.email
    },
    
    data :{
      password : password
    }
  })
  
  res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email,Twitter,Instagram,Youtube,Country,State } = req.body;

  
  if(!req.user)  return next(new ErrorHandler("User not found", 404));
  
  await prisma.user.update({
    where :{
      email : req.user.email
    },
    
    data :{
      fullName : name,
      email : email,
      Twitter,Instagram,Youtube,Country,State 
    }
  })

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
  });
});

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {  
  if (req.file) {
    
   console.log( req.file);
    if (req?.user.id) {
      const date = Date.now();
      let fileName = "upload/profiles/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      
      await prisma.user.update({
        where: { id: req.user.id },
        data: { profileImage: fileName },
      });
      return res.status(200).json({message : "Profile Picture Updated", Image: fileName });
    }
    return res.status(400).send("Cookie Error.");
  }
  return res.status(400).send("Image not include.");
  
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({ where : {email} });

  if (!user) return next(new ErrorHandler("User not found", 400));
  
  const maxAge = 3 * 24 * 60 * 60;

  const resetToken = await jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
  
  
  console.log(resetToken);
  const resetPasswordExpire = Date.now() + 15 * 60 * 1000
 
  await prisma.user.update({
    where : {id : user.id},
    data : {
      resetPasswordToken :  resetToken,
      resetPasswordExpire : String(resetPasswordExpire)
    }
  })
  
  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `Click on the link to reset your password. ${url}. If you have not request then please ignore.`;

  // Send token via email
  await sendEmail(user.email, "Pateron Clone Reset Password", message);

  res.status(200).json({
    success: true,
    message: `Reset Token has been sent to ${user.email}`,
  });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.headers;

  if(!token) return next(new ErrorHandler("Please enter token", 404));
  
  const user = await prisma.user.findUnique({
    where : {
      resetPasswordToken : token,
    }
  });
  


  if (!user)
    return next(new ErrorHandler("Token is invalid or has been expired", 401));

    if( user.resetPasswordExpire < Date.now())
    return next(new ErrorHandler("Token expired", 404));
    
  const password = await generatePassword( req.body.password);
    
    
    await prisma.user.update({
      where : {
        id : user.id
      },
      data : {
        password : password,
        resetPasswordToken : null,
        resetPasswordExpire : null
      }
    })

  res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
  });
});

// Admin Controllers

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await prisma.user.findMany();
  res.status(200).json({
    success: true,
    users,
  });
});

export const deleteMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where : {
      id : req.user.id
    },
    
  });
  
  if(!user) return next(new ErrorHandler("User not found", 400));
  
  // Cancel Subscription

  await prisma.user.update({
    where : {id : user.id},
    data : {isDeleted : true}
  })

  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Deleted Successfully",
    });
});

export const chooseRole = catchAsyncError(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where : {
      id : req.user.id
    },
  });
  
  if(!user) return next(new ErrorHandler("User not found", 400));
  
  if(!req.role) return next(new ErrorHandler("role is required", 400));

  await prisma.user.update({
    where : {id : user.id},
    data : {role : req.body.role}
  })

  res
    .status(200)
    .json({
      success: true,
      message: "Chosen Successfully",
    });
});

import { parse } from "dotenv";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import {PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createReward = catchAsyncError(async (req, res, next) => {
  const {name, title, subtitle,content,price,estDelivery,createdBy } = req.body;

  if (!name || !title ||! subtitle||!price || !content || !estDelivery)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let reward = await prisma.reward.create({
    data : { name,title, subtitle,price,content,estDelivery,
        createdBy: {
            connect: {
              id: parseInt(createdBy),
            },  
          },
   },
  select : {
    material : true
   }
  });
  
  if (!reward) 
  return next(new ErrorHandler("reward Not Created", 400));
  
  res.status(201).json({
    success: true,
    message: "Created Successfully",
    data : reward
  });
    
});

export const readReward = catchAsyncError(async (req, res, next) => {
  const {rewardId} = req.body;

  if (!rewardId)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let reward = await prisma.reward.findUnique({
   where : {
    id : rewardId
   }
  });
  
  if (!reward) 
  return next(new ErrorHandler("Enter Valid RewardId", 400));
  
  res.status(200).json({
    success: true,
    message: "Data Fetch Successfully",
    data : reward
  });
    
});

export const updateReward = catchAsyncError(async (req, res, next) => {
  const {name, title, subtitle,content,price,estDelivery,rewardId  } = req.body;

  if (!name || !trial ||! subtitle ||! price || !estDelivery)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let reward = await prisma.reward.update({
    where : {
      id : rewardId
    },
    data : {name,title,subtitle,content,estDelivery
    }
  });
  
  if (!reward) 
  return next(new ErrorHandler("Reward Not Updated", 400));
  
  res.status(200).json({
    success: true,
    message: "Updated Successfully",
    data : reward
  });
    
});

export const rewardList = catchAsyncError(async (req, res, next) => {
  const {createdBy} = req.body;

  if (!createdBy)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let reward = await prisma.reward.findMany({
    where : {
     userId : createdBy
    }
  });
  
  if (reward.length ===0) 
  return next(new ErrorHandler("No Reward Available", 400));
  
  res.status(200).json({
    success: true,
    message: "Data Fetch Successfully",
    data : reward
  });
    
});

export const deleteReward = catchAsyncError(async (req, res, next) => {
  const {rewardId} = req.body;

  if (!rewardId)
    return next(new ErrorHandler("Please enter all field", 400));
    
  await prisma.reward.delete({
    where : {
     id : rewardId
    }
  });
  
  res.status(200).json({
    success: true,
    message: "Deleted Successfully",
  });
    
});
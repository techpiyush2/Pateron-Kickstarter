import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import {PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const createTier = catchAsyncError(async (req, res, next) => {
  const {name, trial, createdBy,description,price } = req.body;


  if (!name || !trial ||! createdBy||!price)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let tier = await prisma.tier.create({
    data : { name,trial, description,price,
        createdBy: {
            connect: {
              id: parseInt(createdBy),
            },
          }}
  });
  
  if (!tier) 
  return next(new ErrorHandler("Tier Not Created", 400));
  
  res.status(201).json({
    success: true,
    message: "Created Successfully",
    data : tier
  });
    
});

export const readTier = catchAsyncError(async (req, res, next) => {
  const {tierId} = req.body;

  if (!tierId)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let tier = await prisma.tier.findUnique({
   where : {
    id : tierId
   }
  });
  
  if (!tier) 
  return next(new ErrorHandler("Enter Valid TierId", 400));
  
  res.status(200).json({
    success: true,
    message: "Data Fetch Successfully",
    data : tier
  });
    
});

export const updateTier = catchAsyncError(async (req, res, next) => {
  const {name, trial,tierId,description,price } = req.body;

  if (!name || !trial ||! tierId ||! price)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let tier = await prisma.tier.update({
    where : {
      id : tierId
    },
    data : {name,trial,description,price}
  });
  
  if (!tier) 
  return next(new ErrorHandler("Tier Not Updated", 400));
  
  res.status(200).json({
    success: true,
    message: "Updated Successfully",
    data : tier
  });
    
});

export const tierList = catchAsyncError(async (req, res, next) => {
  const {createdBy} = req.body;

  if (!createdBy)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let tiers = await prisma.tier.findMany({
    where : {
     userId : createdBy
    }
  });
  
  if (tiers.length ===0) 
  return next(new ErrorHandler("No Tier Available", 400));
  
  res.status(200).json({
    success: true,
    message: "Data Fetch Successfully",
    data : tiers
  });
    
});

export const deleteTier = catchAsyncError(async (req, res, next) => {
  const {tierId} = req.body;

  if (!tierId)
    return next(new ErrorHandler("Please enter all field", 400));
    
  await prisma.tier.delete({
    where : {
     id : tierId
    }
  });
  
  res.status(200).json({
    success: true,
    message: "Deleted Successfully",
  });
    
});
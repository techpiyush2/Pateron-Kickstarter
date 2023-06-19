import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import {PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const createCategory = catchAsyncError(async (req, res, next) => {
  const {name, createdBy,description } = req.body;

  if (!name ||! createdBy)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let category = await prisma.category.create({
    data : { name,description,
        createdBy: {
            connect: {
              id: parseInt(createdBy),
            },
          }}
  });
  
  if (!category) 
  return next(new ErrorHandler("Category Not Created", 400));
  
  res.status(201).json({
    success: true,
    message: "Created Successfully",
    data : category
  });
    
});

export const readCategory = catchAsyncError(async (req, res, next) => {
  const {categoryId} = req.body;

  if (!categoryId)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let tier = await prisma.category.findUnique({
   where : {
    id : categoryId
   }
  });
  
  if (!categoryId) 
  return next(new ErrorHandler("Enter Valid TierId", 400));
  
  res.status(200).json({
    success: true,
    message: "Data Fetch Successfully",
    data : tier
  });
    
});

export const updateCategory = catchAsyncError(async (req, res, next) => {
  const {name,categoryId,description } = req.body;

  if (!name || !categoryId)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let tier = await prisma.category.update({
    where : {
      id : categoryId
    },
    data : {name,description}
  });
  
  if (!tier) 
  return next(new ErrorHandler("Tier Not Updated", 400));
  
  res.status(200).json({
    success: true,
    message: "Updated Successfully",
    data : tier
  });
    
});

export const categoryList = catchAsyncError(async (req, res, next) => {
  const {createdBy} = req.body;

  if (!createdBy)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let tiers = await prisma.category.findMany({
    where : {
     userId : createdBy
    }
  });
  
  if (tiers.length ===0) 
  return next(new ErrorHandler("No Category Available", 400));
  
  res.status(200).json({
    success: true,
    message: "Data Fetch Successfully",
    data : tiers
  });
    
});

export const deleteCategory = catchAsyncError(async (req, res, next) => {
  const {categoryId} = req.body;

  if (!categoryId)
    return next(new ErrorHandler("Please enter all field", 400));
    
  await prisma.category.delete({
    where : {
     id : categoryId
    }
  });
  
  res.status(200).json({
    success: true,
    message: "Deleted Successfully",
  });
    
});
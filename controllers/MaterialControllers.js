import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import {PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const create = catchAsyncError(async (req, res, next) => {
  const {name, rewardId} = req.body;
  
  
  const date = Date.now();
  let fileName = "upload/materials/" + date + req.file.originalname;
  renameSync(req.file.path, fileName);
  
  
  if (!name ||!rewardId)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let material = await prisma.material.create({
    data : { name, 
        fileLink : fileName,
        reward: {
            connect: {
              id: parseInt(rewardId),
            },
          }}
  });
  
  if (!material) 
  return next(new ErrorHandler("Material Not Created", 400));
  
  res.status(201).json({
    success: true,
    message: "Created Successfully",
    data : material
  });
    
});

export const read = catchAsyncError(async (req, res, next) => {
  const {materialId} = req.body;

  if (!materialId)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let material = await prisma.material.findUnique({
   where : {
    id : materialId
   }
  });
  
  if (!material) 
  return next(new ErrorHandler("Enter Valid MaterialId", 400));
  
  res.status(200).json({
    success: true,
    message: "Data Fetch Successfully",
    data : material
  });
    
});

export const update = catchAsyncError(async (req, res, next) => {
  const {name,materialId } = req.body;

  const date = Date.now();
  let fileName = "upload/materials/" + date + req.file.originalname;
  renameSync(req.file.path, fileName);
  
  if (!name || !materialId)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let material = await prisma.material.update({
    where : {
      id : materialId
    },
    data : {name, fileLink : fileName}
  });
  
  if (!material) 
  return next(new ErrorHandler("Material Not Updated", 400));
  
  res.status(200).json({
    success: true,
    message: "Updated Successfully",
    data : material
  });
    
});

export const list = catchAsyncError(async (req, res, next) => {
  const {materialId} = req.body;

  if (!materialId)
    return next(new ErrorHandler("Please enter all field", 400));
    
  let materials = await prisma.material.findMany({
    where : {
        materialId : materialId
    }
  });
  
  if (materials.length ===0) 
  return next(new ErrorHandler("No material Available", 400));
  
  res.status(200).json({
    success: true,
    message: "Data Fetch Successfully",
    data : materials
  });
    
});

export const deleteMaterial = catchAsyncError(async (req, res, next) => {
  const {materialId} = req.body;

  if (!materialId)
    return next(new ErrorHandler("Please enter all field", 400));
    
  await prisma.material.delete({
    where : {
     id : materialId
    }
  });
  
  res.status(200).json({
    success: true,
    message: "Deleted Successfully",
  });
    
});
import { PrismaClient } from "@prisma/client";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { existsSync, renameSync, unlinkSync } from "fs";

const prisma = new PrismaClient();

const create = catchAsyncError( async(req, res) => {
  
    const userId = req.curUserId;
      req.body = {...req.body, userId, balance:0};
  
    if (!req.body.title || !req.body.content || !req.body.backersNum) {
      return res.status(400).json({message: 'All filed are required'})
    }
    if (req.body.goal < 0 || req.body.goal == 0){
      return res.status(400).json({message:'the goal cannot be equal to or smaller than 0'})
    }
    
    const date = Date.now();
    let projectImage = "upload/ProjectImage/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);
    
      const newProject = await prisma.project.create({
        data : {
           content : req.body.content ,   
           image : projectImage  ,
           user  : req.body.user  ,
           user:  {connect : {id : req.body.content}},
           category : {connect : {id : categoryId}} ,
           goal : req.body.goal ,
           backersNum : req.body.backersNum,
           balance  : req.body.balance,
           backers : {connect : {id : req.body.backers}} ,
           
         }
    });
    if(!newProject)
    return res.status(400).json({message:'Project not created'})
    
      res.status(200).json({message : "Project added", data : newProject})  
})

const update = catchAsyncError( async(req, res) => {
  
  
  if (!req.body.title || !req.body.content || !req.body.endDate) {
    return res.status(400).json({message: 'All filed are required'})
  }
  
      let updatedProject = await prisma.Project.update({where : {id : read.body.projectId}, data : {
        content : req.body.content ,   
        image : projectImage  ,
        category : {connect : {id : categoryId}} ,
        goal : req.body.goal ,
        backersNum : req.body.backersNum,
        balance  : req.body.balance,
        backers : {connect : {id : req.body.backers}} ,
      }})
      
      if(!updatedProject)
      return res.status(400).json({message:'project not updated'})
      res.status(200).json(updatedProject)
})

const read = catchAsyncError( async(req, res) => {
  if(req.body.projectId)
     return  res.status(400).json({message : "ProjectId Id required"})

      let project = await prisma.Project.findById({
     
        where : {id : req.body.projectId}
      }).populate('user').populate('plan');
      res.status(200).json(project)

})
 
const deletedProject = catchAsyncError( async(req, res) => {
  
  if(req.body.projectId)
  return  res.status(400).json({message : "ProjectId Id required"})
  
      let foundProject = await prisma.project.findUnique({where : {id : req.body.projectId}});
      
      
      foundProject.plan.forEach(plan => {
        prisma.plan.delete({where : {id : plan.id}}, (err, deletedPlan) =>{
          if(err) return res.status(500).send(err)
        })
      });
      
      
      let deletedProject = await prisma.project.delete({where : {id : req.body.projectId}});
      

      res.status(200).json({message:'successfully deleted',deletedProject})
})
  
const list = catchAsyncError( async(req, res) => {
  if(req.body.userId)
  return  res.status(400).json({message : "UserId Id required"})
  
      const allProject = await prisma.project.findMany({where : {userId : req.body.userId}})
      
      if(allProject.length === 0)
      return res.status(200).json({message : "Project not available", data : []})
     
      res.status(200).json(allProject)
    
})

export {create, update, read, deletedProject, list}
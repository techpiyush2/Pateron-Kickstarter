import { PrismaClient } from "@prisma/client";
import { catchAsyncError } from "../middleware/catchAsyncError.js";

const prisma = new PrismaClient();

const create = catchAsyncError (async(req, res) => {
  
  const plan = {...req.body};

  if (!plan.price || !plan.subtitle || !plan.content || !plan.estDelivery || !plan.projectId ) {
    return res.status(400).json({message: 'All filed is required'})
  }
  if (plan.price < 0 || plan.price == 0){
    return res.status(400).json({message:'the price cannot be equal to or smaller than 0'})
  }
    
    const newPlan = await prisma.plan.create({data : {
        title : plan.title ,
        subtitle : plan.subtitle ,
        content : plan.content,
        price : plan.price,
        estDelivery : plan.estDelivery,
        project : {connect : {id : plan.projectId}},
        user : {connect : {id : plan.userId}},
    }});
    
    res.status(200).json({message : "New Plan Created", newPlan})
  
});

const update = catchAsyncError (async(req, res) => {

    const plan = {...req.body};

    if (!plan.price || !plan.subtitle || !plan.content || !plan.estDelivery || !plan.projectId || !plan.planId) {
      return res.status(400).json({message: 'All filed is required'})
    }
    
    if (plan.price < 0 || plan.price == 0){
      return res.status(400).json({message:'the price cannot be equal to or smaller than 0'})
    }
      
      const updatedPlan = await prisma.plan.create({where : {id : plan.planId},
        data : {
          title : plan.title,
          subtitle : plan.subtitle,
          content : plan.content,
          price : plan.price,
          estDelivery : plan.estDelivery,
          project : {connect : {id : plan.projectId}},
          user : {connect : {id : plan.userId}},
      }});
      
    res.status(200).json({message : "Plan Updated", updatedPlan})
 
});

const read = catchAsyncError (async(req, res) => {
    
    if(req.body.planId) return res.status(400).send("PlanId is required")
    let plan = await prisma.plan.findUnique({where : {id : req.body.planId}});

    if(!plan) return res.send(400).send('No Plan Found')
    res.status(200).json(plan)

});

const deletePlan = catchAsyncError (async(req, res) => {
    
    if(req.body.planId) return res.status(400).send("PlanId is required")
    
    let deletedPlan = await prisma.plan.delete(req.body.planId)
    
    res.status(200).json({message:'successfully deleted',deletedPlan})

});

const list = catchAsyncError (async(req, res) => {
    
    const foundPlans = await prisma.plan.findMany();
    
    res.status(200).json({message:'Data Fetch Successfully',foundPlans})
    
});

export {deletePlan,create,update,read,list}
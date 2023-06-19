import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()


export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("You are not authenticated!");
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return res.status(403).send("Token is not valid!");
    req.user = payload;
    next();
  });
};

export const authorizeSubscribers = async(req, res, next) => {
  
  let user  = await prisma.user.findUnique({where:{id : req.user.userId}}) ;
  
  if (user.Subscribed === true && user.role !== "CREATOR")
  return res.status(403).send("Only Subscribers can access this resource!");
  
  next();
};

export const authorizeCreator = async (req, res, next) => {
  
  let user  = await prisma.user.findUnique({where:{id : req.user.userId}}) ;
  
  if (user.role === "CREATOR")
 
  return res.status(403).send("Only Subscribers can access this resource!");
  
  next();
};
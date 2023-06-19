import { PrismaClient } from "@prisma/client";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY);

export const createPaymentIntent = catchAsyncError ( async (req, res, next) => {
    if (req.body.postId) {
      const { postId } = req.body;
      const prisma = new PrismaClient();
      const post = await prisma.posts.findUnique({
        where: { id: parseInt(postId) },
      });
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: post?.price * 100,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      await prisma.subscription.create({
        data: {
          paymentIntent: paymentIntent.id,
          price: post?.price,
          buyer: { connect: { id: req?.userId } },
          post: { connect: { id: post?.id } },
        },
      });
      
      await prisma.user.update({where : {id : parseInt(req.body.userId)}, data : {subscribed : true}})
      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      res.status(400).send("post id is required.");
    }
  
});

export const confirmPaymentIntent = catchAsyncError ( async (req, res, next) => {
    if (req.body.paymentIntent) {
      const prisma = new PrismaClient();
      await prisma.subscription.update({
        where: { paymentIntent: req.body.paymentIntent },
        data: { isCompleted: true },
      });
    }
   res.send(200).send("paymentIntent Confirmed")
});

export const getBuyerSubscription = catchAsyncError ( async (req, res, next) => {
    if (req.body.userId) {
      const prisma = new PrismaClient();
      const subscription = await prisma.subscription.findMany({
        where: { buyerId: req.body.userId, isCompleted: true },
        include: { post: true },
      });
      return res.status(200).json({ subscription });
    }
    return res.status(400).send("User id is required.");
  
});

export const getSellerSubscription = catchAsyncError ( async (req, res, next) => {
    if (req.body.userId) {
      const prisma = new PrismaClient();
      const subscription = await prisma.subscription.findMany({
        where: {
          post: {
            createdBy: {
              id: parseInt(req.body.userId),
            },
          },
          isCompleted: true,
        },
        include: {
          post: true,
          buyer: true,
        },
      });
      return res.status(200).json({ subscription });
    }
    return res.status(400).send("User id is required.");
 
});
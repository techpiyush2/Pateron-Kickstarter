import { PrismaClient } from "@prisma/client";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY);


const createCustomer = catchAsyncError( async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;

    const customer = await stripe.customers.create({
      name,
      email,
    });

    return customer;

});


const createPaymentIntent = catchAsyncError( async (req, res) => {
  
  if (req.body.planId || req.body.userId) {
    const { planId } = req.body;
    const prisma = new PrismaClient();
    const plan = await prisma.plans.findUnique({
      where: { id: parseInt(planId) },
    });
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: plan?.price,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    await prisma.payment.create({
      data: {
        paymentIntent: paymentIntent.id,
        price: plan?.price,
        buyer: { connect: { id: req.body.userId } },
        plan: { connect: { id: plan?.id } },
      },
    });
    
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } else {
    res.status(400).send("plan id is required.");
  }
});

const confirmPaymentIntent = catchAsyncError ( async (req, res, next) => {
    if (req.body.paymentIntent) {
      const prisma = new PrismaClient();
      await prisma.payment.update({
        where: { paymentIntent: req.body.paymentIntent },
        data: { isCompleted: true },
      });
    }
   res.send(200).send("paymentIntent Confirmed")
});

export {
  createCustomer,
  createPaymentIntent,
  confirmPaymentIntent
}
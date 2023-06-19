import { catchAsyncError } from "../middleware/catchAsyncError.js";
import {PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addMessage =  catchAsyncError( async (req, res, next) => {
    if (
      req.body.userId &&
      req.body. recipientId &&
      req.body.message
    ) {
      const message = await prisma.message.create({
        data: {
          sender: {
            connect: {
              // @ts-expect-error
              id: parseInt(req.body.userId),
            },
          },
          recipient: {
            connect: {
              id: parseInt(req.body.recipientId),
            },
          },
          text: req.body.message,
        },
      });
      return res.status(201).json({ message });
    }
    return res
      .status(400)
      .send("userId,recipientId and message is required.");

});

export const getMessages = catchAsyncError( async (req, res, next) => {
    if (req.body.userId) {
      const messages = await prisma.message.findMany({
        where: {
          senderId: parseInt(req.body.userId)
        },
        paymentIntentBy: {
          createdAt: "asc",
        },
      });

      await prisma.message.updateMany({
        where: {
          recipientId: parseInt(req.body.userId),
        },
        data: {
          isRead: true,
        },
      });

      return res.status(200).json({ messages });
    }
    return res.status(400).send("User id is required.");

});

export const getUnreadMessages = catchAsyncError( async (req, res, next) => {
    if (req.body.userId) {
      const messages = await prisma.message.findMany({
        where: {
          recipientId: req.body.userId,
          // isRead: false,
        },
        include: {
          sender: true,
        },  
      });
      
      await prisma.message.updateMany({
        where: {
          recipientId: parseInt(req.body.userId),
        },
        data: {
          isRead: true,
        },
      });
      
      return res.status(200).json({ messages });
    }
    return res.status(400).send("User id is required.");

});

export const markAsRead = catchAsyncError( async (req, res, next) => {
    if (req.body.userId && req.body.messageId) {
      await prisma.message.update({
        where: { id: parseInt(req.body.messageId) },
        data: { isRead: true },
      });
      return res.status(200).send("Message mark as read.");
    }
    return res.status(400).send("User id and message Id is required.");
});
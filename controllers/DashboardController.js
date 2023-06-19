import { PrismaClient } from "@prisma/client";
import { catchAsyncError } from "../middleware/catchAsyncError.js";

const prisma = new PrismaClient();

export const getSellerData = catchAsyncError(async (req, res, next) => {
    if (req.body.userId) {
      const posts = await prisma.posts.count({ where: { userId: req.body.userId } });
      const {
        _count: { id: subscription },
      } = await prisma.subscription.aggregate({
        where: {
          isCompleted: true,
          post: {
            createdBy: {
              id: req.body.userId,
            },
          },
        },
        _count: {
          id: true,
        },
      });
      

      
      const unreadMessages = await prisma.message.count({
        where: {
          recipientId: req.body.userId,
          isRead: false,
        },
      });

      const today = new Date();
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const thisYear = new Date(today.getFullYear(), 0, 1);

      const {
        _sum: { price: revenue },
      } = await prisma.subscription.aggregate({
        where: {
          post: {
            createdBy: {
              id: req.body.userId,
            },
          },
          isCompleted: true,
          createdAt: {
            gte: thisYear,
          },
        },
        _sum: {
          price: true,
        },
      });

      const {
        _sum: { price: dailyRevenue },
      } = await prisma.subscription.aggregate({
        where: {
          post: {
            createdBy: {
              id: req.body.userId,
            },
          },
          isCompleted: true,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        _sum: {
          price: true,
        },
      });

      const {
        _sum: { price: monthlyRevenue },
      } = await prisma.subscription.aggregate({
        where: {
          post: {
            createdBy: {
              id: req.body.userId,
            },
          },
          isCompleted: true,
          createdAt: {
            gte: thisMonth,
          },
        },
        _sum: {
          price: true,
        },
      });
      
      return res.status(200).json({
        dashboardData: {
          subscription,
          posts,
          unreadMessages,
          dailyRevenue,
          monthlyRevenue,
          revenue,
        },
      });
    }
    return res.status(400).send("User id is required.");
});

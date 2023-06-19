import { PrismaClient } from "@prisma/client";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { existsSync, renameSync, unlinkSync } from "fs";

const prisma = new PrismaClient();

export const addPost = catchAsyncError(async (req, res, next) => {
  if (req.body) {
    const date = Date.now();
    let fileName = "upload/postFile/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);
    
    let imageLink = "upload/postImage/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);
        
    if (req.body) {
      const {
        title,
        categoryId,
        category,
        description,
        features,
        price,
        fileType,
        tierId,
        shortDesc,
      } = req.body;

  let post =  await prisma.posts.create({
        data: {
          title,
          description,
          features,
          categoryName : {
            connect : {id : categoryId }
          },
          fileType,
          fileLink  : fileName,
          category,
          price: parseInt(price),
          shortDesc,
          createdBy: { connect: { id: req.body.userId } },
          image: imageLink,
          tier : {
            connect : {id : tierId}
          }
        },
        
      });

      return res.status(201).json({message : "Successfully created the post.", data : post});
    }
  }
  return res.status(400).send("All properties should be required.");

});

export const getUserAuthPosts = catchAsyncError(async (req, res, next) => {

    if (req.body.userId) {
      const user = await prisma.user.findUnique({
        where: { id: req.body.userId },
        include: { posts: true },
      });
      
      return res.status(200).json({ posts: user?.posts ?? [] });
    }
    return res.status(400).send("UserId should be required.");
});

export const getPostData = catchAsyncError( async (req, res, next) => {
    if (req.body.postId) {
      const post = await prisma.posts.findUnique({
        where: { id: parseInt(req.body.postId) },
        include: {
          reviews: {
            include: {
              reviewer: true,
            },
          },
          createdBy: true,
        },
      });

      const userWithposts = await prisma.user.findUnique({
        where: { id: post?.createdBy.id },
        include: {
          posts: {
            include: { reviews: true },
          },
        },
      });

      const totalReviews = userWithposts.posts.reduce(
        (acc, post) => acc + post.reviews.length,
        0
      );

      const averageRating = (
        userWithposts.posts.reduce(
          (acc, post) =>
            acc + post.reviews.reduce((sum, review) => sum + review.rating, 0),
          0
        ) / totalReviews
      ).toFixed(1);

      return res
        .status(200)
        .json({ post: { ...post, totalReviews, averageRating } });
    }
    return res.status(400).send("postId should be required.");
});

export const editPost = catchAsyncError( async (req, res, next) => {
  
    if (req.body) {
      const date = Date.now();
      let fileName = "upload/postFile/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      
      let imageLink = "upload/postImage/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      
      if (req.body) {
        const {
          title,
          description,
          categoryId,
          category,
          features,
          price,
          fileType,
          tier,
          shortDesc,
        } = req.body;
        const prisma = new PrismaClient();
  
        await prisma.posts.update({
          where: { id: parseInt(req.body.postId) },
          data: {
            title,
            description,
            category,
            fileType,
            fileLink : fileName,
            categoryId,
            features,
            price: parseInt(price),
            shortDesc,
            createdBy: { connect: { id: parseInt(req.body.userId) } },
            image: imageLink,
            tier : {
              connect : {id : tier}
            }
          },
        });
      
        return res.status(201).send("Successfully Edited the post.");
      }
    }
    return res.status(400).send("All properties should be required.");
});

export const searchPosts = catchAsyncError(async (req, res, next) => {
    if (req.body.searchTerm || req.body.category) {
      const prisma = new PrismaClient();
      const posts = await prisma.posts.findMany(
        createSearchQuery(req.body.searchTerm, req.body.category)
      );
      return res.status(200).json({ posts });
    }
    return res.status(400).send("Search Term or Category is required.");
});

const createSearchQuery = (searchTerm, category) => {
  const body = {
    where: {
      OR: [],
    },
    include: {
      reviews: {
        include: {
          reviewer: true,
        },
      },
      createdBy: true,
    },
  };
  if (searchTerm) {
    body.where.OR.push({
      title: { contains: searchTerm, },
    });
  }
  if (category) {
    body.where.OR.push({
      category: { contains: category,},
    });
  }
  return body;
};

const checkBuyer = catchAsyncError( async (userId, postId) => {
    const prisma = new PrismaClient();
    const hasUserPaymentInTentedPost = await prisma.subscription.findFirst({
      where: {
        buyerId: parseInt(userId),
        postId: parseInt(postId),
        isCompleted: true,
      },
    });
    return hasUserPaymentInTentedPost;
});

export const checkPostPaymentIntent = catchAsyncError( async (req, res, next) => {
    if (req.body.userId && req.body.postId) {
      const hasUserPaymentInTentedPost = await checkBuyer(req.body.userId, req.body.postId);
      return res
        .status(200)
        .json({ hasUserPaymentInTentedPost: hasUserPaymentInTentedPost ? true : false });
    }
    return res.status(400).send("userId and postId is required.");
    
});

export const addReview = catchAsyncError( async (req, res, next) => {
    if (req.body.userId && req.body.postId) {
      if (await checkBuyer(req.body.userId, req.body.postId)) {
        if (req.body.reviewText && req.body.rating) {
          const prisma = new PrismaClient();
          const newReview = await prisma.reviews.create({
            data: {
              rating: req.body.rating,
              reviewText: req.body.reviewText,
              reviewer: { connect: { id: parseInt(req?.userId) } },
              post: { connect: { id: parseInt(req.body.postId) } },
            },
            include: {
              reviewer: true,
            },
          });
          return res.status(201).json({ newReview });
        }
        return res.status(400).send("ReviewText and Rating are required.");
      }
      return res
        .status(400)
        .send("You need to purchase the post in paymentIntent to add review.");
    }
    return res.status(400).send("userId and postId is required.");
 
});
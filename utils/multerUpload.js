import path from 'path';
import multer from "multer"

export const storage = multer.diskStorage({
    destination: './upload/profiles/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

export const postImageStorage = multer.diskStorage({
    destination: './upload/postImage/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

export const postFileStorage = multer.diskStorage({
    destination: './upload/postFile/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

export const materialStorage = multer.diskStorage({
    destination: './upload/material/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

export const rewardStorage = multer.diskStorage({
    destination: './upload/rewardImage/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

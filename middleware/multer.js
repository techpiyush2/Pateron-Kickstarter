import multer from "multer";

import { storage,postImageStorage,postFileStorage } from "../utils/multerUpload.js";

export const profileUpload = multer({ storage }).single("profile",{name: "file"});
export const postImageUpload = multer({ storage : postImageStorage }).single("postImage", {name: "file"});
export const fileUpload = multer({ storage : postFileStorage }).single("postFile", {name: "file"});
export const projectImageUpload = multer({ storage : postFileStorage }).single("projectImage", {name: "file"});
export const rewardImageUpload = multer({ storage : postFileStorage }).single("rewardImage", {name: "file"});
export const materialUpload = multer({ storage : postFileStorage }).single("material", {name: "file"});

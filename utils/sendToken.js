import jwt from "jsonwebtoken";

export const sendToken = async (res, user, message, statusCode = 200) => {
  
  const maxAge = 3 * 24 * 60 * 60;
  
  const token = await jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
  
  // const options = {
  //   expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "none",                                                                   
  // };
  
  res.status(statusCode).cookie("token", token).json({
    success: true,
    message,
    user,
  });
};
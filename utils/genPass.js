import { genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";

const generatePassword = async (password) => {
    const salt = await genSalt();
    return await hash(password, salt);
  };
  
  const maxAge = 3 * 24 * 60 * 60;
  
  const createToken = (email, userId) => {
  
    return jwt.sign({ email, userId }, process.env.JWT_KEY, {
      expiresIn: maxAge,
    });
  };

  export {generatePassword,createToken}
const jwt = require("jsonwebtoken");
const {config} = require("../config/secret")


exports.authAdmin = (req,res,next) => {
  let token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({msg:"You need to send token to this endpoint url 7777"})
  }
  try{
    let decodeToken = jwt.verify(token,config.tokenSecret);
    console.log(decodeToken.role);
    if(decodeToken.role != "admin"){
      return res.status(401).json({msg:"Token invalid or expired, code: 6A"})
    }
    req.tokenData = decodeToken;

    next();
  }
  catch(err){
    console.log(err);
    return res.status(401).json({msg:"Token invalid or expired, log in again or you hacker!"})
  }
}


exports.auth = (req,res,next) => {
  let token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({msg:"You need to send token to this endpoint url 66666"})
  }
  try{
    let decodeToken = jwt.verify(token,config.tokenSecret);
    req.tokenData = decodeToken;
    console.log(req.tokenData);
    next();
  }
  catch(err){
    console.log(err);
    return res.status(401).json({msg:"Token invalid or expired, log in again or you hacker!"})
  }
}
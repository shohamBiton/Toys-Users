// 3
const express= require("express");
const router = express.Router();

router.get("/" , (req,res)=> {
  res.json({msg:"Rest api work 1111 2222  !"})
})

module.exports = router;
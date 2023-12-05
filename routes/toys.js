const express= require("express");
const {ToysModel,validateToys} = require("../models/toysModel");
const { auth,authAdmin } = require("../middlewears/auth");
const router = express.Router();


router.get("/" , async(req,res)=> {
  let perPage = Math.min(req.query.perPage,10) || 5;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try{
    let data = await ToysModel
    .find({})
    .limit(perPage)
    .skip((page - 1)*perPage)
    .sort({[sort]:reverse})
    res.json(data);
  } 
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }                  
})
router.get("/single/:id" , async(req,res)=> {
  let id=req.params.id;

  try{
    let data = await ToysModel
    .findOne({_id:id})  
    res.json(data);
  } 
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }                  
})

// /toys/search?s=
router.get("/search",async(req,res) => {
  try{
    let perPage = Math.min(req.query.perPage,10) || 5;
    let queryS = req.query.s;
    // מביא את החיפוש בתור ביטוי ולא צריך את כל הביטוי עצמו לחיפוש
    // i -> מבטל את כל מה שקשור ל CASE SENSITVE
    let searchReg = new RegExp(queryS,"i")
    let data = await ToysModel.find({name:searchReg})
    .limit(perPage)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

// /toys/category/
router.get("/category/:catName",async(req,res) => {
  let perPage = Math.min(req.query.perPage,10) || 5;
  let page = req.query.page || 1;
  try{
    let paramsCat = req.params.catName;
    // מביא את החיפוש בתור ביטוי ולא צריך את כל הביטוי עצמו לחיפוש
    // i -> מבטל את כל מה שקשור ל CASE SENSITVE
    let catReg = new RegExp(paramsCat,"i")
    let data = await ToysModel.find({category:catReg})
    .limit(perPage)
    .skip((page - 1) * perPage);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})


router.post("/",auth, async(req,res) => {
  let valdiateBody = validateToys(req.body);
  if(valdiateBody.error){
    return res.status(400).json(valdiateBody.error.details)
  }            
  try{
    let toy = new ToysModel(req.body);
    toy.user_id=req.tokenData._id;
    await toy.save();
    res.status(201).json(toy)
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.put("/:idEdit",auth, async(req,res) => {
  let validBody = validateToys(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let editId = req.params.idEdit;
    let data;
    if(req.tokenData.role == "admin"){
      data = await ToysModel.updateOne({_id:editId},req.body)
    }
    else{
       data = await ToysModel.updateOne({_id:editId,user_id:req.tokenData._id},req.body)
    }
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

router.delete("/:idDel",auth, async(req,res) => {
  try{
    let delId = req.params.idDel;
    let data;
    if(req.tokenData.role == "admin"){
      data = await ToysModel.deleteOne({_id:delId})
    }
    else{
      data = await ToysModel.deleteOne({_id:delId,user_id:req.tokenData._id})
    }
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})



module.exports = router;
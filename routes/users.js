// 5
const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel, userValid, loginValid, createToken } = require("../models/userModel")
const router = express.Router();
const { auth, authAdmin } = require("../middlewears/auth")




router.get("/", authAdmin, async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 99;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await UserModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})



router.get("/checkToken", auth, async (req, res) => {
  let user = await UserModel.findOne({ _id: req.tokenData }, { password: 0 })
  res.json(user)
})



//  בשביל יצירת רשומה נצטרך ךיצור מודל חדש 
router.post("/", async (req, res) => {
  let valdiateBody = userValid(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }
  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10)
    await user.save();
    user.password = "******";
    res.status(201).json(user)
  }
  catch (err) {
    // בודק אם השגיאה זה אימייל שקיים כבר במערכת
    // דורש בקומפס להוסיף אינדקס יוניקי
    if (err.code == 11000) {
      return res.status(400).json({ msg: "Email already in system try login", code: 11000 })
    }
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})



router.delete("/:idDel", auth, async (req, res) => {
  try {
    let data;
    let idDel = req.params.idDel
    // כדי שמשתמש יוכל למחוק רשומה הוא חייב 
    // שלרשומה יהיה את האיי די ביוזר איי די שלו
    console.log(idDel);
    console.log(req.tokenData._id);
    if (idDel == req.tokenData._id || req.tokenData.role == "admin") {
      data = await UserModel.deleteOne({ _id: idDel });
      // "deletedCount": 1 -  אם יש הצלחה של מחיקה
      res.json(data);
    }
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})



router.post("/login", async (req, res) => {
  let valdiateBody = loginValid(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }
  try {
    // לבדוק אם המייל שנשלח בכלל יש רשומה של משתמש שלו
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      // שגיאת אבטחה שנשלחה מצד לקוח
      return res.status(401).json({ msg: "User and password not match code 1 " })
    }
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ msg: "User and password not match code 2" })
    }
    let token = createToken(user._id, user.role);
    res.json({ token: token });
  }
  catch (err) {

    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

module.exports = router;
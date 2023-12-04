// המשתנים הסודיים יהו בקובץ זה
require("dotenv").config();

exports.config={
    tokenSecret:process.env.TOKEN_SECRET,
    userDb:process.env.USER_DB,
    paddDb:process.env.PASS_DB
};
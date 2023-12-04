const mongoose = require('mongoose');
const {config}=require("../config/secret")

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.paddDb}@cluster0.wyk69yc.mongodb.net/shoham_first`);
  console.log("mongo connect started");
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path")

const mongo_url = "mongodb://127.0.0.1:27017/wander";  

main()
    .then(()=>{
        console.log("connected to db")
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect(mongo_url)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.get("/",(req,res)=>{
    req.render("hi i am root")
});




//Index route
app.get("/listing", async(req,res) =>{
  const allListing = await Listing.find({})
  res.render("listings/index.ejs",{allListing});
});

// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"my new villa",
//         description :"By the Beach",
//         price : 1200,
//         location : "calangute, Goa",
//         country: "India",

//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });
app.listen (3000,()=>{
    console.log("server is running on port 3000");
});



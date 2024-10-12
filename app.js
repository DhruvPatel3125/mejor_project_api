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
app.use(express.urlencoded({extended:true}));


app.get("/",(req,res)=>{
    req.render("hi i am root")
});




//Index route
app.get("/listings", async(req,res) =>{
  const allListing = await Listing.find({})
  res.render("listings/index.ejs",{allListing});
});

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route
app.get("/listings/:id", async(req, res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("listings/show.ejs",{listing});
})

//create route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
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



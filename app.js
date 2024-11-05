const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}  = require("./schema.js");
const Review = require("./models/review.js");

const mongo_url = "mongodb://127.0.0.1:27017/dhruv";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//Index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  })
);

//new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

//create route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
 let result= listingSchema.validate(req.body)
 console.log(result)
    const newListing = new Listing(req.body.listing);
       await newListing.save();
    res.redirect("/listings");
  })
);

//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);
//reviews
//post route
app.post("/listings/:id/reviews",async(req,res)=>{
 let listing = await Listing.findById(req.params.id);
 let newReview = new Review(req.body.review);

listing.reviews.push(newReview);
await newReview.save();
await listing.save();

  res.redirect(`/listings/${listing._id}`)
})
//delete reviews
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId} = req.params;
 await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});

 await Review.findByIdAndDelete(reviewId);

 res.redirect(`/listings/${id}`);
})
)

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

app.use((err, req, res, next) => {
  let { statusCode=505, message="Somthing went wrong!!" } = err;
  res.status(statusCode).render("error.ejs",{message});
  //res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});

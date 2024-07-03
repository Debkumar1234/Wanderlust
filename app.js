const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Root server working properly...");
});

// app.get("/testListing", async (req, res) => {
//   let smapleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 12000,
//     location: "Calangute, Goa",
//     coutry: "India",
//   });
//   await smapleListing.save();
//   console.log("Sample was saved");
//   res.send("successful testing");
// });

app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});
/* New Listing form page route */
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
/* Show Route */
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

/* Create Route */
app.post("/listings", async (req, res) => {
  let newlisting = new Listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listings");
});
/* Edit Listing get route */
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});
/* Update Listing Put route */
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let updatedListing = req.body.listing;
  await Listing.findByIdAndUpdate(id, { ...updatedListing });
  res.redirect(`/listings/${id}`);
});
/* Delete route */
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});
app.listen(8080, () => {
  console.log("app listening on port 8080");
});

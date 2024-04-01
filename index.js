const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const app = express();
const port = 8000;
const cors = require("cors");
const user = require("./routes/user");
const order = require("./routes/order");
const bevvies = require("./routes/bevvies");
const munchies = require("./routes/munchies");
const inventory = require("./routes/inventory");
const review = require("./routes/review");
const munchiesrev = require("./routes/munchiesreview")
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://BgyApp:cmHrW5PdROc6a2sx@barangayapplication.se6iabv.mongodb.net/MunchiesAndBevvies?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(port, () => {
  console.log("Server is running on port 8000");
});
cloudinary.config({
  cloud_name: "dhndcs09a",
  api_key: "433952899232498",
  api_secret: "latqVKH1QiQ3w1BdgGbZEdAHmrY",
});
app.use(user);
app.use(bevvies);
app.use(munchies);
app.use(order);
app.use(inventory);
app.use(review);
app.use(munchiesrev);


const express = require("express");
const cors = require("cors");
require("dotenv").config();

const placesRoutes = require("./routes/placesRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");


const app = express();

const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());

app.use(express.json());


// Test route
app.get("/", (req, res) => {

    res.json({
        message: "GemTrail Backend is running!"
    });

});


// Places API
app.use("/api/places", placesRoutes);

// Categories API
app.use("/api/categories", categoriesRoutes);

// Itineraries API
app.use("/api/itineraries", itineraryRoutes);


// Start server
app.listen(PORT, () => {

    console.log(
        `GemTrail server running on port ${PORT}`
    );

});
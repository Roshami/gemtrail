const express = require("express");
const cors = require("cors");
require("dotenv").config();

const placesRoutes = require("./routes/placesRoutes");

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


// Start server
app.listen(PORT, () => {

    console.log(
        `GemTrail server running on port ${PORT}`
    );

});
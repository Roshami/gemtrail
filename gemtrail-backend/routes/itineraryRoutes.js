const express = require("express");

const router = express.Router();

const {
    createItinerary,
    addPlace,
    getItinerary,
    deleteItinerary
} = require("../controllers/itineraryController");


// Create itinerary
router.post("/", createItinerary);


// Get itinerary
router.get("/:id", getItinerary);


// Add place to itinerary
router.post("/:id/places", addPlace);


// Delete itinerary
router.delete("/:id", deleteItinerary);


module.exports = router;
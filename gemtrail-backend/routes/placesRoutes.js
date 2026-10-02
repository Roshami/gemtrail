const express = require("express");

const router = express.Router();

const placesController =
    require("../controllers/placesController");


// =====================================================
// GET
// =====================================================

// All places
// Search
// Category
// Nearby
router.get(
    "/",
    placesController.getPlaces
);


// =====================================================
// TOP RATED
// =====================================================

router.get(
    "/top-rated",
    placesController.getTopRatedPlaces
);


// =====================================================
// GET ONE
// =====================================================

router.get(
    "/:id",
    placesController.getPlaceById
);


// =====================================================
// CREATE
// =====================================================

router.post(
    "/",
    placesController.createPlace
);


// =====================================================
// UPDATE
// =====================================================

router.put(
    "/:id",
    placesController.updatePlace
);


// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    placesController.deletePlace
);


module.exports = router;
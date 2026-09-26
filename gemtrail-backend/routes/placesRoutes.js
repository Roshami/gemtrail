const express = require("express");

const router = express.Router();

const {
    getPlaces,
    getPlace,
    getTopRatedPlaces
} = require("../controllers/placesController");


router.get("/", getPlaces);

router.get("/top-rated", getTopRatedPlaces);

router.get("/:id", getPlace);


module.exports = router;
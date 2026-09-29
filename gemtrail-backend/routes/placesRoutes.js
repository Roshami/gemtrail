const express = require("express");

const router = express.Router();

const {
    getPlaces,
    getPlace,
    getTopRatedPlaces,
    createPlace,
    updatePlace,
    deletePlace
} = require("../controllers/placesController");


router.get("/", getPlaces);

router.get("/top-rated", getTopRatedPlaces);

router.post("/", createPlace);

router.get("/:id", getPlace);

router.put("/:id", updatePlace);

router.delete("/:id", deletePlace);


module.exports = router;
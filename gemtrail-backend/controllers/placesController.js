const placesModel = require("../models/placesModel");


// GET /api/places
const getPlaces = async (req, res) => {

    try {

        const {
            search,
            category
        } = req.query;


        let places;


        if (search) {

            places = await placesModel.searchPlaces(search);

        } else if (category && category !== "All") {

            places = await placesModel.getPlacesByCategory(category);

        } else {

            places = await placesModel.getAllPlaces();

        }


        res.json({
            success: true,
            count: places.length,
            data: places
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to get places"
        });
    }
};


// GET /api/places/:id
const getPlace = async (req, res) => {

    try {

        const { id } = req.params;

        const place = await placesModel.getPlaceById(id);


        if (!place) {

            return res.status(404).json({
                success: false,
                message: "Place not found"
            });
        }


        res.json({
            success: true,
            data: place
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to get place"
        });
    }
};


// GET /api/places/top-rated
const getTopRatedPlaces = async (req, res) => {

    try {

        const places =
            await placesModel.getTopRatedPlaces();


        res.json({
            success: true,
            count: places.length,
            data: places
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to get top rated places"
        });
    }
};


module.exports = {
    getPlaces,
    getPlace,
    getTopRatedPlaces
};
const placesModel = require("../models/placesModel");


// =====================================================
// GET PLACES
// GET /api/places
// =====================================================

const getPlaces = async (req, res) => {

    try {

        const {
            search,
            category,
            latitude,
            longitude
        } = req.query;


        let places;


        // Nearby search has highest priority
        if (latitude && longitude) {

            places = await placesModel.getNearbyPlaces(
                parseFloat(latitude),
                parseFloat(longitude)
            );

        }

        // Search
        else if (search) {

            places = await placesModel.searchPlaces(search);

        }

        // Category filter
        else if (category && category !== "All") {

            places =
                await placesModel.getPlacesByCategory(category);

        }

        // All places
        else {

            places =
                await placesModel.getAllPlaces();
        }


        res.status(200).json({
            success: true,
            count: places.length,
            data: places
        });

    } catch (error) {

        console.error("Get places error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get places"
        });
    }
};


// =====================================================
// GET SINGLE PLACE
// GET /api/places/:id
// =====================================================

const getPlace = async (req, res) => {

    try {

        const { id } = req.params;

        const place =
            await placesModel.getPlaceById(id);


        if (!place) {

            return res.status(404).json({
                success: false,
                message: "Place not found"
            });
        }


        res.status(200).json({
            success: true,
            data: place
        });

    } catch (error) {

        console.error("Get place error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get place"
        });
    }
};


// =====================================================
// TOP RATED
// GET /api/places/top-rated
// =====================================================

const getTopRatedPlaces = async (req, res) => {

    try {

        const places =
            await placesModel.getTopRatedPlaces();


        res.status(200).json({
            success: true,
            count: places.length,
            data: places
        });

    } catch (error) {

        console.error("Top rated error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get top rated places"
        });
    }
};


// =====================================================
// CREATE PLACE
// POST /api/places
// =====================================================

const createPlace = async (req, res) => {

    try {

        const {
            category_id,
            name,
            description,
            location,
            latitude,
            longitude,
            opening_hours,
            entrance_fee,
            transport_info,
            travel_time,
            visit_duration,
            rating,
            district
        } = req.body;


        if (!category_id || !name) {

            return res.status(400).json({
                success: false,
                message: "Category and place name are required"
            });
        }


        const id =
            await placesModel.createPlace(req.body);


        res.status(201).json({
            success: true,
            message: "Place created successfully",
            id
        });

    } catch (error) {

        console.error("Create place error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create place"
        });
    }
};


// =====================================================
// UPDATE PLACE
// PUT /api/places/:id
// =====================================================

const updatePlace = async (req, res) => {

    try {

        const { id } = req.params;


        const affectedRows =
            await placesModel.updatePlace(
                id,
                req.body
            );


        if (affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Place not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Place updated successfully"
        });

    } catch (error) {

        console.error("Update place error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update place"
        });
    }
};


// =====================================================
// DELETE PLACE
// DELETE /api/places/:id
// =====================================================

const deletePlace = async (req, res) => {

    try {

        const { id } = req.params;


        const affectedRows =
            await placesModel.deletePlace(id);


        if (affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Place not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Place deleted successfully"
        });

    } catch (error) {

        console.error("Delete place error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete place"
        });
    }
};


module.exports = {
    getPlaces,
    getPlace,
    getTopRatedPlaces,
    createPlace,
    updatePlace,
    deletePlace
};
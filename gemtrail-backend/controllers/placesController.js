const placesModel = require("../models/placesModel");


// =====================================================
// GET PLACES
//
// Supports:
//
// /api/places
//
// /api/places?search=waterfall
//
// /api/places?category=Nature
//
// /api/places?latitude=6.68&longitude=80.40&radius=25
//
// /api/places?latitude=6.68&longitude=80.40&radius=10&category=Nature
//
// /api/places?latitude=6.68&longitude=80.40&radius=25&search=waterfall
// =====================================================

const getPlaces = async (req, res) => {

    try {

        const {
            search,
            category,
            latitude,
            longitude,
            radius
        } = req.query;


        let places;


        // =================================================
        // Location-based search
        // =================================================

        if (
            latitude !== undefined &&
            longitude !== undefined
        ) {

            const userLatitude =
                Number(latitude);

            const userLongitude =
                Number(longitude);

            const searchRadius =
                radius !== undefined
                    ? Number(radius)
                    : 25;


            // ---------------------------------------------
            // Validate latitude
            // ---------------------------------------------

            if (
                Number.isNaN(userLatitude) ||
                userLatitude < -90 ||
                userLatitude > 90
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid latitude"
                });
            }


            // ---------------------------------------------
            // Validate longitude
            // ---------------------------------------------

            if (
                Number.isNaN(userLongitude) ||
                userLongitude < -180 ||
                userLongitude > 180
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid longitude"
                });
            }


            // ---------------------------------------------
            // Validate radius
            // ---------------------------------------------

            if (
                Number.isNaN(searchRadius) ||
                searchRadius <= 0 ||
                searchRadius > 25
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Radius must be between 1 and 25 km"
                });
            }


            places =
                await placesModel.getNearbyPlaces(
                    userLatitude,
                    userLongitude,
                    searchRadius,
                    search,
                    category
                );

        }


        // =================================================
        // Search only
        // =================================================

        else if (
            search &&
            search.trim() !== ""
        ) {

            places =
                await placesModel.searchPlaces(
                    search.trim()
                );

        }


        // =================================================
        // Category only
        // =================================================

        else if (
            category &&
            category !== "All"
        ) {

            places =
                await placesModel.getPlacesByCategory(
                    category
                );

        }


        // =================================================
        // All places
        // =================================================

        else {

            places =
                await placesModel.getAllPlaces();

        }


        // =================================================
        // Response
        // =================================================

        return res.status(200).json({

            success: true,

            count: places.length,

            data: places

        });


    } catch (error) {

        console.error(
            "Get places error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to get tourist places"

        });

    }
};


// =====================================================
// GET SINGLE PLACE
// =====================================================

const getPlaceById = async (req, res) => {

    try {

        const { id } = req.params;


        const place =
            await placesModel.getPlaceById(id);


        if (!place) {

            return res.status(404).json({

                success: false,

                message:
                    "Tourist place not found"

            });

        }


        return res.status(200).json({

            success: true,

            data: place

        });


    } catch (error) {

        console.error(
            "Get place by ID error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to get tourist place"

        });

    }
};


// =====================================================
// GET TOP RATED PLACES
// =====================================================

const getTopRatedPlaces = async (
    req,
    res
) => {

    try {

        const places =
            await placesModel.getTopRatedPlaces();


        return res.status(200).json({

            success: true,

            count: places.length,

            data: places

        });


    } catch (error) {

        console.error(
            "Top rated places error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to get top-rated places"

        });

    }
};


// =====================================================
// CREATE PLACE
// =====================================================

const createPlace = async (
    req,
    res
) => {

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


        // ---------------------------------------------
        // Required fields
        // ---------------------------------------------

        if (
            !category_id ||
            !name ||
            !location ||
            latitude === undefined ||
            longitude === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "category_id, name, location, latitude and longitude are required"

            });

        }


        // ---------------------------------------------
        // Validate coordinates
        // ---------------------------------------------

        const lat =
            Number(latitude);

        const lng =
            Number(longitude);


        if (
            Number.isNaN(lat) ||
            lat < -90 ||
            lat > 90
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid latitude"

            });

        }


        if (
            Number.isNaN(lng) ||
            lng < -180 ||
            lng > 180
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid longitude"

            });

        }


        // ---------------------------------------------
        // Create
        // ---------------------------------------------

        const id =
            await placesModel.createPlace({

                category_id,

                name,

                description,

                location,

                latitude: lat,

                longitude: lng,

                opening_hours,

                entrance_fee,

                transport_info,

                travel_time,

                visit_duration,

                rating,

                district:
                    district || "Ratnapura"

            });


        return res.status(201).json({

            success: true,

            message:
                "Tourist place created successfully",

            data: {
                id
            }

        });


    } catch (error) {

        console.error(
            "Create place error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to create tourist place"

        });

    }
};


// =====================================================
// UPDATE PLACE
// =====================================================

const updatePlace = async (
    req,
    res
) => {

    try {

        const { id } = req.params;


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


        if (
            !category_id ||
            !name ||
            !location ||
            latitude === undefined ||
            longitude === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "category_id, name, location, latitude and longitude are required"

            });

        }


        const lat =
            Number(latitude);

        const lng =
            Number(longitude);


        if (
            Number.isNaN(lat) ||
            lat < -90 ||
            lat > 90
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid latitude"

            });

        }


        if (
            Number.isNaN(lng) ||
            lng < -180 ||
            lng > 180
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid longitude"

            });

        }


        const affectedRows =
            await placesModel.updatePlace(
                id,
                {

                    category_id,

                    name,

                    description,

                    location,

                    latitude: lat,

                    longitude: lng,

                    opening_hours,

                    entrance_fee,

                    transport_info,

                    travel_time,

                    visit_duration,

                    rating,

                    district:
                        district || "Ratnapura"

                }
            );


        if (affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Tourist place not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Tourist place updated successfully"

        });


    } catch (error) {

        console.error(
            "Update place error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to update tourist place"

        });

    }
};


// =====================================================
// DELETE PLACE
// =====================================================

const deletePlace = async (
    req,
    res
) => {

    try {

        const { id } = req.params;


        const affectedRows =
            await placesModel.deletePlace(id);


        if (affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Tourist place not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Tourist place deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete place error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to delete tourist place"

        });

    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getPlaces,

    getPlaceById,

    getTopRatedPlaces,

    createPlace,

    updatePlace,

    deletePlace

};
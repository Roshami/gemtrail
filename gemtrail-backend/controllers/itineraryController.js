const itineraryModel =
    require("../models/itineraryModel");


// =====================================================
// CREATE ITINERARY
// POST /api/itineraries
// =====================================================

const createItinerary = async (req, res) => {

    try {

        const itineraryId =
            await itineraryModel.createItinerary(
                req.body
            );


        res.status(201).json({
            success: true,
            message: "Itinerary created successfully",
            itinerary_id: itineraryId
        });

    } catch (error) {

        console.error("Create itinerary error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create itinerary"
        });
    }
};


// =====================================================
// ADD PLACE
// POST /api/itineraries/:id/places
// =====================================================

const addPlace = async (req, res) => {

    try {

        const itinerary_id =
            req.params.id;


        const data = {
            ...req.body,
            itinerary_id
        };


        const id =
            await itineraryModel.addPlaceToItinerary(
                data
            );


        res.status(201).json({
            success: true,
            message: "Place added to itinerary",
            id
        });

    } catch (error) {

        console.error("Add itinerary place error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add place"
        });
    }
};


// =====================================================
// GET ITINERARY
// GET /api/itineraries/:id
// =====================================================

const getItinerary = async (req, res) => {

    try {

        const { id } = req.params;


        const itinerary =
            await itineraryModel.getItineraryById(id);


        if (!itinerary) {

            return res.status(404).json({
                success: false,
                message: "Itinerary not found"
            });
        }


        res.status(200).json({
            success: true,
            data: itinerary
        });

    } catch (error) {

        console.error("Get itinerary error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get itinerary"
        });
    }
};


// =====================================================
// DELETE ITINERARY
// DELETE /api/itineraries/:id
// =====================================================

const deleteItinerary = async (req, res) => {

    try {

        const { id } = req.params;


        const affectedRows =
            await itineraryModel.deleteItinerary(id);


        if (affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Itinerary not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Itinerary deleted successfully"
        });

    } catch (error) {

        console.error("Delete itinerary error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete itinerary"
        });
    }
};


module.exports = {
    createItinerary,
    addPlace,
    getItinerary,
    deleteItinerary
};
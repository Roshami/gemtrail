const db = require("../config/db");


// =====================================================
// CREATE ITINERARY
// =====================================================

const createItinerary = async (itinerary) => {

    const {
        title,
        start_time,
        end_time,
        total_distance,
        total_cost
    } = itinerary;


    const [result] = await db.query(`

        INSERT INTO itineraries
        (
            title,
            start_time,
            end_time,
            total_distance,
            total_cost
        )

        VALUES (?, ?, ?, ?, ?)

    `, [
        title || "My One-Day Trip",
        start_time || null,
        end_time || null,
        total_distance || 0,
        total_cost || 0
    ]);


    return result.insertId;
};


// =====================================================
// ADD PLACE TO ITINERARY
// =====================================================

const addPlaceToItinerary = async (data) => {

    const {
        itinerary_id,
        tourist_place_id,
        visit_order,
        planned_start,
        planned_end,
        travel_minutes
    } = data;


    const [result] = await db.query(`

        INSERT INTO itinerary_places
        (
            itinerary_id,
            tourist_place_id,
            visit_order,
            planned_start,
            planned_end,
            travel_minutes
        )

        VALUES (?, ?, ?, ?, ?, ?)

    `, [
        itinerary_id,
        tourist_place_id,
        visit_order,
        planned_start || null,
        planned_end || null,
        travel_minutes || 0
    ]);


    return result.insertId;
};


// =====================================================
// GET ITINERARY
// =====================================================

const getItineraryById = async (id) => {

    const [itineraryRows] = await db.query(`

        SELECT
            id,
            title,
            start_time,
            end_time,
            total_distance,
            total_cost,
            created_at

        FROM itineraries

        WHERE id = ?

    `, [id]);


    if (itineraryRows.length === 0) {
        return null;
    }


    const [placeRows] = await db.query(`

        SELECT
            ip.id,
            ip.visit_order,
            ip.planned_start,
            ip.planned_end,
            ip.travel_minutes,

            tp.id AS place_id,
            tp.name,
            tp.location,
            tp.latitude,
            tp.longitude,
            tp.entrance_fee,
            tp.visit_duration,
            tp.rating

        FROM itinerary_places ip

        INNER JOIN tourist_places tp
            ON ip.tourist_place_id = tp.id

        WHERE ip.itinerary_id = ?

        ORDER BY ip.visit_order ASC

    `, [id]);


    return {
        ...itineraryRows[0],
        places: placeRows
    };
};


// =====================================================
// DELETE ITINERARY
// =====================================================

const deleteItinerary = async (id) => {

    const [result] = await db.query(`

        DELETE FROM itineraries

        WHERE id = ?

    `, [id]);


    return result.affectedRows;
};


module.exports = {
    createItinerary,
    addPlaceToItinerary,
    getItineraryById,
    deleteItinerary
};
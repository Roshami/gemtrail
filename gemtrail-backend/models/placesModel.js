const db = require("../config/db");


// =====================================================
// GET ALL ACTIVE PLACES
// =====================================================

const getAllPlaces = async () => {

    const [rows] = await db.query(`
        SELECT
            tp.id,
            tp.name,
            tp.description,
            tp.location,
            tp.latitude,
            tp.longitude,
            tp.opening_hours,
            tp.entrance_fee,
            tp.transport_info,
            tp.travel_time,
            tp.visit_duration,
            tp.rating,
            tp.district,
            c.name AS category

        FROM tourist_places tp

        INNER JOIN categories c
            ON tp.category_id = c.id

        WHERE tp.is_active = TRUE

        ORDER BY tp.name ASC
    `);

    return rows;
};


// =====================================================
// GET PLACE BY ID
// =====================================================

const getPlaceById = async (id) => {

    const [rows] = await db.query(`
        SELECT
            tp.id,
            tp.name,
            tp.description,
            tp.location,
            tp.latitude,
            tp.longitude,
            tp.opening_hours,
            tp.entrance_fee,
            tp.transport_info,
            tp.travel_time,
            tp.visit_duration,
            tp.rating,
            tp.district,
            c.name AS category

        FROM tourist_places tp

        INNER JOIN categories c
            ON tp.category_id = c.id

        WHERE tp.id = ?
        AND tp.is_active = TRUE
    `, [id]);

    return rows[0];
};


// =====================================================
// SEARCH PLACES
// =====================================================

const searchPlaces = async (search) => {

    const [rows] = await db.query(`
        SELECT
            tp.id,
            tp.name,
            tp.description,
            tp.location,
            tp.latitude,
            tp.longitude,
            tp.opening_hours,
            tp.entrance_fee,
            tp.transport_info,
            tp.travel_time,
            tp.visit_duration,
            tp.rating,
            tp.district,
            c.name AS category

        FROM tourist_places tp

        INNER JOIN categories c
            ON tp.category_id = c.id

        WHERE tp.is_active = TRUE

        AND (
            tp.name LIKE ?
            OR tp.location LIKE ?
            OR tp.description LIKE ?
            OR c.name LIKE ?
        )

        ORDER BY tp.name ASC
    `, [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
    ]);

    return rows;
};


// =====================================================
// FILTER BY CATEGORY
// =====================================================

const getPlacesByCategory = async (category) => {

    const [rows] = await db.query(`
        SELECT
            tp.id,
            tp.name,
            tp.description,
            tp.location,
            tp.latitude,
            tp.longitude,
            tp.opening_hours,
            tp.entrance_fee,
            tp.transport_info,
            tp.travel_time,
            tp.visit_duration,
            tp.rating,
            tp.district,
            c.name AS category

        FROM tourist_places tp

        INNER JOIN categories c
            ON tp.category_id = c.id

        WHERE tp.is_active = TRUE
        AND c.name = ?

        ORDER BY tp.rating DESC
    `, [category]);

    return rows;
};


// =====================================================
// GET TOP RATED PLACES
// =====================================================

const getTopRatedPlaces = async () => {

    const [rows] = await db.query(`
        SELECT
            tp.id,
            tp.name,
            tp.description,
            tp.location,
            tp.latitude,
            tp.longitude,
            tp.opening_hours,
            tp.entrance_fee,
            tp.transport_info,
            tp.travel_time,
            tp.visit_duration,
            tp.rating,
            tp.district,
            c.name AS category

        FROM tourist_places tp

        INNER JOIN categories c
            ON tp.category_id = c.id

        WHERE tp.is_active = TRUE

        ORDER BY tp.rating DESC

        LIMIT 10
    `);

    return rows;
};


// =====================================================
// GET PLACES WITHIN 25 KM
// =====================================================

const getNearbyPlaces = async (latitude, longitude) => {

    const [rows] = await db.query(`

        SELECT
            tp.id,
            tp.name,
            tp.description,
            tp.location,
            tp.latitude,
            tp.longitude,
            tp.opening_hours,
            tp.entrance_fee,
            tp.transport_info,
            tp.travel_time,
            tp.visit_duration,
            tp.rating,
            tp.district,
            c.name AS category,

            (
                6371 * ACOS(
                    LEAST(
                        1,
                        GREATEST(
                            -1,
                            COS(RADIANS(?))
                            *
                            COS(RADIANS(tp.latitude))
                            *
                            COS(
                                RADIANS(tp.longitude)
                                - RADIANS(?)
                            )
                            +
                            SIN(RADIANS(?))
                            *
                            SIN(RADIANS(tp.latitude))
                        )
                    )
                )
            ) AS distance_km

        FROM tourist_places tp

        INNER JOIN categories c
            ON tp.category_id = c.id

        WHERE tp.is_active = TRUE
        AND tp.district = 'Ratnapura'

        HAVING distance_km <= 25

        ORDER BY distance_km ASC

    `, [
        latitude,
        longitude,
        latitude
    ]);

    return rows;
};


// =====================================================
// CREATE PLACE
// =====================================================

const createPlace = async (place) => {

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
    } = place;


    const [result] = await db.query(`

        INSERT INTO tourist_places
        (
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
        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    `, [
        category_id,
        name,
        description,
        location,
        latitude,
        longitude,
        opening_hours,
        entrance_fee || 0,
        transport_info,
        travel_time,
        visit_duration || 60,
        rating || 0,
        district || "Ratnapura"
    ]);


    return result.insertId;
};


// =====================================================
// UPDATE PLACE
// =====================================================

const updatePlace = async (id, place) => {

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
    } = place;


    const [result] = await db.query(`

        UPDATE tourist_places

        SET
            category_id = ?,
            name = ?,
            description = ?,
            location = ?,
            latitude = ?,
            longitude = ?,
            opening_hours = ?,
            entrance_fee = ?,
            transport_info = ?,
            travel_time = ?,
            visit_duration = ?,
            rating = ?,
            district = ?

        WHERE id = ?

    `, [
        category_id,
        name,
        description,
        location,
        latitude,
        longitude,
        opening_hours,
        entrance_fee || 0,
        transport_info,
        travel_time,
        visit_duration || 60,
        rating || 0,
        district || "Ratnapura",
        id
    ]);


    return result.affectedRows;
};


// =====================================================
// DELETE PLACE
// =====================================================

const deletePlace = async (id) => {

    const [result] = await db.query(`

        UPDATE tourist_places

        SET is_active = FALSE

        WHERE id = ?

    `, [id]);


    return result.affectedRows;
};


module.exports = {
    getAllPlaces,
    getPlaceById,
    searchPlaces,
    getPlacesByCategory,
    getTopRatedPlaces,
    getNearbyPlaces,
    createPlace,
    updatePlace,
    deletePlace
};011111111111111111111111111111111111111112
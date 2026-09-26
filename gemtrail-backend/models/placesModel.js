const db = require("../config/db");


// Get all places
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

        JOIN categories c
            ON tp.category_id = c.id

        WHERE tp.is_active = TRUE

        ORDER BY tp.name ASC
    `);

    return rows;
};


// Get one place
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

        JOIN categories c
            ON tp.category_id = c.id

        WHERE tp.id = ?
        AND tp.is_active = TRUE
    `, [id]);

    return rows[0];
};


// Search places
const searchPlaces = async (search) => {

    const [rows] = await db.query(`
        SELECT
            tp.*,
            c.name AS category

        FROM tourist_places tp

        JOIN categories c
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


// Filter by category
const getPlacesByCategory = async (category) => {

    const [rows] = await db.query(`
        SELECT
            tp.*,
            c.name AS category

        FROM tourist_places tp

        JOIN categories c
            ON tp.category_id = c.id

        WHERE tp.is_active = TRUE
        AND c.name = ?

        ORDER BY tp.rating DESC
    `, [category]);

    return rows;
};


// Top rated
const getTopRatedPlaces = async () => {

    const [rows] = await db.query(`
        SELECT
            tp.*,
            c.name AS category

        FROM tourist_places tp

        JOIN categories c
            ON tp.category_id = c.id

        WHERE tp.is_active = TRUE

        ORDER BY tp.rating DESC

        LIMIT 10
    `);

    return rows;
};


module.exports = {
    getAllPlaces,
    getPlaceById,
    searchPlaces,
    getPlacesByCategory,
    getTopRatedPlaces
};
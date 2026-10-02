const db = require("../config/db");


// =====================================================
// GET ALL PLACES
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
            tp.is_active,
            tp.created_at,
            tp.updated_at,
            c.name AS category
        FROM tourist_places tp
        INNER JOIN categories c
            ON tp.category_id = c.id
        WHERE tp.is_active = TRUE
          AND tp.district = 'Ratnapura'
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
            tp.is_active,
            tp.created_at,
            tp.updated_at,
            c.name AS category
        FROM tourist_places tp
        INNER JOIN categories c
            ON tp.category_id = c.id
        WHERE tp.id = ?
          AND tp.is_active = TRUE
    `, [id]);

    return rows[0] || null;
};


// =====================================================
// SEARCH PLACES
// =====================================================

const searchPlaces = async (search) => {
    const searchText = `%${search}%`;

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
            tp.is_active,
            c.name AS category
        FROM tourist_places tp
        INNER JOIN categories c
            ON tp.category_id = c.id
        WHERE tp.is_active = TRUE
          AND tp.district = 'Ratnapura'
          AND (
                tp.name LIKE ?
                OR tp.description LIKE ?
                OR tp.location LIKE ?
              )
        ORDER BY tp.name ASC
    `, [
        searchText,
        searchText,
        searchText
    ]);

    return rows;
};


// =====================================================
// GET PLACES BY CATEGORY
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
            tp.is_active,
            c.name AS category
        FROM tourist_places tp
        INNER JOIN categories c
            ON tp.category_id = c.id
        WHERE tp.is_active = TRUE
          AND tp.district = 'Ratnapura'
          AND c.name = ?
        ORDER BY tp.name ASC
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
            tp.is_active,
            c.name AS category
        FROM tourist_places tp
        INNER JOIN categories c
            ON tp.category_id = c.id
        WHERE tp.is_active = TRUE
          AND tp.district = 'Ratnapura'
        ORDER BY tp.rating DESC, tp.name ASC
        LIMIT 10
    `);

    return rows;
};


// =====================================================
// GET NEARBY PLACES
//
// latitude  = selected/current location
// longitude = selected/current location
// radius    = KM
//
// Also supports:
// search
// category
// =====================================================

const getNearbyPlaces = async (
    latitude,
    longitude,
    radius = 25,
    search = "",
    category = "All"
) => {

    let query = `
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
            tp.is_active,

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
    `;


    // ---------------------------------------------
    // Search filter
    // ---------------------------------------------

    const params = [
        latitude,
        longitude,
        latitude
    ];


    if (search && search.trim() !== "") {

        query += `
            AND (
                tp.name LIKE ?
                OR tp.description LIKE ?
                OR tp.location LIKE ?
            )
        `;

        const searchText =
            `%${search.trim()}%`;

        params.push(
            searchText,
            searchText,
            searchText
        );
    }


    // ---------------------------------------------
    // Category filter
    // ---------------------------------------------

    if (
        category &&
        category !== "All"
    ) {

        query += `
            AND c.name = ?
        `;

        params.push(category);
    }


    // ---------------------------------------------
    // Radius filter
    // ---------------------------------------------

    query += `
        HAVING distance_km <= ?

        ORDER BY distance_km ASC
    `;

    params.push(radius);


    const [rows] =
        await db.query(
            query,
            params
        );


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
        INSERT INTO tourist_places (
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

const updatePlace = async (
    id,
    place
) => {

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
//
// Soft delete
// =====================================================

const deletePlace = async (id) => {

    const [result] = await db.query(`
        UPDATE tourist_places
        SET is_active = FALSE
        WHERE id = ?
    `, [id]);


    return result.affectedRows;
};


// =====================================================
// EXPORT
// =====================================================

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

};
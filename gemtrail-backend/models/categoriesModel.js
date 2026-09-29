const db = require("../config/db");


// Get all categories
const getAllCategories = async () => {

    const [rows] = await db.query(`
        SELECT
            id,
            name

        FROM categories

        ORDER BY name ASC
    `);

    return rows;
};


// Get category by ID
const getCategoryById = async (id) => {

    const [rows] = await db.query(`
        SELECT
            id,
            name

        FROM categories

        WHERE id = ?
    `, [id]);

    return rows[0];
};


module.exports = {
    getAllCategories,
    getCategoryById
};
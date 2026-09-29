const categoriesModel =
    require("../models/categoriesModel");


// GET /api/categories

const getCategories = async (req, res) => {

    try {

        const categories =
            await categoriesModel.getAllCategories();


        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {

        console.error("Categories error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get categories"
        });
    }
};


module.exports = {
    getCategories
};
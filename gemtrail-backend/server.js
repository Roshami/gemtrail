const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const placesRoutes =
    require("./routes/placesRoutes");

const categoriesRoutes =
    require("./routes/categoriesRoutes");

const itineraryRoutes =
    require("./routes/itineraryRoutes");


const app = express();

const PORT =
    process.env.PORT || 5000;


// =====================================================
// Middleware
// =====================================================

app.use(
    cors()
);

app.use(
    express.json()
);


// =====================================================
// Root
// =====================================================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message:
            "GemTrail Backend is running!"

    });

});


// =====================================================
// Test Database
// =====================================================

app.get(
    "/api/test-db",
    async (req, res) => {

        try {

            const [rows] =
                await db.query(
                    "SELECT 1 AS result"
                );


            res.status(200).json({

                success: true,

                message:
                    "MySQL connected successfully!",

                data: rows

            });


        } catch (error) {

            console.error(
                "Database error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Database connection failed"

            });

        }

    }
);


// =====================================================
// API Routes
// =====================================================

app.use(
    "/api/places",
    placesRoutes
);


app.use(
    "/api/categories",
    categoriesRoutes
);


app.use(
    "/api/itineraries",
    itineraryRoutes
);


// =====================================================
// 404
// =====================================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "API route not found"

        });

    }
);


// =====================================================
// Error handler
// =====================================================

app.use(
    (err, req, res, next) => {

        console.error(err);

        res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }
);


// =====================================================
// Start server
// =====================================================

app.listen(
    PORT,
    () => {

        console.log(
            `GemTrail server running on port ${PORT}`
        );

    }
);
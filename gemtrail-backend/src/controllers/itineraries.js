const db = require('../db');
const { validateId } = require('../utils');

// --------------------------------------------------
// Helper: Get an itinerary owned by the logged-in user
// --------------------------------------------------
async function getOwnedItinerary(id, userId) {
  const [rows] = await db.execute(
    `SELECT *
     FROM itineraries
     WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  return rows[0];
}

// --------------------------------------------------
// Helper: Recalculate and save itinerary estimated cost
// Sum of estimated_cost from all places assigned to this itinerary
// --------------------------------------------------
async function recalculateItineraryCost(itineraryId) {
  const [rows] = await db.execute(
    `SELECT COALESCE(SUM(ip.estimated_cost), 0) AS total_cost
     FROM itinerary_places ip
     WHERE ip.itinerary_id = ?`,
    [itineraryId],
  );

  const totalCost = Number(rows[0]?.total_cost ?? 0);

  await db.execute(
    `UPDATE itineraries
     SET estimated_cost = ?
     WHERE id = ?`,
    [totalCost, itineraryId],
  );

  console.log(`[Itinerary Cost] Itinerary ${itineraryId}: ${totalCost}`);

  return totalCost;
}

// --------------------------------------------------
// GET /api/itineraries
// List itineraries belonging to the logged-in user
// --------------------------------------------------
exports.list = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT *
       FROM itineraries
       WHERE user_id = ?
       ORDER BY updated_at DESC`,
      [req.user.id],
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('List itineraries error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve itineraries.',
    });
  }
};

// --------------------------------------------------
// POST /api/itineraries
// Create a new itinerary
// --------------------------------------------------
exports.create = async (req, res) => {
  try {
    const b = req.body || {};

    if (
      typeof b.title !== 'string' ||
      !b.title.trim() ||
      b.title.trim().length > 180
    ) {
      return res.status(400).json({
        success: false,
        message: 'Itinerary title is required (max 180 characters).',
      });
    }

    const status = ['draft', 'saved', 'completed'].includes(b.status)
      ? b.status
      : 'draft';

    const [result] = await db.execute(
      `INSERT INTO itineraries (
         user_id,
         title,
         trip_date,
         start_time,
         end_time,
         start_location,
         radius_km,
         transport_method,
         estimated_cost,
         notes,
         status
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        b.title.trim(),
        b.trip_date || null,
        b.start_time || null,
        b.end_time || null,
        b.start_location || null,
        b.radius_km ?? null,
        b.transport_method || null,
        0,
        b.notes || null,
        status,
      ],
    );

    const [rows] = await db.execute(
      'SELECT * FROM itineraries WHERE id = ? AND user_id = ?',
      [result.insertId, req.user.id],
    );

    res.status(201).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error('Create itinerary error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create itinerary.',
    });
  }
};

// --------------------------------------------------
// GET /api/itineraries/:id
// Get one itinerary and its places with custom estimated cost
// --------------------------------------------------
exports.getOne = async (req, res) => {
  try {
    const id = validateId(req.params.id);
    const itinerary = await getOwnedItinerary(id, req.user.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found.',
      });
    }

    const [places] = await db.execute(
      `SELECT
         ip.id AS itinerary_place_id,
         ip.sort_order,
         ip.visit_date,
         ip.start_time,
         ip.end_time,
         ip.notes AS stop_notes,
         ip.estimated_cost,
         p.*,
         c.name AS category_name
       FROM itinerary_places ip
       JOIN tourist_places p
         ON p.id = ip.tourist_place_id
       LEFT JOIN categories c
         ON c.id = p.category_id
       WHERE ip.itinerary_id = ?
       ORDER BY ip.sort_order ASC, ip.id ASC`,
      [id],
    );

    res.json({
      success: true,
      data: {
        ...itinerary,
        places,
      },
    });
  } catch (error) {
    console.error('Get itinerary error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve itinerary.',
    });
  }
};

// --------------------------------------------------
// PUT /api/itineraries/:id
// Update itinerary details
// --------------------------------------------------
exports.update = async (req, res) => {
  try {
    const id = validateId(req.params.id);
    const b = req.body || {};

    const itinerary = await getOwnedItinerary(id, req.user.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found.',
      });
    }

    const allowed = {
      title: 'title',
      trip_date: 'trip_date',
      start_time: 'start_time',
      end_time: 'end_time',
      start_location: 'start_location',
      radius_km: 'radius_km',
      transport_method: 'transport_method',
      notes: 'notes',
      status: 'status',
    };

    const keys = Object.keys(b).filter((key) =>
      Object.prototype.hasOwnProperty.call(allowed, key),
    );

    if (!keys.length) {
      return res.status(400).json({
        success: false,
        message: 'No valid itinerary fields supplied.',
      });
    }

    if (
      b.title !== undefined &&
      (typeof b.title !== 'string' || !b.title.trim() || b.title.trim().length > 180)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid title.',
      });
    }

    if (
      b.status !== undefined &&
      !['draft', 'saved', 'completed'].includes(b.status)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Status must be draft, saved, or completed.',
      });
    }

    await db.execute(
      `UPDATE itineraries
       SET ${keys.map((key) => `${allowed[key]} = ?`).join(', ')}
       WHERE id = ? AND user_id = ?`,
      [
        ...keys.map((key) => {
          if (key === 'title') return b.title.trim();
          return b[key] === '' ? null : b[key];
        }),
        id,
        req.user.id,
      ],
    );

    const totalCost = await recalculateItineraryCost(id);

    const [rows] = await db.execute(
      `SELECT *
       FROM itineraries
       WHERE id = ? AND user_id = ?`,
      [id, req.user.id],
    );

    res.json({
      success: true,
      data: {
        ...rows[0],
        estimated_cost: totalCost,
      },
    });
  } catch (error) {
    console.error('Update itinerary error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update itinerary.',
    });
  }
};

// --------------------------------------------------
// DELETE /api/itineraries/:id
// Delete an itinerary
// --------------------------------------------------
exports.remove = async (req, res) => {
  try {
    const id = validateId(req.params.id);

    const [result] = await db.execute(
      `DELETE FROM itineraries
       WHERE id = ? AND user_id = ?`,
      [id, req.user.id],
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found.',
      });
    }

    res.json({
      success: true,
      message: 'Itinerary deleted.',
    });
  } catch (error) {
    console.error('Delete itinerary error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete itinerary.',
    });
  }
};

// --------------------------------------------------
// POST /api/itineraries/:id/places
// Add a tourist place to an itinerary with its estimated cost
// --------------------------------------------------
exports.addPlace = async (req, res) => {
  try {
    const id = validateId(req.params.id);
    const itinerary = await getOwnedItinerary(id, req.user.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found.',
      });
    }

    const b = req.body || {};
    const placeId = validateId(b.tourist_place_id, 'tourist_place_id');

    const [placeRows] = await db.execute(
      `SELECT id
       FROM tourist_places
       WHERE id = ? AND is_active = 1`,
      [placeId],
    );

    if (!placeRows.length) {
      return res.status(404).json({
        success: false,
        message: 'Tourist place not found or inactive.',
      });
    }

    // Prevent duplicate places in the same itinerary
    const [existingRows] = await db.execute(
      `SELECT id
       FROM itinerary_places
       WHERE itinerary_id = ? AND tourist_place_id = ?`,
      [id, placeId],
    );

    if (existingRows.length) {
      return res.status(409).json({
        success: false,
        message: 'This place is already in the itinerary.',
      });
    }

    let order;
    if (b.sort_order === undefined || b.sort_order === null) {
      const [orderRows] = await db.execute(
        `SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order
         FROM itinerary_places
         WHERE itinerary_id = ?`,
        [id],
      );

      order = Number(orderRows[0].next_order);
    } else {
      order = Number(b.sort_order);

      if (!Number.isInteger(order) || order < 1) {
        return res.status(400).json({
          success: false,
          message: 'sort_order must be a positive integer.',
        });
      }
    }

    const placeEstimatedCost = Number(b.estimated_cost) || 0;

    const [result] = await db.execute(
      `INSERT INTO itinerary_places (
         itinerary_id,
         tourist_place_id,
         estimated_cost,
         visit_date,
         start_time,
         end_time,
         notes,
         sort_order
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        placeId,
        placeEstimatedCost,
        b.visit_date || itinerary.trip_date || null,
        b.start_time || null,
        b.end_time || null,
        b.notes || null,
        order,
      ],
    );

    const totalCost = await recalculateItineraryCost(id);

    res.status(201).json({
      success: true,
      message: 'Place added successfully.',
      data: {
        itinerary_place_id: result.insertId,
        itinerary_id: id,
        tourist_place_id: placeId,
        sort_order: order,
        estimated_cost: totalCost,
      },
    });
  } catch (error) {
    console.error('Add itinerary place error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to add place to itinerary.',
    });
  }
};

// --------------------------------------------------
// PUT / PATCH /api/itineraries/:id/places/:stopId
// Update an itinerary stop including estimated_cost
// --------------------------------------------------
exports.updatePlace = async (req, res) => {
  try {
    const id = validateId(req.params.id);
    const stopId = validateId(req.params.stopId);

    const itinerary = await getOwnedItinerary(id, req.user.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found.',
      });
    }

    const allowed = [
      'estimated_cost',
      'visit_date',
      'start_time',
      'end_time',
      'notes',
      'sort_order',
    ];

    const body = req.body || {};
    const keys = Object.keys(body).filter((key) => allowed.includes(key));

    if (!keys.length) {
      return res.status(400).json({
        success: false,
        message: 'No valid stop fields supplied.',
      });
    }

    if (
      body.sort_order !== undefined &&
      (!Number.isInteger(Number(body.sort_order)) || Number(body.sort_order) < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: 'sort_order must be a positive integer.',
      });
    }

    const [result] = await db.execute(
      `UPDATE itinerary_places
       SET ${keys.map((key) => `${key} = ?`).join(', ')}
       WHERE id = ? AND itinerary_id = ?`,
      [
        ...keys.map((key) => {
          if (key === 'estimated_cost') return Number(body[key]) || 0;
          return body[key] === '' ? null : body[key];
        }),
        stopId,
        id,
      ],
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary stop not found or unchanged.',
      });
    }

    const totalCost = await recalculateItineraryCost(id);

    res.json({
      success: true,
      message: 'Itinerary stop updated.',
      data: {
        itinerary_id: id,
        itinerary_place_id: stopId,
        estimated_cost: totalCost,
      },
    });
  } catch (error) {
    console.error('Update itinerary place error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update itinerary stop.',
    });
  }
};

// --------------------------------------------------
// DELETE /api/itineraries/:id/places/:stopId
// Remove a tourist place from an itinerary and update total
// --------------------------------------------------
exports.removePlace = async (req, res) => {
  try {
    const id = validateId(req.params.id);
    const stopId = validateId(req.params.stopId);

    const itinerary = await getOwnedItinerary(id, req.user.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found.',
      });
    }

    const [result] = await db.execute(
      `DELETE FROM itinerary_places
       WHERE id = ? AND itinerary_id = ?`,
      [stopId, id],
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary stop not found.',
      });
    }

    const totalCost = await recalculateItineraryCost(id);

    res.json({
      success: true,
      message: 'Place removed from itinerary.',
      data: {
        itinerary_id: id,
        estimated_cost: totalCost,
      },
    });
  } catch (error) {
    console.error('Remove itinerary place error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to remove place from itinerary.',
    });
  }
};
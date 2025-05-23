import express from 'express';
import cors from 'cors';
import { pool } from './database.js';

const app = express();
app.use(express.json());  // Add this!
app.use(cors());

// Apartments
// API route to fetch limited apartment data
/*
app.get("/api/apartments", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Default to 10 rows if not specified
        const [apartments] = await pool.query(`SELECT * FROM \`apartment\``);
        res.json(apartments);
    } catch (error) {
        console.error("Error fetching apartments:", error);
        res.status(500).json({ message: "Error fetching data from database" });
    }
});*/

// Advance
app.get("/api/apartments", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Default to 10 rows if not specified
        const [apartments] = await pool.query(`SELECT 
                                                a.*, 
                                                COUNT(DISTINCT r.resident_id) AS resident_count,
                                                COUNT(DISTINCT v.license_plate) AS vehicle_count
                                            FROM apartment a
                                            LEFT JOIN resident r ON a.apartment_id = r.apartment_id
                                            LEFT JOIN vehicle v ON a.apartment_id = v.apartment_id
                                            GROUP BY a.apartment_id, a.apartment_id;`);
        res.json(apartments);
    } catch (error) {
        console.error("Error fetching apartments:", error);
        res.status(500).json({ message: "Error fetching data from database" });
    }
});

// ADD
app.post("/api/apartments", async (req, res) => {
    const { apartmentId, bedrooms, bathrooms, logia, area } = req.body;

    const query = "CALL add_apartment(?, ?, ?, ?, ?)"; // Call the stored procedure

    try {
        const [result] = await pool.query(query, [apartmentId, bedrooms, bathrooms, logia, area]);

        res.status(201).json({ message: "Apartment added successfully!", data: result });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Database error: " + error.sqlMessage });
    }
});

// DELETE route to remove an apartment by ID
app.delete("/api/apartments/:id", async (req, res) => {
    const { id } = req.params;  // Capture the ID from the route

    // Assuming id is a string (VARCHAR), no need to convert it
    const query = "DELETE FROM `apartment` WHERE `apartment_id` = ?";  // Use the correct column name for `id`

    try {
        const [results] = await pool.query(query, [id]);  // Pass id as a string
        if (results.affectedRows > 0) {
            res.status(200).json({ message: "Apartment deleted successfully" });
        } else {
            res.status(404).json({ message: "Apartment not found" });
        }
    } catch (error) {
        console.error("Error deleting apartment:", error);
        res.status(500).json({ message: "Error deleting apartment" });
    }
});

// EDIT
app.put("/api/apartments/:id", async (req, res) => {
    const { old_apartmentId, apartmentId, bedrooms, bathrooms, logia, area } = req.body;

    const query = "UPDATE `apartment` SET `apartment_id`=?, `bedrooms`=?, `bathrooms`=?, `loggias`=?, `area`=? WHERE `apartment_id`=?"; // Call the stored procedure

    try {
        const [result] = await pool.query(query, [apartmentId, bedrooms, bathrooms, logia, area, old_apartmentId]);

        res.status(201).json({ message: "Apartment added successfully!", data: result });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Database error: " + error.sqlMessage });
    }
});

/*
app.post("/api/apartments", async (req, res) => {
    const { apartmentId, bedrooms, bathrooms, logia, area } = req.body;
    
    const query = "INSERT INTO `Căn hộ` (`Căn hộ`, `Số phòng ngủ`, `Số WC`, `Số logia`, `Diện tích`) VALUES (?, ?, ?, ?, ?)";
    try {
        await pool.query(query, [apartmentId, bedrooms, bathrooms, logia, area]);
        res.status(201).json({ message: "Apartment added successfully" });
    } catch (error) {
        console.error("Error adding apartment:", error);
        res.status(500).json({ message: "Error adding apartment" });
    }
});*/

// Residents
// API route to fetch limited apartment data
app.get("/api/residents", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Default to 10 rows if not specified
        const [residents] = await pool.query(`SELECT * FROM \`resident\``);
        res.json(residents);
    } catch (error) {
        console.error("Error fetching apartments:", error);
        res.status(500).json({ message: "Error fetching data from database" });
    }
});

// ADD
app.post("/api/residents", async (req, res) => {
    const { name, apartment, birthday, phone, email } = req.body;

    const query = "CALL add_resident(?, ?, ?, ?, ?)"; // Call the stored procedure

    try {
        const [result] = await pool.query(query, [name, apartment, birthday, phone, email]);

        res.status(201).json({ message: "Apartment added successfully!", data: result });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Database error: " + error.sqlMessage });
    }
});

// EDIT
app.put("/api/residents/:id", async (req, res) => {
    const { old_id, id, name, apartment, birthday, phone, email } = req.body;

    const query = "UPDATE `resident` SET `resident_id`=?, `full_name`=?, `apartment_id`=?, `birth_date`=?, `phone_number`=?, `email`=? WHERE `resident_id`=?"; // Call the stored procedure

    try {
        const [result] = await pool.query(query, [id, name, apartment, birthday, phone, email, old_id]);

        res.status(201).json({ message: "Residents updated successfully!", data: result });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Database error: " + error.sqlMessage });
    }
});

// DELETE route to remove an apartment by ID
app.delete("/api/residents/:id", async (req, res) => {
    const { id } = req.params;  // Capture the ID from the route

    // Assuming id is a string (VARCHAR), no need to convert it
    const query = "DELETE FROM `resident` WHERE `resident_id` = ?";  // Use the correct column name for `id`

    try {
        const [results] = await pool.query(query, [id]);  // Pass id as a string
        if (results.affectedRows > 0) {
            res.status(200).json({ message: "Resident deleted successfully" });
        } else {
            res.status(404).json({ message: "Resident not found" });
        }
    } catch (error) {
        console.error("Error deleting resident:", error);
        res.status(500).json({ message: "Error deleting resident" });
    }
});

// Vehicles
// API route to fetch limited apartment data
app.get("/api/vehicles", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Default to 10 rows if not specified
        const [vehicles] = await pool.query(`SELECT * FROM \`vehicle\``);
        res.json(vehicles);
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ message: "Error fetching data from database" });
    }
});

// ADD
app.post("/api/vehicles", async (req, res) => {
    const { plate, apartment, type, status } = req.body;

    const query = "CALL add_vehicle(?, ?, ?, ?)"; // Call the stored procedure

    try {
        const [result] = await pool.query(query, [plate, apartment, type, status]);

        res.status(201).json({ message: "Vehicles added successfully!", data: result });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Database error: " + error.sqlMessage });
    }
});

// EDIT
app.put("/api/vehicles/:id", async (req, res) => {
    const { old_plate, plate, apartment, type, status } = req.body;

    const query = "UPDATE `vehicle` SET `license_plate`=?, `apartment_id`=?, `type`=?, `status`=? WHERE `license_plate`=?"; // Call the stored procedure

    try {
        const [result] = await pool.query(query, [plate, apartment, type, status, old_plate]);

        res.status(201).json({ message: "Residents updated successfully!", data: result });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Database error: " + error.sqlMessage });
    }
});

// DELETE route to remove an apartment by ID
app.delete("/api/vehicles/:id", async (req, res) => {
    const { id } = req.params;  // Capture the ID from the route

    // Assuming id is a string (VARCHAR), no need to convert it
    const query = "DELETE FROM `vehicle` WHERE `license_plate` = ?";  // Use the correct column name for `id`

    try {
        const [results] = await pool.query(query, [id]);  // Pass id as a string
        if (results.affectedRows > 0) {
            res.status(200).json({ message: "Vehicle deleted successfully" });
        } else {
            res.status(404).json({ message: "Vehicle not found" });
        }
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        res.status(500).json({ message: "Error deleting vehicle" });
    }
});

// Vehicles type
// GET
app.get("/api/vehicles-type", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Default to 10 rows if not specified
        const [vehicles] = await pool.query(`SELECT * FROM \`vehicle_type\``);
        res.json(vehicles);
    } catch (error) {
        console.error("Error fetching vehicles type:", error);
        res.status(500).json({ message: "Error fetching data from database" });
    }
});

// Log
// API route to fetch limited apartment data
app.get("/api/log", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Default to 10 rows if not specified
        const [log] = await pool.query(`SELECT * FROM \`entry_exit_log\``);
        res.json(log);
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ message: "Error fetching data from database" });
    }
});

// Vehicle In
app.post("/api/vehicle-in/:id", async (req, res) => {
    const { plate } = req.body;

    const query = "CALL vehicle_in(?)"; // Call the stored procedure

    try {
        const [result] = await pool.query(query, [plate]);

        res.status(201).json({ message: "Vehicle in successfully!", data: result });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Database error: " + error.sqlMessage });
    }
});

// Vehicle Out
app.post("/api/vehicle-out/:id", async (req, res) => {
    const { plate } = req.body;

    const query = "CALL vehicle_out(?)"; // Call the stored procedure

    try {
        const [result] = await pool.query(query, [plate]);

        res.status(201).json({ message: "Vehicle out successfully!", data: result });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Database error: " + error.sqlMessage });
    }
});

// Service fee
// API route to fetch limited Service fee data
app.get("/api/service-fees", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Default to 10 rows if not specified
        const [service_fees] = await pool.query(`SELECT * FROM \`service_fee\``);
        res.json(service_fees);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Error fetching data from database" });
    }
});

// ADD ALL
app.post("/api/service-fee-all", async (req, res) => {

    const query = "CALL service_fee_all()"; // Call the stored procedure

    try {
        const [result] = await pool.query(query);

        res.status(201).json({ message: "Added successfully!", data: result });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Database error: " + error.sqlMessage });
    }
});

// ADD SINGLE
app.post("/api/service-fees", async (req, res) => {
    const { id } = req.body;

    const query = "CALL service_fee_single(?)"; // Call the stored procedure

    try {
        const [result] = await pool.query(query, [id]);

        res.status(201).json({ message: "Added successfully!", data: result });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Database error: " + error.sqlMessage });
    }
});

// EDIT
app.put("/api/service-fee/:id", async (req, res) => {
    const { old_id, id, apartment, time, electric, water, clean, parking, status } = req.body;

    const query = "UPDATE `service_fee` SET `id`=?, `apartment_id`=?, `time_period`=?, `electricity_usage`=?, `water_usage`=?, `cleaning_fee`=?, `parking_fee`=?, `status`=? WHERE `id`=?"; // Call the stored procedure

    try {
        const [result] = await pool.query(query, [id, apartment, time, electric, water, clean, parking, status, old_id]);

        res.status(201).json({ message: "Updated successfully!", data: result });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Database error: " + error.sqlMessage });
    }
});

// DELETE route to remove an apartment by ID
app.delete("/api/service-fee/:id", async (req, res) => {
    const { id } = req.params;  // Capture the ID from the route

    // Assuming id is a string (VARCHAR), no need to convert it
    const query = "DELETE FROM `service_fee` WHERE `id` = ?";  // Use the correct column name for `id`

    try {
        const [results] = await pool.query(query, [id]);  // Pass id as a string
        if (results.affectedRows > 0) {
            res.status(200).json({ message: "Deleted successfully" });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        console.error("Error deleting:", error);
        res.status(500).json({ message: "Error deleting." });
    }
});

// PAY
app.put("/api/pay-service-fee/:id", async (req, res) => {
    const { id } = req.params;  // Capture the ID from the route

    // Assuming id is a string (VARCHAR), no need to convert it
    const query = "CALL pay_service_fee(?);";  // Use the correct column name for `id`

    try {
        const [result] = await pool.query(query, [id]);

        res.status(201).json({ message: "Paying successfully!", data: result });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Database error: " + error.sqlMessage });
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

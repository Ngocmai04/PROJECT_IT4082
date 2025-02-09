import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST, 
  user: process.env.MYSQL_USER, 
  password: process.env.MYSQL_PASSWORD, 
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();


// Get apartments
/*
export async function getApartments() {
    try {
      // Execute query to get apartments
      const [apartments] = await pool.query(`SELECT * FROM \`Căn hộ\` LIMIT ?`, [10]);
      console.log(apartments); // Log the results
      return apartments;
    } catch (err) {
      console.error('Error fetching apartments:', err);
    }
}

// Get Vehicle Types
export async function getVehicleTypes() {
    try {
      // Execute query to get apartments
      const [vehicles] = await pool.query("SELECT * FROM `Loại xe`;");
      console.log(vehicles); // Log the results
    } catch (err) {
      console.error('Error fetching apartments:', err);
    }
}
*/

// Test
//getApartments();
//getVehicleTypes();
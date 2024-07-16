// database.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://default:h3InKsOHBPX9@ep-fragrant-dream-a4rhmytm-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
});


async function insertMessage(senderId, receiverId, content, time) {
  const insertQuery = `
    INSERT INTO Message (senderid, receiverid, content, time)
    VALUES ($1, $2, $3, $4)
  `;
  try {
    await pool.query(insertQuery, [senderId, receiverId, content, time]);
    console.log("Message inserted successfully");
  } catch (error) {
    console.error("Error inserting message into database:", error);
  }
}

async function fetchMessagesBetween(senderId, receiverId) {
  const selectQuery = `
    SELECT * FROM Message
    WHERE (senderid = $1 AND receiverid = $2) OR (senderid = $2 AND receiverid = $1)
    ORDER BY time ASC
  `;
  try {
    const result = await pool.query(selectQuery, [senderId, receiverId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching messages from database:", error);
    return [];
  }
}


module.exports = {
  insertMessage,
};

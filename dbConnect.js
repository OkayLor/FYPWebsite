// dbConnect.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '192.168.192.50',
    user: 'appuser',
    password: 'Password123',
    database: 'rp_games',
    waitForConnections: true,
    connectionLimit: 1000000000000,
    queueLimit: 0,
    connectTimeout: 1000000000 //10 seconds
});

// Error handling of the connection
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = connection;

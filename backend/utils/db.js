import mysql from 'mysql2';

// allowing multiple queries without waiting for finishing previous
const dbPool = mysql.createPool({
	host: 'localhost',
	user: 'admin1',
	database: 'yoganka',
	password: 'admin1',
});

// promise will allow us use promises and use of async task with chaining instead of callbacks
export default dbPool.promise();

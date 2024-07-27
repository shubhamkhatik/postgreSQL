import { Client } from 'pg'
 
const client = new Client({
  connectionString: process.env.databasestring,
 
})



// async function createUsersTable() {
//     await client.connect()
//     const result = await client.query(`
//         CREATE TABLE users (
//             id SERIAL PRIMARY KEY,
//             username VARCHAR(50) UNIQUE NOT NULL,
//             email VARCHAR(255) UNIQUE NOT NULL,
//             password VARCHAR(255) NOT NULL,
//             created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//         );
//     `)
//     console.log(result)
// }
// async function createAddressTable() {
//     await client.connect()
//     const result = await client.query(`
//         CREATE TABLE addresses (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER NOT NULL,
//     city VARCHAR(100) NOT NULL,
//     country VARCHAR(100) NOT NULL,
//     street VARCHAR(255) NOT NULL,
//     pincode VARCHAR(20),
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// );
//     `)
//     console.log(result)
// }
// async function createProductTable() {
//     await client.connect()
//     const result = await client.query(`
//         CREATE TABLE products (
//             id SERIAL PRIMARY KEY,
//             productname VARCHAR(50) UNIQUE NOT NULL,
//             price VARCHAR(255) UNIQUE NOT NULL,
//             created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//             available BOOLEAN
//         );
//     `)
//     console.log(result)
// }

// createUsersTable();
// createAddressTable()
// createProductTable()



// Async function to insert data into a table
// async function insertData() {
 

//   try {
//     await client.connect(); // Ensure client connection is established
//     const insertQuery = "INSERT INTO users (username, email, password) VALUES ('hitesh', 'hit@example.com', 'hitpass');";
//     const res = await client.query(insertQuery);
//     console.log('Insertion success:', res); // Output insertion result
//   } catch (err) {
//     console.error('Error during the insertion:', err);
//   } finally {
//     await client.end(); // Close the client connection
//   }
// }

// insertData();




// Async function to fetch user data from the database given an email
// async function getUser(email: string) {
//   try {
//     await client.connect(); // Ensure client connection is established
//     const query = 'SELECT * FROM users WHERE email = $1';
//     const values = [email];
//     const result = await client.query(query, values);
    
//     if (result.rows.length > 0) {
//       console.log('User found:', result.rows[0]); // Output user data
//       return result.rows[0]; // Return the user data
//     } else {
//       console.log('No user found with the given email.');
//       return null; // Return null if no user was found
//     }
//   } catch (err) {
//     console.error('Error during fetching user:', err);
//     throw err; // Rethrow or handle error appropriately
//   } finally {
//     await client.end(); // Close the client connection
//   }
// }

// Example usage
// getUser('su@example.com').catch(console.error);




async function insertUserAndAddress(
    username: string, 
    email: string, 
    password: string, 
    city: string, 
    country: string, 
    street: string, 
    pincode: string
) {
    

    try {
        await client.connect();

        // Start transaction
        await client.query('BEGIN');

        // Insert user
        const insertUserText = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;
        const userRes = await client.query(insertUserText, [username, email, password]);
        const userId = userRes.rows[0].id;

        // Insert address using the returned user ID
        const insertAddressText = `
            INSERT INTO addresses (user_id, city, country, street, pincode)
            VALUES ($1, $2, $3, $4, $5);
        `;
        await client.query(insertAddressText, [userId, city, country, street, pincode]);

        // Commit transaction
        await client.query('COMMIT');

        console.log('User and address inserted successfully');
    } catch (err) {
        await client.query('ROLLBACK'); // Roll back the transaction on error
        console.error('Error during transaction, rolled back.', err);
        throw err;
    } finally {
        await client.end(); // Close the client connection
    }
}

// Example usage
insertUserAndAddress(
    'hitesh choudhary', 
    'hitesh.doe@example.com', 
    'hitesh123', 
    'jaipurcity Yok', 
    'india', 
    'chai chowk ward', 
    '096969'
);


const express = require('express');
const sql = require('mssql'); // new line
const app = express();
const dbConfig = {
    server: 'localhost',
    port: 1433,
    database: 'NPBookstore',
    user: 'npbookstore_user',
    password: 'Ilovemiatas2009!',
    options: {
        trustServerCertificate: true
    }
};
    

    app.get('/', (req, res) => {
    res.send('Welcome to the Book Category API');
    });

    app.get('/categories', (req, res) => {
    res.json([
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Non-Fiction' },
    { id: 3, name: 'Biography' }
    ]);
    });

    app.get('/about', (req, res) => {
    res.send('This API provides information about book categories. It is the first version of the API and is intended for educational purposes.');
    });

    app.get('/db-test', async (req, res) => {
        try {
            const pool = await sql.connect({
            server: 'localhost',
            port: 1433,
            database: 'NPBookstore',
            user: 'npbookstore_user',
            password: 'Ilovemiatas2009!',
            options: { trustServerCertificate: true },
    });

    const result = await pool.request()
        .query('SELECT COUNT(*) AS Total FROM Author');
            await pool.close();
            res.json({ connected: true, authors: result.recordset[0].Total });
            } 
    
    catch (err) {
    res.status(500).json({ connected: false, error: err.message });
    }
    })


    app.use('/authors', async (req, res) => {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const result = await connection.request().query('SELECT * FROM Author');
            res.status(200).json(result.recordset);
        }
        catch (err) {
            console.error('Error fetching authors:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
        finally {
            if (connection) {
                await connection.close();
            }
        }
    });
       
        app.get('/authors/:id', async (req, res) => {
    // parseInt the id and answer 400 if it is NaN
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid author ID. Must be a number.' });
    }

    let connection;

    try {
        // 1. Open the connection
        connection = await sql.connect(dbConfig);

        // Query using parameterized input
        const result = await connection.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Author WHERE AuthorId = @id'); // Adjust column name if needed (e.g., id)

        // Answer 404 if no row matches
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Author not found' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching author by ID:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        // 2. Close the connection in finally
        if (connection) {
            await connection.close();
        }
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`bookcat-api running on port ${PORT}`);
});

    app.listen(3000, () => {
    console.log('Listening on port 3000');
    });
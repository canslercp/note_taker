const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const db = require('./db/db.json')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

//Default route that sends you to the index.html file
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    res.json(db);

    // Send a message to the client
    res.status(200).json(`${req.method} request received to get notes`);
    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});

//POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post('/api/notes', (req, res) => {
    //Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    //Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    //If all the required properties are present
    if (title && text) {
        //Variable for the object we will save
        const newNote = {
            title,
            text,
        };

        //Obtain existing notes 
        fs.readFile(db, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                //Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                //Add a new note
                parsedNotes.push(newNote);

                //Write updated reviews back to the file
                fs.writeFile(db, JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes')
                );
            }
        });
        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

//Listen for connections
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
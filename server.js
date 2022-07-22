const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3031;
const db = require('./db/db.json')

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static('public'));

//Default route that sends you to the index.html file
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req,res) => {
    res.json(db);
});

//POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post('/api/notes', (req,res) => {

})

//Listen for connections
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));

// GET Route for homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});
//GET Route for notes in db
app.get('/api/notes', (req, res) => {
  res.status(200).json(db);
});

//POST Route for sending notes on request
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to post note`);

    // Destructuring assignment for the items in req.body
    const { note, username } = req.body;
  
    // If all the required properties are present
    if (product && username) {
      // Variable for the object we will save
      const newNote = {
        note,
        username,
        review_id: uuid(),
      };
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid.js');
const api = require('./routes/index.js');
const db = require('./db/db');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);


// GET Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});
// GET Route for notes in db
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
    // res.status(200).json(db);
});

// API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading notes:", err);
            return res.sendStatus(500);
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to post note`);

    // let newNote;
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    let newNote;
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      newNote = {
        title,
        text,
        note_id: uuid(),
      };
  
      const response = {
        status: 'success',
        body: newNote,
      };
    }

    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading notes:", err);
            return res.sendStatus(500);
        }
        const allNotes = JSON.parse(data);
        allNotes.push(newNote);

        fs.writeFile('db/db.json', JSON.stringify(allNotes), (err) => {
            if (err) {
                console.error("Error saving note:", err);
                return res.sendStatus(500);
            }
            res.json(newNote);
        });
    });
});

// app.put('/api/notes/:id', (req, res) => {
//     const noteId = req.params.id;
//     const { title, text } = req.body;

//     // Validate input
//     if (!title || !text) {
//         return res.status(400).json({ error: 'Title and text are required for an update' });
//     }

//     fs.readFile('db/db.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error("Error reading notes:", err);
//             return res.sendStatus(500);
//         }

//         const allNotes = JSON.parse(data);

//         // Find the index of the note with the specified ID
//         const noteIndex = allNotes.findIndex(note => note.note_id === noteId);

//         if (noteIndex === -1) {
//             return res.status(404).json({ error: 'Note not found' });
//         }

//         // Update the note
//         allNotes[noteIndex] = {
//             note_id: noteId,
//             title,
//             text
//         };

//         // Write the updated notes back to the file
//         fs.writeFile('db/db.json', JSON.stringify(allNotes), (err) => {
//             if (err) {
//                 console.error("Error updating note:", err);
//                 return res.sendStatus(500);
//             }

//             res.json(allNotes[noteIndex]); // Return the updated note
//         });
//     });
// });

app.delete('/api/notes/:index', (req, res) => {
    const noteIndex = parseInt(req.params.index, 10);

    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading notes:", err);
            return res.sendStatus(500);
        }
        const allNotes = JSON.parse(data);
        
        if (noteIndex < 0 || noteIndex >= allNotes.length) {
            return res.status(400).send("Invalid note index");
        }
        
        allNotes.splice(noteIndex, 1); // Removes the note at the given index
        
        fs.writeFile('db/db.json', JSON.stringify(allNotes), (err) => {
            if (err) {
                console.error("Error deleting note based on index:", err);
                return res.sendStatus(500);
            }
            res.json({ message: "Note deleted based on index!" });
        });
    });
});



app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

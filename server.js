const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('./db/db');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');
const uuid = require('./helpers/uuid');
const res = require('express/lib/response');

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static('public'));

// function createNewNote(body, notesArray) {
//   const note = body;
//   notesArray.push(note);
//   fs.writeFileSync(
//     path.join(__dirname, './db/db.json'),
//     JSON.stringify({ notes: notesArray }, null, 2)
//   );
//   return note;
// }

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './db/db.json'));
});

app.post('/api/notes', (req, res) => {
  // req.body.id = db.length.toString();
  console.info(`${req.method} request recieved to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);

        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) => 
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.json(response);
  } else {
    res.json('Error in posting note');
  } 
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
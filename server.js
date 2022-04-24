const express = require('express');
//const { v4: uuidv4 } = require('uuid');
const db = require('./db/db');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');
const uuid = require('./helpers/uuid');
const res = require('express/lib/response');

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './db/db.json'));
});

app.delete('/api/notes/:note_id', (req, res) => {
  console.info(`${req.method} request recieved to delete a note`);

  const { note_id } = req.body;

  const newNotesArray = [];

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      for (i = 0; i < parsedNotes.length; i++) {
        if (parsedNotes[i].note_id !== req.params.note_id) {
          newNotesArray.push(parsedNotes[i]);
        }
      }
      console.info(newNotesArray);
      fs.writeFile(
        './db/db.json',
        JSON.stringify(newNotesArray, null, 4),
        (writeErr) => 
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
      );
    }
  })
});

app.post('/api/notes', (req, res) => {
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
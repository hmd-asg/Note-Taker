const notes = require('express').Router();
const uuid = require('../helpers/uuid');
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

// This API route is a GET Route for retrieving all the notes
notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

// This API route is a POST Route for a new UX/UI note
notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            note_id: uuid(),
            title,
            text
        };

        readAndAppend(newNote, './db/notes.json');
        res.json(`Note added successfully 🚀`);
    } else {
        res.error('Error in adding note');
    }
});

// This API route is a DELETE Route for a delete UX/UI note
notes.delete('/:id', async (req, res) => {
    console.info(`${req.method} request received for notes`);
    // Get the id parameter
    const { id } = req.params;
    console.log(id);
    let notes_db = [];
    let note;
    let index;
    await readFromFile('./db/notes.json')
        .then((data) => {
            notes_db = JSON.parse(data)
        });

    note = notes_db.find((note) => note.note_id === id);

    if (!note) {
        res.status(404).json({
            status: 'Failed',
            message: 'No note found with this id'
        });
    }
    index = notes_db.indexOf(note);
    notes_db.splice(index, 1);

    // // Test if note exist
    writeToFile('./db/notes.json', notes_db);
    res.json('Note deleted');

});

module.exports = notes; 

const express = require("express");
const NotesService = require("./notes-service");
const xss = require("xss");
const notesRouter = express.Router();
const jsonParser = express.json();
const path = require("path");

const serializeNotes = (notes) => ({
  notes_id: notes.notes_id,
  notes_name: notes.notes_name,
  notes_content: xss(notes.notes_content),
  date_published: notes.date_published,
  folders_id: notes.folders_id,
});

notesRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NotesService.getAllNotes(knexInstance)
      .then((notes) => {
        res.json(notes.map(serializeNotes));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { notes_name, notes_content, folders_id } = req.body;
    const newNotes = { notes_name, notes_content, folders_id };

    for (const [key, value] of Object.entries(newNotes))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
         
    newNotes.date_published = date_published;

    NotesService.insertNotes(req.app.get("db"), newNotes)
      .then((notes) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${notes.notes_id}`))
          .json(serializeNotes(notes));
      })
      .catch(next);
  });

notesRouter
  .route("/:notes_id")
  .all((req, res, next) => {
    NotesService.getById(req.app.get("db"), req.params.notes_id)
      .then((notes) => {
        if (!notes) {
          return res.status(404).json({
            error: { message: `notes doesn't exist` },
          });
        }
        res.notes = notes;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeNotes(res.notes));
  })
  .delete((req, res, next) => {
    NotesService.deleteNotes(req.app.get("db"), req.params.notes_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { text, date_published } = req.body;
    const notesToUpdate = { text, date_published };

    const numberOfValues = Object.values(notesToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'text' or 'date_published'`,
        },
      });

    NotesService.updateNotes(
      req.app.get("db"),
      req.params.notes_id,
      notesToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;

const express = require("express");
const FoldersService = require("./folders-service");
const xss = require("xss");
const foldersRouter = express.Router();
const jsonParser = express.json();

foldersRouter
  .route("/")
  .get((req, res, next) => {
    FoldersService.getAllFolders(req.app.get("db"))
      .then((folders) => {
        res.json(folders);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { folders_name} = req.body;
    const newFolders = { folders_name };
    FoldersService.insertFolders(req.app.get("db"), newFolders)
        .then((folders) => {
        res.status(201).location(`/folders/${folders.folders_id}`).json(folders);
      })
      .catch(next);
  });

foldersRouter
  .route("/:folders_id")
  .all((req, res, next) => {
    FoldersService.getById(req.app.get("db"), req.params.folders_id)
      .then((folders) => {
        if (!folders) {
          return res.status(404).json({
            error: { message: `folders doesn't exist` },
          });
        }
        res.folders = folders; // save the folders for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json({
      folders_id: res.folders.folders_id,
      folders_name: xss(res.folders.folders_name),
      date_published: res.folders.date_published,
    });
  });

module.exports = foldersRouter;

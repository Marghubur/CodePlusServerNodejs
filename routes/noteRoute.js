const express = require("express");
const router = express.Router();

const { verifyToken } = require("../util/verifyToken.js");

const {GetAllNotes, GetNoteById, ManageNote, CreateFolder} = require("../controller/noteController.js")
router.get("/GetAllNotes", GetAllNotes);
router.get("/GetNoteById/:noteId", GetNoteById);
router.post("/ManageNote", ManageNote);
router.post("/CreateFolder", CreateFolder);


module.exports = router;
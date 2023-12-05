const express = require("express");
const router = express.Router();

const {GetAllNotes, GetNoteById, ManageNote} = require("../controller/noteController.js")
router.get("/GetAllNotes", GetAllNotes);
router.get("/GetNoteById/:noteId", GetNoteById);
router.post("/ManageNote", ManageNote);


module.exports = router;
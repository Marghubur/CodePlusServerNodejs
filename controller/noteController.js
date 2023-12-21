const db = require("../db.config");
const note = db.note;
const path = require('path');
const util = require("../util/util.js");
const { ApiResponse } = require("../util/apiResponse.js");
const fs = require('fs');


const GetAllNotes = async (req, res, next) => {
    try {
        await note.findAll().then(data => {
            return next(ApiResponse(data, 200))
        })
    } catch (error) {   
        return next(ApiResponse(error.message, 500));
    }
};

const GetNoteById = async (req, res, next) => {
    try {
        const id =  Number(req.params.noteId);
        if (id <= 0)
            return next(ApiResponse("Invalid note id", 500));

        await note.findByPk(id).then(data => {
            if (!data)
                return next(ApiResponse("Record not found", 500));

            var filepath = path.join(process.cwd(), "public", data.FilePath);
            if (filepath.includes("\\"))
                filepath = filepath.replace("\\", "/");
            
            const readData = fs.readFileSync(filepath, "utf8");
            data.Content = readData;
            return next(ApiResponse(data, 200));
        })
    } catch (error) {   
        return next(ApiResponse(error.message, 500));
    }
};

const ManageNote = async (req, res, next) => {
    try {
        var content = req.body.Content;
        var noteId = req.body.NoteId;
        var title = req.body.Title;
        var noteDetail = {
            NoteId: noteId != null ? noteId : 0,
            Content: content,
            UserId: 0,
            Title: title,
            FilePath: null
        }

        var result = null;
        if (noteDetail.NoteId == 0)
            result =  createNote(noteDetail);
        else
            result = updateNote(noteDetail);

        return next(ApiResponse(result, 200));
    } catch (error) {   
        return next(ApiResponse(error.message, 500));
    }
};

const createNote = async (noteDetail) => {
    try {
        var lasNote = await note.findOne({
            order: [["NoteId", "DESC"]]
        });
        var noteId = 1;
        if (lasNote) {
            noteId = lasNote.NoteId + 1;
        } 
        var filepath = util.saveTxtFile("notes", noteDetail.Content, "NOTES_"+ noteId);
        if (!filepath)
            return next(ApiResponse("Fail to generate text file", 500));

        var noteDetailObj = {
            NoteId: noteId,
            UserId: 0,
            Title: noteDetail.Title,
            FilePath: filepath
        }
        await note.create(noteDetailObj);
        return noteDetailObj;
    } catch (error) {
        return (error);
    }
}

const updateNote = async (noteDetail) => {
    try {
        var content = await note.findByPk(noteDetail.NoteId);
        if (!content)
            return "record not found";

        var filepath = util.saveTxtFile("Notes", noteDetail.Content, "NOTES_"+ noteDetail.NoteId);
        if (!filepath)
            return next(ApiResponse("Fail to generate text file", 500));

        var noteDetailObj = {
            NoteId: content.NoteId,
            UserId: content.UserId,
            Title: noteDetail.Title,
            FilePath: filepath
        }
        await note.update(noteDetailObj, {
            where : {
                NoteId: content.NoteId,
            },
        })
        return noteDetailObj;
    } catch (error) {
        return (error);
    }
}

const CreateFolder = async(req, res, next) => {
    try {
        var folderName = req.body.FolderName;
        if (!folderName)
            return next(ApiResponse("Folder name is valid", 500));

        var result = util.CreateFolder(folderName);
        return next(ApiResponse(result, 200));
    } catch (error) {
        return (error);
    }
}

module.exports = {GetAllNotes, GetNoteById, ManageNote, CreateFolder}
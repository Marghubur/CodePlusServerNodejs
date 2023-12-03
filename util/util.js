const fs = require('fs');
const path = require('path');

module.exports = {
    saveFile(folderName, file, fileName, oldfileName) {
        const uploadedFile = file;

        //delte old file if exists
        if (oldfileName && fs.existsSync(oldfileName)) {
            fs.unlinkSync(oldfileName);
        }

        var ext = (uploadedFile.name||'').split('.');
        const fileExtension = ext[ext.length - 1];
        const folderPath = path.join(process.cwd(), folderName);
        const targetPath = path.join(folderPath, fileName + "." +fileExtension);
        !fs.existsSync(folderPath) && fs.mkdirSync(folderPath);
        if (fs.existsSync(targetPath)) {
            fs.unlinkSync(targetPath);
        }

        uploadedFile.mv(targetPath, (err) => {
            if (err) {
            console.error(err);
            return err.message;
            }
        });
        return path.join(folderName, fileName + "." +fileExtension);
    },

    saveTxtFile(folderName, content, fileName) {
        const folderPath = path.join(process.cwd(), folderName);
        const targetPath = path.join(folderPath,fileName + ".txt");
        if (fs.existsSync(targetPath)) {
            fs.unlinkSync(targetPath);
        }
         
        fs.writeFile(targetPath, content, (err) => {
            if (err) {
                console.error(err);
                return err.message;
            } 
        });
        return path.join(folderName,fileName + ".txt");
    }

}
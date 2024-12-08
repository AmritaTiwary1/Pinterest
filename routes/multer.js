/* UUIDs can be used for various purposes, such as:

Identifying resources uniquely in a database.
Generating unique session IDs.
Creating unique identifiers for user accounts or transactions
*/

const multer = require('multer');  //The disk storage provided by the Express Multer package refers to the server-side disk storage, which is controlled by the developer. This means that when files are uploaded, they are stored on the server's disk, not on the user's local disk. The developer has full control over the storage destination and configuration, allowing them to specify the upload directory, file naming conventions, and other storage settings. This server-side storage is typically used for temporary or permanent storage of uploaded files, and the developer can then choose to serve these files from the server or perform additional processing on them.
const {v4:uuidv4} = require('uuid'); //we have to use v4 version of uuid
const path = require("path");  // when we upload file using multer package, uuid package is giving unique name to it, but there is no extension in it,when we upload that file, we will extract extension of original file and will add to saved file(in ./public/images/uploads)

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./public/images/uploads'); //destination folder for uploads
 },
 filename: function(req,file,cb){
    const uniquename = uuidv4();  // it will generate unique filename using uuid
    cb(null , uniquename + path.extname(file.originalname));  //use the unique filename for the uploaded file
 }
});

const upload = multer({storage: storage});  // in upload variable, storage var is passed which is using multer functionality

module.exports = upload; // exporting upload var to use it 





const multer = require('multer');
const uuid = require('uuid');
const MIME_TYPE_MAP = {
   'image/png':'png',
   'image/jpeg':'jpeg',
   'image/bitman':'bitmap',
   'image/jpg':'jpg'
}
export const fileUpload = multer({
   limits:500000,
   storage:multer.diskStorage({
      destination:(req,file,cb) => {
         cb(null,'../uploads/images')
      },
      filename:(req,file,callback) => {
         const ext = !!MIME_TYPE_MAP[file.mimetype]
         callback(null,uuid() + '.' + ext);
      }
   }),
   fileFilter:(req,file,callback) => {
      const isValid = !!MIME_TYPE_MAP[file.mimetype];
      let error = isValid ? null : new Error('Invalid MimeType');
      callback(error,isValid);
   }
});

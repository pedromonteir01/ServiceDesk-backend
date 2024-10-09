const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../public/uploads/users");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/uploads/users");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now().toString() + "_" + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    const extensaoImg = ["image/png", "image/jpg", "image/jpeg"].find(
      (formatoAceito) => formatoAceito === file.mimetype
    );

    if (extensaoImg) {
      return cb(null, true);
    }
    return cb(null, false);
  },
});

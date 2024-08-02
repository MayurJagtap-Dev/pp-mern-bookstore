import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();
const storage = multer.diskStorage({
  // destination: "uploads/",
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const mimetypes = /image\/jpg|image\/jpeg|image\/png|image\/webp/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("File upload only supports (png,jpg,jpeg,webp) filetypes"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  //limits: { fileSize: 1024 * 1024 * 5 },
});
router.post("/", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    } else if (!req.file) {
      return res.status(400).send({ message: "No image file provided" });
    } else {
      return res.status(200).send({
        message: "Image uploaded successfully",
        image: `/${req.file.path}`,
      });
    }
  });
});

export default router;

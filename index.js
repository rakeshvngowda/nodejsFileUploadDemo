const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// var upload = multer({ dest: "upload_folder_name" })
// If you do not want to use diskStorage then uncomment it

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Uploads is the upload_folder_name
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

// Define the maximum size for uploading
// picture i.e 1MB, it is optional

const maxSize = 1 * 1000 * 1000;

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(
      "Error: File upload only supports the " +
        "Following filetypes - " +
        filetypes
    );
  },
}).single("mypic");

app.get("/", (req, res) => {
  res.render("Signup");
});

app.post("/uploadProfilePicture",(req,res,next)=> {
    
    // Error Middleware for multer file upload, so if any
    // error occurs, the image would not be uploaded!

    upload(req,res,(err)=> {
        if (err) {
            res.send(err)
        }
        else {
            res.send("Success,Image uploaded!")
        }
    })
})

app.listen(8080, () => {
  console.log("Server created successfully on PORT 8080");
});

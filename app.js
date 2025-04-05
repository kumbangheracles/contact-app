const express = require("express");
const app = express();
const port = 3000;
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");

app.use(methodOverride(`_method`));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
require("./utils/db");
const Contact = require("./model/contact");

app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  const students = [
    { name: "Herkal", email: "herkal@gmail.com" },
    { name: "Wahyu", email: "wahyu@gmail.com" },
    { name: "Jamal", email: "jamal@gmail.com" },
  ];
  res.render("index", {
    layout: "layouts/main-layouts",
    name: "Ahmad Herkal",
    title: "Home Page",
    students,
  });
  console.log("halaman home");
});

// About
app.get("/about", (req, res) => {
  res.render("about", { title: "About Page", layout: "layouts/main-layouts" });
});

// Contact
app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();
  res.render("contact", {
    title: "Contact Page",
    layout: "layouts/main-layouts",
    contacts,
    msg: req.flash("msg"),
  });
});

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Form Tambah Data Contact",
    layout: "layouts/main-layouts",
  });
});

// Add contact
app.post(
  "/contact",
  [
    check("email", "Email tidak valid!").isEmail(),
    check("noHp", "Nomor Hp tidak valid!").isMobilePhone("id-ID"),
    body("nama").custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (duplikat) {
        throw new Error("Nama contact sudah terdaftar");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("add-contact", {
        title: "Form Tambah Data Contact",
        layout: "layouts/main-layouts",
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        req.flash("msg", "Data contact berhasil ditambahkan!!");
        res.redirect("/contact");
      });
    }
  }
);

// delete contact
// app.get("/contact/delete/:nama", async (req, res) => {
//   const contact = await Contact.findOne({ nama: req.params.nama });

//   // jika contact tidak ada
//   if (!contact) {
//     res.status(404);
//     res.send(`<h1>404</h1>`);
//   } else {
//     // Contact.deleteOne({_id: contact._id})
//     contact.deleteOne({ nama: req.params.nama }).then((result) => {
//       req.flash("msg", "Data contact berhasil dihapus!!");
//       res.redirect("/contact");
//     });
//   }
// });

app.delete("/contact", (req, res) => {
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash("msg", "Data contact berhasil dihapus!!");
    res.redirect("/contact");
  });
});

// Detail Contact
app.get("/contact/:nama", async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render("detail", {
    title: "Contact Detail",
    layout: "layouts/main-layouts",
    contact,
  });
});

// Update Contact
app.get("/contact/edit/:nama", async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render("edit-contact", {
    title: "Form Update Data Contact",
    layout: "layouts/main-layouts",
    contact,
  });
});

// proses update
app.put(
  "/contact",
  [
    body("nama").custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama contact sudah terdaftar");
      }
      return true;
    }),
    check("email", "Email tidak valid!").isEmail(),
    check("noHp", "Nomor Hp tidak valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("edit-contact", {
        title: "Form Update Data Contact",
        layout: "layouts/main-layouts",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            nama: req.body.nama,
            email: req.body.email,
            noHp: req.body.noHp,
          },
        }
      ).then((result) => {
        req.flash("msg", "Data contact berhasil diupdate!!");
        res.redirect("/contact");
      });
    }
  }
);

app.listen(port, () => {
  console.log(`Mongo Contact App | Listening at ${port}`);
});

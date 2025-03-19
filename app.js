// Express Setup
const express = require("express");
const app = express();
const port = 3000;
const expressLayouts = require("express-ejs-layouts");
const {
  loadContacts,
  findContact,
  addNewContact,
  cekDukplikat,
  deleteContact,
  updateContacts,
} = require("./utils/datas");
const { body, validationResult, check } = require("express-validator");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
app.set("view engine", "ejs");
// Middleware
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

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
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Page", layout: "layouts/main-layouts" });
});

app.get("/contact", (req, res) => {
  const contacts = loadContacts();
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

app.post(
  "/contact",
  [
    check("email", "Email tidak valid!").isEmail(),
    check("noHp", "Nomor Hp tidak valid!").isMobilePhone("id-ID"),
    body("nama").custom((value) => {
      const duplikat = cekDukplikat(value);
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
      addNewContact(req.body);
      req.flash("msg", "Data contact berhasil ditambahkan!!");
      res.redirect("/contact");
    }
  }
);

// delete contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  // jika contact tidak ada
  if (!contact) {
    res.status(404);
    res.send(`<h1>404</h1>`);
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Data contact berhasil dihapus!!");
    res.redirect("/contact");
  }
});

// Update Contact

app.get("/contact/:name", (req, res) => {
  const contact = findContact(req.params.name);
  res.render("detail", {
    title: "Contact Detail",
    layout: "layouts/main-layouts",
    contact,
  });
});

app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("edit-contact", {
    title: "Form Update Data Contact",
    layout: "layouts/main-layouts",
    contact,
  });
});

// proses update
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDukplikat(value);
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
      updateContacts(req.body);
      req.flash("msg", "Data contact berhasil diupdate!!");
      res.redirect("/contact");
    }
  }
);

app.use((req, res) => {
  res.status(404).send("<h1>404 Not Found</h1>");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

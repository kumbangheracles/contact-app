// import Contact from "../model/contact";
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/contact_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// const Contact = mongoose.model("Contact", {
//   nama: {
//     type: String,
//     required: true,
//   },
//   noHp: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//   },
// });

// const contact1 = new Contact({
//   nama: "Ahmad herkal",
//   noHp: "08123456789",
//   email: "herkalahmad@gmail.com",
// });

// // save data to collection
// contact1.save().then((contact) => console.log(contact));

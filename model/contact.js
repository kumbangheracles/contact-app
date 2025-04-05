const mongoose = require("mongoose");

// create schema
const Contact = mongoose.model("Contact", {
  nama: {
    type: String,
    required: true,
  },
  noHp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
});

module.exports = Contact;

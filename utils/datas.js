const fs = require("fs");
const { resolve } = require("path");
const readline = require("readline");

// Membuat direktori jika belum ada
const dataDir = "./data";
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Membuat file jika belum ada
const dataFile = "./data/contacts.json";
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]", "utf-8");
}

const loadContacts = () => {
  const file = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(file);
};

const findContact = (nama) => {
  const contacts = loadContacts();
  const tampilContact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
  return tampilContact;
};

const saveContacts = (contacts) => {
  fs.writeFileSync(dataFile, JSON.stringify(contacts));
};

const addNewContact = (contact) => {
  const contacts = loadContacts();
  contacts.push(contact);
  saveContacts(contacts);
};

// check duplicate
const cekDukplikat = (nama) => {
  const contacts = loadContacts();
  const tampilContact = contacts.find((i) => i.nama === nama);
  return tampilContact;
};

// delete contact
const deleteContact = (nama) => {
  const contacts = loadContacts();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);

  saveContacts(filteredContacts);
};

// Update contacts
const updateContacts = (contacBaru) => {
  const contacts = loadContacts();
  // hilangkan contact lama yg namanya sama dengan oldNama
  const filteredContacts = contacts.filter(
    (contact) => contact.nama !== contacBaru.oldNama
  );
  delete contacBaru.oldNama;
  filteredContacts.push(contacBaru);
  saveContacts(filteredContacts);
};

module.exports = {
  loadContacts,
  findContact,
  addNewContact,
  cekDukplikat,
  deleteContact,
  updateContacts,
};

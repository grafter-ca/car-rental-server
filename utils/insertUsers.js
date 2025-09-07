const User = require("../models/User");
const insertDocument = require("../utils/insertDocument");

const users = [
  { name: "Caleb", email: "caleb@example.com", password: "12345" },
  { name: "Alice", email: "alice@example.com", password: "12345" },
];

insertDocument(User, users)
  .then(docs => console.log("Users inserted:", docs))
  .catch(err => console.error(err));

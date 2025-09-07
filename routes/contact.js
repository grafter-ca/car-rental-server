const express = require("express");
const Contact = require("../models/Contact");
const router = express.Router();

// Add a contact message
router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single message
router.get("/:id", async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete message
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

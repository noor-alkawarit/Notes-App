const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Helper functions
const readNotes = () => {
  const data = fs.readFileSync("data.json", "utf8");
  return JSON.parse(data);
};

const writeNotes = (notes) => {
  fs.writeFileSync("data.json", JSON.stringify(notes, null, 2));
};

// Routes

// GET all notes
app.get("/api/notes", (req, res) => {
  res.json(readNotes());
});

// CREATE note
app.post("/api/notes", (req, res) => {
  const notes = readNotes();
  const newNote = {
    id: Date.now(),
    text: req.body.text,
  };
  notes.push(newNote);
  writeNotes(notes);
  res.status(201).json(newNote);
});

// UPDATE note
app.put("/api/notes/:id", (req, res) => {
  const notes = readNotes();
  const index = notes.findIndex(n => n.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes[index].text = req.body.text;
  writeNotes(notes);
  res.json(notes[index]);
});

// DELETE note
app.delete("/api/notes/:id", (req, res) => {
  const notes = readNotes().filter(n => n.id != req.params.id);
  writeNotes(notes);
  res.status(204).end();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

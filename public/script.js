const form = document.getElementById("note-form");
const input = document.getElementById("note-input");
const list = document.getElementById("notes-list");

async function loadNotes() {
  const res = await fetch("/api/notes");
  const notes = await res.json();

  list.innerHTML = "";

  notes.forEach(note => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = note.text;
    span.className = "note-text";

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.className = "edit";
    edit.type = "button";
    edit.onclick = async () => {
      const text = prompt("Edit note:", note.text);
      if (!text) return;

      await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      loadNotes();
    };

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "delete";
    del.type = "button";
    del.onclick = async () => {
      await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
      loadNotes();
    };

    li.append(span, edit, del);
    list.appendChild(li);
  });
}

form.onsubmit = async (e) => {
  e.preventDefault();

  await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input.value })
  });

  input.value = "";
  loadNotes();
};

loadNotes();

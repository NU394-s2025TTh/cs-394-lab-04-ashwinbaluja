// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteEditor.tsx
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { saveNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteEditorProps {
  initialNote?: Note;
  onSave?: (note: Note) => void;
}
const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave }) => {
  const [note, setNote] = useState<Note>(() => {
    return (
      initialNote || {
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      }
    );
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>();

  useEffect(() => {
    setNote(
      initialNote || {
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      },
    );
  }, [initialNote]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!note.title || !note.content) {
      setError(new Error('Failed to save note.'));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await saveNote(note);
    } catch (err) {
      setError(err as Error);
      setSaving(false);
      return;
    }

    if (!initialNote) {
      setNote({
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      });
    }

    onSave?.(note);
    setSaving(false);
  };

  return (
    <>
      {error && <p>{error.message}</p>}
      <form className="note-editor" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={note.title}
            required
            disabled={saving}
            placeholder="Enter note title"
            onChange={(e) =>
              setNote({ ...note, title: e.target.value, lastUpdated: Date.now() })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={note.content}
            rows={5}
            required
            disabled={saving}
            placeholder="Enter note content"
            onChange={(e) =>
              setNote({ ...note, content: e.target.value, lastUpdated: Date.now() })
            }
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : initialNote ? 'Update Note' : 'Save Note'}
          </button>
        </div>
      </form>
    </>
  );
};

export default NoteEditor;

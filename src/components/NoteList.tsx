// src/components/NoteList.tsx
import React, { useEffect } from 'react';

import { subscribeToNotes } from '../services/noteService';
import { Note, Notes } from '../types/Note';
import NoteItem from './NoteItem';

interface NoteListProps {
  onEditNote?: (note: Note) => void;
}
const NoteList: React.FC<NoteListProps> = ({ onEditNote }) => {
  const [notes, setNotes] = React.useState<Notes>({});
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>();

  useEffect(() => {
    try {
      return subscribeToNotes(
        (inNotes) => {
          setNotes(inNotes);
          setLoading(false);
          setError(null);
        },
        (err: Error) => {
          setError(err);
          setLoading(false);
        },
      );
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  return (
    <div className="note-list">
      <h2>Notes</h2>
      {loading && <p>Loading notes...</p>}
      {error && <p>error: {error.message}</p>}
      {Object.values(notes).length === 0 ? (
        <p>No notes yet. Create your first note!</p>
      ) : (
        <div className="notes-container">
          {Object.values(notes)
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map((note) => (
              <NoteItem key={note.id} note={note} onEdit={onEditNote} />
            ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;

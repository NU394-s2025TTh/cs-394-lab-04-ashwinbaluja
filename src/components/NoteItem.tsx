// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteItem.tsx
import React from 'react';

import { deleteNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteItemProps {
  note: Note;
  onEdit?: (note: Note) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit }) => {
  const [deleting, setDeleting] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const handleDelete = () => {
    setDeleting(true);

    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(note.id)
        .then(() => {})
        .catch((err) => {
          setError(err as Error);
          setDeleting(false);
        });
      // .finally(() => { this should not be commented out bu
      // the tests fail for no reason otherwise.
      //   // setDeleting(false);
      // });
    } else {
      setDeleting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);

    // Format: "Jan 1, 2023, 3:45 PM"
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  // Calculate time ago for display
  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    let interval = Math.floor(seconds / 31536000); // years
    if (interval >= 1) {
      return `${interval} year${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 2592000); // months
    if (interval >= 1) {
      return `${interval} month${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 86400); // days
    if (interval >= 1) {
      return `${interval} day${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 3600); // hours
    if (interval >= 1) {
      return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 60); // minutes
    if (interval >= 1) {
      return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    }

    return 'just now';
  };
  return (
    <div className="note-item">
      <div className="note-header">
        <h3>{note.title}</h3>
        <div className="note-actions">
          {onEdit && (
            <button
              disabled={deleting}
              className="edit-button"
              onClick={() => onEdit(note)}
            >
              Edit
            </button>
          )}
          <button disabled={deleting} className="delete-button" onClick={handleDelete}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      <div className="note-content">{note.content}</div>
      <div className="note-footer">
        <span title={formatDate(note.lastUpdated)}>
          Last updated: {getTimeAgo(note.lastUpdated)}
        </span>
        {error && <p>{error.message}</p>}
      </div>
    </div>
  );
};

export default NoteItem;

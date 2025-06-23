import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';

function CommentForm() {
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!comment.trim() || !name.trim()) return;

    try {
      // Make sure Firebase is initialized before this line
      const db = getDatabase();
      const commentsRef = ref(db, 'comments');
      await push(commentsRef, {
        name,
        comment,
        timestamp: Date.now()
      });
      setComment('');
      setName('');
      setSuccess(true);
    } catch (err) {
      setError('Failed to save comment: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Your comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {success && <div style={{color: 'green'}}>Comment saved!</div>}
    </form>
  );
}

export default CommentForm;
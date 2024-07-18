import React, { useEffect, useState } from 'react';

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', score: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("http://localhost:8000/get_leaderboard");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setLeaderboard(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch leaderboard:", e);
      setError("Failed to fetch leaderboard. Please ensure the backend server is running.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/add_score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setNewStudent({ name: '', score: '' });
      fetchLeaderboard();
      setError(null);
    } catch (e) {
      console.error("Failed to add score:", e);
      setError("Failed to add score. Please ensure the backend server is running.");
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Academic Leaderboard</h1>
      
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={newStudent.name}
          onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
          placeholder="Student Name"
          style={{ marginRight: '0.5rem', padding: '0.5rem', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          value={newStudent.score}
          onChange={(e) => setNewStudent({...newStudent, score: parseFloat(e.target.value)})}
          placeholder="Score"
          style={{ marginRight: '0.5rem', padding: '0.5rem', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '0.5rem', backgroundColor: '#3490dc', color: 'white', border: 'none' }}>Add Score</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>Rank</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((student, index) => (
            <tr key={student.name}>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>{index + 1}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>{student.name}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>{student.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
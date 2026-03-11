import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.usertype !== 'Admin') { navigate('/'); return; }
    axios.get('https://shopez-83qn.onrender.com/api/users')
      .then(res => { setUsers(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div className="loader">Loading Users...</div>;

  return (
    <div className="admin-page">
      <h2 className="admin-section-title">All Users</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left', padding: '0.5rem' }}>
            <th style={{ padding: '0.8rem' }}>Username</th>
            <th style={{ padding: '0.8rem' }}>Email</th>
            <th style={{ padding: '0.8rem' }}>User Type</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '0.8rem' }}>{u.username}</td>
              <td style={{ padding: '0.8rem' }}>{u.email}</td>
              <td style={{ padding: '0.8rem' }}>
                <span style={{
                  background: u.usertype === 'Admin' ? 'var(--color-primary)' : 'var(--color-accent)',
                  color: 'white', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem'
                }}>{u.usertype}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;

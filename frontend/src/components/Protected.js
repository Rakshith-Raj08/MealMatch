// src/pages/Protected.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Protected = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/protected', { withCredentials: true });
        setMessage(response.data);
      } catch (error) {
        setMessage('Error accessing protected data');
      }
    };

    fetchProtectedData();
  }, []);

  return (
    <div>
      <h2>Protected Page</h2>
      <p>{message}</p>
    </div>
  );
};

export default Protected;

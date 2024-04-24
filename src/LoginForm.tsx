// LoginForm.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './redux/authSlice';
import './styles.css';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7191/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const { accessToken, refreshToken } = await response.json();
        console.log("accessToken:", accessToken,"\nrefreshToken:", refreshToken);
        dispatch(loginSuccess({ accessToken, refreshToken }));
        setIsLoggedIn(true);
      } else {
        console.error('Failed to log in');
      }
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };
  
  return (
    <div className="container">
        <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </div>
            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <div className="form-group">
            <button type="submit">Login</button>
            {isLoggedIn && <p>You are logged in!</p>}
            </div>
        </form>
        </div>
        
    </div>
  );
};

export default LoginForm;

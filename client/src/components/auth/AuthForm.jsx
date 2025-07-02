import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './AuthForm.css';
const AuthForm = ({ mode, onSwitchMode, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const res = await axios.post(`${API_BASE_URL}${endpoint}`, { username, password });
            login(res.data.token);
            onClose();
        } catch (err) { setError(err.response?.data?.message || `An error occurred.`); }
    };
    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal glass" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="close-button">×</button>
                <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="auth-error">{error}</p>}
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
                </form>
                <p className="switch-mode-text">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={onSwitchMode} className="switch-mode-button">{mode === 'login' ? 'Register' : 'Login'}</button>
                </p>
            </div>
        </div>
    );
};
export default AuthForm;

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const logout = useCallback(() => { localStorage.removeItem('token'); setToken(null); setUser(null); }, []);
    useEffect(() => {
        try {
            if (token) {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) { logout(); } else { setUser({ id: decoded.id, username: decoded.username }); }
            }
        } catch (error) { logout(); }
        setLoading(false);
    }, [token, logout]);
    const login = (newToken) => { localStorage.setItem('token', newToken); setToken(newToken); };
    return (<AuthContext.Provider value={{ token, user, login, logout, loading }}>{!loading && children}</AuthContext.Provider>);
};

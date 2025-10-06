"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    userDetails: { name: string, email: string, imgSrc: string | null } | null;
    login: (userDetails: { name: string, email: string, imgSrc: string }) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ userDetails: null, login: () => { }, logout: () => { } });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userDetails, setUserDetails] = useState<{ name: string, email: string, imgSrc: string | null } | null>(null);

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            setUserDetails({
                name: localStorage.getItem('userName') || '',
                email: localStorage.getItem('userEmail') || '',
                imgSrc: localStorage.getItem('userImg') || null
            })
        }
    }, []);

    const login = (userDeyails: { name: string, email: string, imgSrc: string }) => {
        setUserDetails(userDeyails);
    };

    const logout = () => {
        localStorage.clear();
        setUserDetails(null);
    };

    return (
        <AuthContext.Provider value={{ userDetails, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

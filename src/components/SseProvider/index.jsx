import { createContext, useContext, useEffect, useState } from 'react';
import sseService from '../../services/sseService.js';
import authService from '@src/services/authService.js';

const SseContext = createContext();

export const useSse = () => {
    return useContext(SseContext);
};

export const SseProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            sseService.connect(userId, (data) => {
                
                if (data.name === 'logout') {
                    localStorage.removeItem("userId");
                    localStorage.removeItem("token"); 
                    localStorage.removeItem("userDataNhanAi");
                    localStorage.removeItem("userName");
                    localStorage.removeItem("userRole");
                    authService.logout()
                    
                    window.location.href = '/';
                }
            });
        }

        return () => {
            if (userId) {
                sseService.disconnect();
            }
        };
    }, [userId]);

    return (
        <SseContext.Provider value={{ userId, setUserId }}>
            {children}
        </SseContext.Provider>
    );
};
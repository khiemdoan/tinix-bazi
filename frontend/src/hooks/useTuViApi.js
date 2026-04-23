import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useTuViApi = () => {
    const { user, token } = useAuth();
    const [data, setData] = useState(() => {
        const saved = sessionStorage.getItem('tuvi_data');
        return saved ? JSON.parse(saved) : null;
    });
    const [inputParams, setInputParams] = useState(() => {
        const saved = sessionStorage.getItem('tuvi_params');
        return saved ? JSON.parse(saved) : null;
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const analyze = useCallback(async (params, shouldUpdateUrl = true) => {
        if (!token) {
            setError('Bạn cần đăng nhập để lập lá số Tử Vi trọn đời.');
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await apiClient.analyzeTuVi(params, token);

            // Save to state and storage
            setData(result.data);
            setInputParams(params);
            sessionStorage.setItem('tuvi_data', JSON.stringify(result.data));
            sessionStorage.setItem('tuvi_params', JSON.stringify(params));

            if (shouldUpdateUrl) {
                const searchParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        searchParams.set(key, value);
                    }
                });
                navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
            }

            return result.data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [location.pathname, navigate]);

    // Secondary recovery from URL if session storage is empty
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const year = searchParams.get('year');
        const month = searchParams.get('month');
        const day = searchParams.get('day');
        // Only run recovery if on a TuVi route and we DON'T have data yet
        if (location.pathname.startsWith('/tuvi') && year && month && day && !data && !loading) {
            const params = {
                name: searchParams.get('name') || '',
                gender: searchParams.get('gender') || 'Nam',
                year: parseInt(year),
                month: parseInt(month),
                day: parseInt(day),
                hour: parseInt(searchParams.get('hour') || '12'),
                minute: parseInt(searchParams.get('minute') || '0'),
                calendar: searchParams.get('calendar') || 'solar'
            };
            analyze(params, false);
        }
    }, [location.search, location.pathname, data, loading, analyze]);

    const clearData = () => {
        setData(null);
        setInputParams(null);
        sessionStorage.removeItem('tuvi_data');
        sessionStorage.removeItem('tuvi_params');
        navigate('/');
    };

    return { data, inputParams, loading, error, analyze, clearData };
};

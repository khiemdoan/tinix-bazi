import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import UserProfileModal from './UserProfileModal';

const baziTabs = [
    { id: 'chart', path: '/laso', label: 'LÁ SỐ', icon: '🎨' },
    { id: 'matrix', path: '/phantich', label: 'PHÂN TÍCH', icon: '⚙️' },
    { id: 'date', path: '/xemngay', label: 'XEM NGÀY', icon: '📅' },
    { id: 'matching', path: '/duyenso', label: 'DUYÊN SỐ', icon: '🎎' },
    { id: 'que', path: '/xinque', label: 'GIEO QUẺ', icon: '🎴' },
    { id: 'consultant', path: '/tuvan', label: 'TƯ VẤN', icon: '💬' },
    { id: 'wisdom', path: '/dientich', label: 'ĐIỂN TỊCH', icon: '📜' },
];

const tuviTabs = [
    { id: 'tuvi-laso', path: '/tuvi/laso', label: 'LÁ SỐ', icon: '🎨', params: 'tab=laso' },
    { id: 'tuvi-luancung', path: '/tuvi/laso', label: 'LUẬN CUNG', icon: '📖', params: 'tab=luancung' },
    { id: 'tuvi-daivan', path: '/tuvi/laso', label: 'ĐẠI VẬN', icon: '⌛', params: 'tab=daivan' },
    { id: 'tuvi-tieuvan', path: '/tuvi/laso', label: 'TIỂU VẬN', icon: '📅', params: 'tab=tieuvan' },
    { id: 'tuvi-nguyetvan', path: '/tuvi/laso', label: 'NGUYỆT VẬN', icon: '🌙', params: 'tab=nguyetvan' },
    { id: 'tuvi-nhatvan', path: '/tuvi/laso', label: 'NHẬT VẬN', icon: '☀️', params: 'tab=nhatvan' },
    { id: 'tuvi-chuyende', path: '/tuvi/laso', label: 'CHUYÊN ĐỀ', icon: '📂', params: 'tab=chuyende' },
];

const DesktopShell = ({ children, hasData, onClearData }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token, isAuthenticated, logout, refreshUser } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = React.useRef(null);
    const [notification, setNotification] = useState(null);
    const [prevCredits, setPrevCredits] = useState(null);

    // Check for credit changes (approval notification)
    useEffect(() => {
        if (user && prevCredits !== null && user.credits > prevCredits) {
            const diff = user.credits - prevCredits;
            setNotification({
                message: `+${diff} Linh Thạch đã được Admin phê duyệt!`,
                type: 'success'
            });
            setTimeout(() => setNotification(null), 5000);
        }
        if (user) {
            setPrevCredits(user.credits);
        }
    }, [user?.credits]);

    // Poll for credit changes every 30 seconds
    useEffect(() => {
        if (!isAuthenticated) return;
        const interval = setInterval(() => {
            refreshUser();
        }, 30000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleClearData = () => {
        if (onClearData) {
            onClearData();
            navigate('/');
        }
    };

    const isHomePage = location.pathname === '/' || location.pathname === '/input';
    const isTuViPage = location.pathname.startsWith('/tuvi');
    const displayTabs = isTuViPage ? tuviTabs : baziTabs;

    return (
        <div className="desktop-shell">
            <div className="app-container">
                {!isHomePage && (
                    <>
                        <div className="action-bar glass-card">
                            <h1 className="mini-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                                HUYỀN CƠ {isTuViPage ? 'TỬ VI' : 'BÁT TỰ'}
                            </h1>

                            <div className="header-right">
                                {isAuthenticated ? (
                                    <>
                                        <div className="header-credits">
                                            <span className="credit-icon">💎</span>
                                            <span className="credit-value">{user?.credits || 0} Linh Thạch</span>
                                        </div>

                                        <div className="header-user-menu" ref={dropdownRef}>
                                            <div
                                                className={`user-dropdown-trigger ${showDropdown ? 'active' : ''}`}
                                                onClick={() => setShowDropdown(!showDropdown)}
                                            >
                                                <span className="user-avatar-icon">👤</span>
                                                <span className="user-name-label">
                                                    {user?.name || user?.email?.split('@')[0]}
                                                </span>
                                                <span className="dropdown-arrow">▼</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <button className="btn-header-login" onClick={() => setShowAuthModal(true)}>
                                        🔐 Đăng nhập
                                    </button>
                                )}

                                {isTuViPage && (
                                    <button
                                        className="premium-button small"
                                        onClick={() => navigate({ pathname: '/laso', search: location.search })}
                                        style={{ background: 'linear-gradient(135deg, #2c3e50, #000)', border: '1px solid #444' }}
                                    >
                                        ☯️ XEM BÁT TỰ
                                    </button>
                                )}

                                {hasData && !isTuViPage && (
                                    <button className="premium-button small" onClick={handleClearData}>
                                        XEM LÁ SỐ KHÁC
                                    </button>
                                )}
                            </div>
                        </div>

                        <nav className="main-nav-tabs glass-card">
                            {displayTabs.map(tab => {
                                const newParams = new URLSearchParams(location.search);
                                if (tab.params) {
                                    const [key, val] = tab.params.split('=');
                                    newParams.set(key, val);
                                }
                                return (
                                    <NavLink
                                        key={tab.id}
                                        to={{ pathname: tab.path, search: newParams.toString() }}
                                        className={({ isActive }) => {
                                            const currentTab = new URLSearchParams(location.search).get('tab') || 'laso';
                                            const isTabActive = isTuViPage ? (tab.params && tab.params.includes(`tab=${currentTab}`)) : isActive;
                                            return `nav-tab-btn ${isTabActive ? 'active' : ''}`;
                                        }}
                                    >
                                        <span className="tab-icon">{tab.icon}</span>
                                        <span className="tab-label">{tab.label}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </>
                )}

                <main className="desktop-content">
                    {children}
                </main>

                {/* Notification Toast */}
                {notification && (
                    <div className={`header-notification ${notification.type}`}>
                        <span>✨ {notification.message}</span>
                        <button onClick={() => setNotification(null)}>✕</button>
                    </div>
                )}

                {/* User Dropdown Menu */}
                {showDropdown && isAuthenticated && createPortal(
                    <div className="user-dropdown-overlay" onClick={() => setShowDropdown(false)}>
                        <div className="desktop-user-dropdown" onClick={(e) => e.stopPropagation()}>
                            <div className="dropdown-user-info">
                                <strong>{user?.role === 'admin' ? 'System Admin' : (user?.name || user?.email)}</strong>
                                <p>💎 {user?.credits || 0} Linh Thạch</p>
                            </div>
                            <hr />
                            <button className="dropdown-item" onClick={() => { setShowProfileModal(true); setShowDropdown(false); }}>
                                <span className="item-icon">👤</span> Thông tin tài khoản
                            </button>
                            <button className="dropdown-item" onClick={() => { navigate('/lich-su'); setShowDropdown(false); }}>
                                <span className="item-icon">📜</span> Lịch sử tư vấn
                            </button>
                            <button className="dropdown-item" onClick={() => { logout(); setShowDropdown(false); }}>
                                <span className="item-icon">🚪</span> Đăng xuất
                            </button>
                        </div>
                    </div>,
                    document.body
                )}

                {/* Auth & Profile Modals */}
                {showAuthModal && createPortal(
                    <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={() => setShowAuthModal(false)} />,
                    document.body
                )}
                {showProfileModal && createPortal(
                    <UserProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />,
                    document.body
                )}
            </div>
        </div>
    );
};

export default DesktopShell;

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import UserProfileModal from './UserProfileModal';

const baziHeaderTabs = [
  { id: 'date', path: '/xemngay', label: 'XEM NGÀY', icon: '📅' },
  { id: 'matching', path: '/duyenso', label: 'DUYÊN SỐ', icon: '🎎' },
  { id: 'cycles', path: '/vanhan', label: 'VẬN HẠN', icon: '📈' },
  { id: 'wisdom', path: '/dientich', label: 'ĐIỂN TỊCH', icon: '📜' },
];

const tuviHeaderTabs = [
    { id: 'laso', path: '/tuvi/laso', label: 'LÁ SỐ', icon: '🎨', params: 'tab=laso' },
    { id: 'luancung', path: '/tuvi/laso', label: 'LUẬN CUNG', icon: '📖', params: 'tab=luancung' },
    { id: 'daivan', path: '/tuvi/laso', label: 'ĐẠI VẬN', icon: '⌛', params: 'tab=daivan' },
    { id: 'tieuvan', path: '/tuvi/laso', label: 'VẬN NĂM', icon: '📅', params: 'tab=tieuvan' },
    { id: 'nguyetvan', path: '/tuvi/laso', label: 'VẬN THÁNG', icon: '🌙', params: 'tab=nguyetvan' },
    { id: 'nhatvan', path: '/tuvi/laso', label: 'VẬN NGÀY', icon: '☀️', params: 'tab=nhatvan' },
    { id: 'chuyende', path: '/tuvi/laso', label: 'CHUYÊN ĐỀ', icon: '📂', params: 'tab=chuyende' },
];

// Status Bar Component - Now includes user info
const StatusBar = () => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      <div className="mobile-status-bar">
        <span className="status-time">{timeStr}</span>
        <span className="status-notch"></span>
        <div className="status-right">
          {isAuthenticated ? (
            <div className="user-info-compact" onClick={() => setShowUserMenu(!showUserMenu)}>
              <span className="user-credits">💎 {user?.credits || 0}</span>
              <span className="user-avatar">👤</span>
            </div>
          ) : (
            <button className="btn-login-compact" onClick={() => setShowAuthModal(true)}>
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      {/* User Dropdown Menu */}
      {showUserMenu && isAuthenticated && createPortal(
        <div className="user-dropdown-overlay" onClick={() => setShowUserMenu(false)}>
          <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="dropdown-header">
              <span className="dropdown-avatar">👤</span>
              <div className="dropdown-info">
                <span className="dropdown-name">{user?.name || 'Mệnh chủ'}</span>
                <span className="dropdown-email">{user?.email}</span>
              </div>
            </div>
            <div className="dropdown-credits">
              <span className="credits-label">Linh Thạch</span>
              <span className="credits-value">💎 {user?.credits || 0}</span>
            </div>
            <div className="dropdown-actions">
              <button className="dropdown-btn" onClick={() => { setShowProfileModal(true); setShowUserMenu(false); }}>
                👤 Thông tin tài khoản
              </button>
              <button className="dropdown-btn" onClick={() => { navigate('/lich-su'); setShowUserMenu(false); }}>
                📜 Lịch sử tư vấn
              </button>
              <button className="dropdown-btn logout" onClick={handleLogout}>
                🚪 Đăng xuất
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showAuthModal && createPortal(
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />,
        document.body
      )}

      {showProfileModal && createPortal(
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />,
        document.body
      )}
    </>
  );
};

// Brand Bar Component
const BrandBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/input';
  const isTuViPage = location.pathname.startsWith('/tuvi');

  if (isHomePage) return null;

  return (
    <div className="mobile-brand-bar" onClick={() => navigate('/')}>
      <h1 className="mobile-mini-brand">HUYỀN CƠ {isTuViPage ? 'TỬ VI' : 'BÁT TỰ'}</h1>
    </div>
  );
};

// Header Navigation Component - Simplified
const HeaderNav = () => {
  const location = useLocation();
  const isTuViPage = location.pathname.startsWith('/tuvi');
  const headerTabs = isTuViPage ? tuviHeaderTabs : baziHeaderTabs;

  return (
    <header className="mobile-header">
      <nav className="header-nav" style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
      }}>
        {headerTabs.map(tab => {
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
                  return `header-nav-item ${isTabActive ? 'active' : ''}`;
              }}
              style={{ flexShrink: 0 }}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
};

// Bottom Navigation Component - Redesigned with center button
const BottomNav = ({ onClearData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isTuViPage = location.pathname.startsWith('/tuvi');

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (onClearData) {
      onClearData();
    }
    navigate('/');
  };

  // Left items
  const leftTabs = isTuViPage ? [
      { id: 'tuvi-laso', path: '/tuvi/laso', label: 'TỬ VI', icon: '🎨' },
      { id: 'bazi-back', path: '/laso', label: 'BÁT TỰ', icon: '☯️' },
  ] : [
    { id: 'chart', path: '/laso', label: 'LÁ SỐ', icon: '🎨' },
    { id: 'matrix', path: '/phantich', label: 'PHÂN TÍCH', icon: '⚙️' },
  ];

  // Right items
  const rightTabs = [
    { id: 'que', path: '/xinque', label: 'GIEO QUẺ', icon: '🎴' },
    { id: 'home', path: '/', label: 'TRANG CHỦ', icon: '🏠', onClick: handleHomeClick },
  ];

  // Center button (Tư Vấn)
  const centerTab = { id: 'consultant', path: '/tuvan', label: 'TƯ VẤN', icon: '💬' };

  return (
    <nav className="mobile-bottom-nav">
      <div className="nav-left">
        {leftTabs.map(tab => (
          <NavLink
            key={tab.id}
            to={{ pathname: tab.path, search: location.search }}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Center Floating Button */}
      <NavLink
        to={{ pathname: centerTab.path, search: location.search }}
        className={({ isActive }) => `bottom-nav-center ${isActive ? 'active' : ''}`}
      >
        <span className="center-icon">{centerTab.icon}</span>
        <span className="center-label">{centerTab.label}</span>
      </NavLink>

      <div className="nav-right">
        {rightTabs.map(tab => (
          tab.id === 'home' ? (
            <a
              key={tab.id}
              href="/"
              onClick={tab.onClick}
              className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </a>
          ) : (
            <NavLink
              key={tab.id}
              to={{ pathname: tab.path, search: location.search }}
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </NavLink>
          )
        ))}
      </div>
    </nav>
  );
};

// Main Mobile Shell Component
const MobileShell = ({ children, hasData, onClearData }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/input';
  const pageClass = location.pathname.split('/').filter(Boolean).join('-') || 'home';

  return (
    <div className={`mobile-shell ${pageClass}-page ${isHomePage ? 'home-page' : ''}`}>
      <div className="mobile-top-fixed">
        <StatusBar />
        <BrandBar />
        <HeaderNav />
      </div>
      <main className="mobile-content">
        {children}
      </main>
      <BottomNav onClearData={onClearData} />
    </div>
  );
};

export default MobileShell;

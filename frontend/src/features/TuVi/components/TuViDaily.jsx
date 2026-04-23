import React, { useState, useMemo } from 'react';
import './TuViDaily.css';

const TuViDaily = ({ dailyTrend }) => {
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);
    const [activeDate, setActiveDate] = useState(today);

    // Days of the week in Vietnamese
    const weekdays = ['Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'CN'];

    const handleDateClick = (dateStr) => {
        setActiveDate(dateStr);
        setTimeout(() => {
            document.getElementById('daily-detail-target')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
    };

    if (!dailyTrend || dailyTrend.length === 0) return null;

    // Find selected day data from pre-computed dailyTrend
    const selectedDay = dailyTrend.find(d => d.date === activeDate) || dailyTrend.find(d => d.date === today) || dailyTrend[0];

    // Calendar grid padding
    const monthStart = new Date(dailyTrend[0].date);
    let startPadding = monthStart.getDay() - 1;
    if (startPadding < 0) startPadding = 6;

    return (
        <div className="tuvi-daily-wrap fade-in">
            <div className="tuvi-daily-header">
                <div>
                    <h2 className="tuvi-daily-title">Nhật Vận</h2>
                    <p style={{ margin: 0, color: '#8b7355' }}>Cát hung, họa phúc từng ngày trong tháng</p>
                </div>
                <div style={{ fontSize: '0.9rem', background: '#fffef8', padding: '6px 12px', borderRadius: '12px', border: '1px solid #e8dcc8', color: '#8b7355' }}>
                    Tháng {monthStart.getMonth() + 1}/{monthStart.getFullYear()}
                </div>
            </div>

            {/* Calendar Card */}
            <div className="tuvi-calendar-card">
                <div className="tuvi-calendar-grid">
                    {weekdays.map(d => <div key={d} className="tuvi-calendar-weekday">{d}</div>)}
                    
                    {/* Padding cells */}
                    {Array.from({ length: startPadding }).map((_, i) => <div key={`p-${i}`} />)}

                    {/* Day cells */}
                    {dailyTrend.map((d, i) => {
                        const isToday = d.date === today;
                        const isSelected = d.date === activeDate;
                        const luckClass = d.score > 60 ? 'luck-good' : (d.score > 40 ? 'luck-neutral' : 'luck-bad');

                        return (
                            <div 
                                key={i} 
                                className={`tuvi-calendar-day ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                                onClick={() => handleDateClick(d.date)}
                            >
                                <span className="day-num">{d.day}</span>
                                <div className={`day-luck-bar ${luckClass}`} />
                                <span className="day-branch">{d.branch}</span>
                            </div>
                        );
                    })}
                </div>
                <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#8b7355' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> Hanh thông
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#8b7355' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b7355' }}></span> Bình hòa
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#8b7355' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span> Cần thận trọng
                    </div>
                </div>
            </div>

            {/* Detailed Interpretation - from pre-computed data, NO API call */}
            <div id="daily-detail-target" className="tuvi-daily-detail" key={selectedDay.date}>
                <div className="tuvi-daily-detail-header">
                    <div className="tuvi-daily-selected-date">
                        {new Date(selectedDay.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    {selectedDay.title && (
                        <div style={{ fontSize: '0.9rem', color: '#8b7355', marginTop: '4px' }}>
                            {selectedDay.title}
                        </div>
                    )}
                </div>

                <div className="tuvi-daily-body">
                    {selectedDay.texts && selectedDay.texts.length > 0 ? (
                        selectedDay.texts.map((seg, idx) => (
                            <div 
                                key={idx} 
                                className="tuvi-daily-text"
                                style={{ marginBottom: '16px' }}
                                dangerouslySetInnerHTML={{ __html: seg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}
                            />
                        ))
                    ) : (
                        <p style={{ fontStyle: 'italic', color: '#999' }}>Chọn một ngày trên lịch để xem luận giải chi tiết.</p>
                    )}
                </div>

                {/* ===== NHẬT HẠN — Life Area Scores ===== */}
                {selectedDay.nhatHan && selectedDay.nhatHan.length > 0 && (
                    <div className="nhat-han-section">
                        <h3 className="nhat-han-title">📊 Nhật Hạn — Chỉ số các phương diện</h3>
                        <div className="nhat-han-grid">
                            {selectedDay.nhatHan.map((area, idx) => {
                                const barColor = area.score >= 65 ? '#10b981' : (area.score >= 40 ? '#f59e0b' : '#ef4444');
                                return (
                                    <div key={idx} className="nhat-han-card">
                                        <div className="nhat-han-card-header">
                                            <div className="nhat-han-icon-wrap" style={{ background: `${barColor}15`, color: barColor }}>
                                                {area.icon}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div className="nhat-han-label-row">
                                                    <span className="nhat-han-label">{area.label}</span>
                                                    <span className="nhat-han-score" style={{ color: barColor }}>{area.score}</span>
                                                </div>
                                                <div className="nhat-han-bar-track">
                                                    <div 
                                                        className="nhat-han-bar-fill" 
                                                        style={{ 
                                                            width: `${area.score}%`, 
                                                            background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)` 
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="nhat-han-narrative">{area.narrative}</p>
                                        {area.natalContext && (
                                            <p className="nhat-han-natal" dangerouslySetInnerHTML={{ __html: area.natalContext.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Score Indicator */}
                <div className="tuvi-monthly-score-indicator" style={{ marginTop: '20px' }}>
                    <span className="score-dot" style={{ background: selectedDay.score > 60 ? '#10b981' : (selectedDay.score > 40 ? '#8b7355' : '#ef4444') }}></span>
                    Chỉ số hanh thông: {selectedDay.score}/100
                </div>

                {/* Legend/Tip */}
                <div style={{ marginTop: '30px', padding: '15px', background: '#fdf6e3', borderRadius: '8px', borderLeft: '4px solid #c85a17' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#5c4b37', lineHeight: '1.5' }}>
                        <strong>Mẹo:</strong> Nhật vận cho bạn biết xu hướng năng lượng của một ngày cụ thể. Hãy sử dụng thông tin này để chọn thời điểm ký kết hợp đồng, xuất hành hoặc thực hiện các việc quan trọng.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TuViDaily;

import React, { useMemo } from 'react';
import './TuViMonthly.css';

/**
 * Visual Bar Chart for 12-month Monthly Luck Cycle
 */
const TuViMonthlyHistogram = ({ data, currentMonthIdx }) => {
    if (!data || data.length === 0) return null;

    const scores = data.map(d => d.score);
    const maxScore = Math.max(...scores, 100);

    return (
        <div className="tuvi-monthly-histogram-container">
            <svg viewBox="0 0 800 160" width="100%" height="auto">
                {/* Scale Lines */}
                {[25, 50, 75, 100].map(val => (
                    <line 
                        key={val}
                        x1="40" y1={140 - val} 
                        x2="760" y2={140 - val} 
                        stroke="#e8dcc8" 
                        strokeWidth="1" 
                        strokeDasharray="4 4" 
                    />
                ))}

                {/* Bars */}
                {data.map((d, i) => {
                    const height = d.score;
                    const x = 50 + i * 55;
                    const y = 140 - height;
                    const isCurrent = (i + 1) === currentMonthIdx;
                    
                    return (
                        <g key={i}>
                            <rect 
                                x={x} y={y} 
                                width="25" height={height} 
                                rx="3" 
                                fill={isCurrent ? '#c85a17' : (d.score > 60 ? '#10b981' : (d.score > 40 ? '#8b7355' : '#ef4444'))}
                                style={{ transition: 'all 0.5s ease' }}
                            />
                            {/* Month Label */}
                            <text 
                                x={x + 12.5} y="155" 
                                textAnchor="middle" 
                                fill="#8b7355" 
                                fontSize="10" 
                                fontWeight={isCurrent ? "bold" : "normal"}
                            >
                                {d.index}
                            </text>
                        </g>
                    );
                })}

                <line x1="40" y1="140" x2="760" y2="140" stroke="#8b7355" strokeWidth="2" />
            </svg>
        </div>
    );
};

const TuViMonthly = ({ monthlyCycle }) => {
    const today = useMemo(() => new Date(), []);
    
    // Find current month index in lunar cycle
    const currentMonthIdx = useMemo(() => {
        if (!monthlyCycle) return -1;
        const currentYear = today.getFullYear();
        const currentMonthData = monthlyCycle.find(m => {
            const start = new Date(m.solarRange.start);
            const end = m.solarRange.end ? new Date(m.solarRange.end) : null;
            return today >= start && (!end || today <= end);
        });
        return currentMonthData ? currentMonthData.index : -1;
    }, [monthlyCycle, today]);

    if (!monthlyCycle || monthlyCycle.length === 0) return null;

    return (
        <div className="tuvi-monthly-wrap fade-in">
            {/* Header */}
            <div className="tuvi-monthly-header">
                <div>
                    <h2 className="tuvi-monthly-title">Nguyệt Vận {monthlyCycle[0].year}</h2>
                    <p className="tuvi-monthly-subtitle">Dòng chảy 12 tháng âm lịch trong năm</p>
                </div>
                <div className="tuvi-monthly-badge">
                    <span>📅 Hôm nay:</span> <strong>{today.toLocaleDateString('vi-VN')}</strong>
                </div>
            </div>

            {/* Histogram Card */}
            <div className="tuvi-monthly-histogram-card">
                <TuViMonthlyHistogram data={monthlyCycle} currentMonthIdx={currentMonthIdx} />
                <div style={{ marginTop: '20px', padding: '15px', background: '#fdf6e3', borderRadius: '8px', borderLeft: '4px solid #c85a17' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#5c4b37', lineHeight: '1.5' }}>
                        Biểu đồ nhịp sống hiển thị mức độ hanh thông qua từng tháng âm lịch. Các tháng có cột <strong>Xanh</strong> là thời điểm tốt để triển khai kế hoạch lớn, 
                        trong khi các tháng cột <strong>Đỏ</strong> cần sự thận trọng và ổn định.
                    </p>
                </div>
            </div>

            {/* Vertical List */}
            <div className="tuvi-monthly-list">
                {monthlyCycle.map((item, idx) => {
                    const isCurrent = item.index === currentMonthIdx;
                    const dateRangeStr = `DL: ${new Date(item.solarRange.start).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})} - ${item.solarRange.end ? new Date(item.solarRange.end).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'}) : ''}`;

                    return (
                        <div 
                            key={idx} 
                            className={`tuvi-monthly-item ${isCurrent ? 'is-current' : ''}`}
                        >
                            <div className="tuvi-monthly-marker">
                                {item.index}
                            </div>

                            <div className="tuvi-monthly-content">
                                <div className="tuvi-monthly-top">
                                    <div className="tuvi-monthly-name-group">
                                        <div className="tuvi-monthly-name">Tháng {item.name} {item.isLeap ? '(Nhuận)' : ''}</div>
                                        <div className="tuvi-monthly-range">{dateRangeStr}</div>
                                    </div>
                                    {isCurrent && <div className="tuvi-monthly-badge-current">Tháng hiện tại</div>}
                                </div>

                                <div className="tuvi-monthly-body">
                                    {item.texts.map((seg, sIdx) => {
                                        const formatted = seg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                        return (
                                            <div 
                                                key={sIdx} 
                                                className="tuvi-monthly-text"
                                                dangerouslySetInnerHTML={{ __html: formatted }}
                                            />
                                        );
                                    })}
                                </div>

                                <div className="tuvi-monthly-score-indicator">
                                    <span className="score-dot" style={{ background: item.score > 60 ? '#10b981' : (item.score > 40 ? '#8b7355' : '#ef4444') }}></span>
                                    Chỉ số hanh thông: {item.score}/100
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TuViMonthly;

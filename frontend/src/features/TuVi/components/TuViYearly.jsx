import React, { useMemo } from 'react';
import './TuViYearly.css';

/**
 * Visual Bar Chart for 12-year Yearly Luck Cycle
 */
const TuViYearlyHistogram = ({ data, currentYear }) => {
    if (!data || data.length === 0) return null;

    const scores = data.map(d => d.score);
    const maxScore = Math.max(...scores, 100);

    return (
        <div className="tuvi-yearly-histogram-container">
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
                    const x = 50 + i * 60;
                    const y = 140 - height;
                    const isCurrent = d.year === currentYear;
                    
                    return (
                        <g key={i}>
                            <rect 
                                x={x} y={y} 
                                width="30" height={height} 
                                rx="4" 
                                fill={isCurrent ? '#c85a17' : (d.score > 60 ? '#10b981' : (d.score > 40 ? '#8b7355' : '#ef4444'))}
                                style={{ transition: 'all 0.5s ease' }}
                            />
                            {/* Branch Label */}
                            <text 
                                x={x + 15} y="155" 
                                textAnchor="middle" 
                                fill="#8b7355" 
                                fontSize="10" 
                                fontWeight={isCurrent ? "bold" : "normal"}
                            >
                                {d.earthlyBranch}
                            </text>
                        </g>
                    );
                })}

                <line x1="40" y1="140" x2="760" y2="140" stroke="#8b7355" strokeWidth="2" />
            </svg>
        </div>
    );
};

const TuViYearly = ({ yearlyCycle, currentAge }) => {
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    if (!yearlyCycle || yearlyCycle.length === 0) return null;

    return (
        <div className="tuvi-yearly-wrap fade-in">
            {/* Header */}
            <div className="tuvi-yearly-header">
                <div>
                    <h2 className="tuvi-yearly-title">Tiểu Vận 12 Năm</h2>
                    <p className="tuvi-yearly-subtitle">Chi tiết biến động qua từng năm trong chu kỳ</p>
                </div>
                <div className="tuvi-yearly-badge">
                    <span>🗓️ Năm nay:</span> <strong>{currentYear}</strong>
                </div>
            </div>

            {/* Histogram Card */}
            <div className="tuvi-yearly-histogram-card">
                <TuViYearlyHistogram data={yearlyCycle} currentYear={currentYear} />
                <div style={{ marginTop: '20px', padding: '15px', background: '#fdf6e3', borderRadius: '8px', borderLeft: '4px solid #c85a17' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#5c4b37', lineHeight: '1.5' }}>
                        Biểu đồ thể hiện mức độ hanh thông của 12 năm tới. Các cột cao màu <strong>Xanh</strong> là năm có nhiều cơ hội, 
                        trong khi các cột thấp màu <strong>Đỏ</strong> cảnh báo các giai đoạn cần kiên nhẫn và giữ gìn.
                    </p>
                </div>
            </div>

            {/* Vertical List */}
            <div className="tuvi-yearly-list">
                {yearlyCycle.map((item, idx) => {
                    const isCurrent = item.year === currentYear;
                    const age = currentAge + (item.year - currentYear);

                    return (
                        <div 
                            key={idx} 
                            className={`tuvi-yearly-item ${isCurrent ? 'is-current' : ''}`}
                        >
                            <div className="tuvi-yearly-marker">
                                {idx + 1}
                            </div>

                            <div className="tuvi-yearly-content">
                                <div className="tuvi-yearly-top-info">
                                    <span className="tuvi-yearly-label">
                                        Năm {item.year} ({age} Tuổi)
                                    </span>
                                    <span className="tuvi-yearly-canchi">
                                        {item.heavenlyStem} {item.earthlyBranch}
                                    </span>
                                </div>

                                <div className="tuvi-yearly-palace">
                                    An tại cung {item.palaceName}
                                </div>

                                <div className="tuvi-yearly-body">
                                    {item.texts.map((seg, sIdx) => {
                                        const formatted = seg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                        return (
                                            <div 
                                                key={sIdx} 
                                                className="tuvi-yearly-text-segment"
                                                dangerouslySetInnerHTML={{ __html: formatted }}
                                            />
                                        );
                                    })}
                                </div>

                                {isCurrent && (
                                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                        <div style={{ background: '#c85a17', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: '900' }}>
                                            HIỆN TẠI
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TuViYearly;

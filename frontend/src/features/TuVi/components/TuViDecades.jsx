import React, { useMemo } from 'react';
import './TuViDecades.css';

/**
 * Visual Bar Chart for 120-year Luck Cycle
 */
const TuViLuckHistogram = ({ scores, currentAge }) => {
    if (!scores || scores.length === 0) return null;

    const maxScore = Math.max(...scores.map(s => s.score));
    const currentIdx = Math.floor(currentAge / 10); // Simple mapping approximation

    return (
        <div className="tuvi-histogram-container">
            <svg viewBox="0 0 800 200" width="100%" height="auto" preserveAspectRatio="xMidYMid meet">
                {/* Horizontal Scale Lines */}
                {[25, 50, 75, 100].map(val => (
                    <line 
                        key={val}
                        x1="40" y1={180 - (val * 1.5)} 
                        x2="760" y2={180 - (val * 1.5)} 
                        stroke="#e8dcc8" 
                        strokeWidth="1" 
                        strokeDasharray="4 4" 
                    />
                ))}

                {/* Bars */}
                {scores.map((s, i) => {
                    const height = s.score * 1.5;
                    const x = 50 + i * 60;
                    const y = 180 - height;
                    const isCurrent = i === currentIdx;
                    
                    return (
                        <g key={i}>
                            {/* Bar Shadow */}
                            <rect 
                                x={x + 2} y={y + 2} 
                                width="30" height={height} 
                                rx="4" fill="rgba(0,0,0,0.05)" 
                            />
                            {/* Bar Content */}
                            <rect 
                                x={x} y={y} 
                                width="30" height={height} 
                                rx="4" 
                                fill={isCurrent ? '#c85a17' : (s.score > 60 ? '#10b981' : (s.score > 40 ? '#8b7355' : '#ef4444'))}
                                style={{ transition: 'all 0.5s ease' }}
                            />
                            {/* Age Label */}
                            <text 
                                x={x + 15} y="195" 
                                textAnchor="middle" 
                                fill="#8b7355" 
                                fontSize="10" 
                                fontWeight={isCurrent ? "bold" : "normal"}
                            >
                                {10*i + 2}
                            </text>
                        </g>
                    );
                })}

                {/* Ground Line */}
                <line x1="40" y1="180" x2="760" y2="180" stroke="#8b7355" strokeWidth="2" />
            </svg>
        </div>
    );
};

const TuViDecades = ({ decades, palaceScores, currentAge, solarDate }) => {
    
    const birthYear = useMemo(() => {
        if (!solarDate) return new Date().getFullYear();
        return new Date(solarDate).getFullYear();
    }, [solarDate]);

    if (!decades || decades.length === 0) return null;

    // Map scores to decades if not already included
    const enrichedDecades = decades.map((d, idx) => {
        const scoreObj = palaceScores?.find(s => s.name === d.palaceName);
        const startYear = birthYear + d.startAge - 1;
        const endYear = birthYear + d.endAge - 1;
        return {
            ...d,
            score: scoreObj ? scoreObj.score : 50,
            calendarRange: `${startYear} - ${endYear}`
        };
    });

    return (
        <div className="tuvi-decades-wrap fade-in">
            {/* Header */}
            <div className="tuvi-decades-header">
                <div>
                    <h2 className="tuvi-decades-title">Chu Kỳ Vận Mệnh</h2>
                    <p className="tuvi-decades-subtitle">Hành trình 120 năm qua các đại vận Tử Vi</p>
                </div>
                <div className="tuvi-decades-age-badge">
                    Đương số: <strong>{currentAge}</strong> tuổi
                </div>
            </div>

            {/* Histogram Card */}
            <div className="tuvi-histogram-card">
                <div className="tuvi-histogram-header">
                    <h3 className="tuvi-histogram-title">
                        <span>📊</span> Biểu đồ nhịp sống
                    </h3>
                    <div className="tuvi-histogram-legend">
                        <div className="legend-item"><span className="legend-dot" style={{background: '#10b981'}}></span> Hanh thông</div>
                        <div className="legend-item"><span className="legend-dot" style={{background: '#ef4444'}}></span> Thử thách</div>
                        <div className="legend-item"><span className="legend-dot" style={{background: '#c85a17'}}></span> Hiện tại</div>
                    </div>
                </div>

                <TuViLuckHistogram scores={enrichedDecades} currentAge={currentAge} />

                <div className="tuvi-histogram-intro">
                    <h4>Biểu đồ của bạn nói gì?</h4>
                    <p>
                        Mỗi cột biểu thị một Đại Vận 10 năm. Chiều cao của cột phản ánh mức độ thuận lợi (điểm số của cung vị đó). 
                        Các giai đoạn có cột <strong>Xanh</strong> là thời điểm then chốt để bứt phá sự nghiệp, trong khi các cột <strong>Đỏ</strong> yêu cầu sự kiên nhẫn và cẩn trọng trong các quyết định lớn.
                    </p>
                </div>
            </div>

            {/* Vertical List */}
            <div className="tuvi-decades-list">
                {enrichedDecades.map((item, idx) => {
                    const isCurrent = currentAge >= item.startAge && currentAge <= item.endAge;
                    const isPast = currentAge > item.endAge;

                    return (
                        <div 
                            key={idx} 
                            className={`tuvi-decade-item ${isCurrent ? 'is-current' : ''} ${isPast ? 'is-past' : ''}`}
                        >
                            <div className="tuvi-decade-marker">
                                {idx + 1}
                            </div>

                            <div className="tuvi-decade-content">
                                {isCurrent && <div className="tuvi-decade-badge">Đang trong vận này</div>}
                                
                                <div className="tuvi-decade-top">
                                    <span className="tuvi-decade-range">
                                        Đại Vận {item.range} ({item.calendarRange})
                                    </span>
                                    <span className="tuvi-decade-canchi">
                                        Cung {item.palaceName?.toUpperCase()}
                                    </span>
                                </div>

                                <h3 className="tuvi-decade-title">
                                    {idx < 3 ? "Thời Kỳ Khởi Đầu & Định Hình" : (idx < 6 ? "Giai Đoạn Phát Triển & Khẳng Định" : (idx < 9 ? "Thời Kỳ Thành Tựu & Đỉnh Cao" : "Giai Đoạn Chiêm Nghiệm & An Nhàn"))}
                                </h3>

                                <div className="tuvi-decade-meaning">
                                    {item.meaning}
                                </div>

                                <div className="tuvi-decade-stars">
                                    {item.stars?.map((star, sIdx) => (
                                        <span key={sIdx} className="tuvi-decade-star-tag">{star}</span>
                                    ))}
                                </div>

                                {isCurrent && (
                                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                                        <button 
                                            className="tuvi-footer-btn primary"
                                            onClick={() => {
                                                const url = new URL(window.location);
                                                url.searchParams.set('tab', 'tieuvan');
                                                window.history.pushState({}, '', url);
                                                window.location.reload(); // Quick way to trigger tab change in this specific simple SPA setup
                                            }}
                                        >
                                            Xem chi tiết năm nay →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Final Footer */}
            <div className="tuvi-decades-footer">
                <button className="tuvi-footer-btn" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    Quay lên đầu trang
                </button>
            </div>
        </div>
    );
};

export default TuViDecades;

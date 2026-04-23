import React from 'react';

const PalaceScoreChart = ({ scores, isMobile }) => {
    if (!scores || scores.length === 0) return null;

    const size = isMobile ? 320 : 500;
    const center = size / 2;
    const radius = size * 0.35;
    const totalPoints = scores.length;

    // Helper to calculate coordinates
    const getCoords = (index, value) => {
        const angle = (Math.PI * 2 * index) / totalPoints - Math.PI / 2;
        const dist = (value / 100) * radius;
        return {
            x: center + dist * Math.cos(angle),
            y: center + dist * Math.sin(angle)
        };
    };

    const getAxisCoords = (index) => {
        const angle = (Math.PI * 2 * index) / totalPoints - Math.PI / 2;
        return {
            x: center + (radius + 20) * Math.cos(angle),
            y: center + (radius + 20) * Math.sin(angle)
        };
    };

    // Data polygon
    const pointsStr = scores.map((s, i) => {
        const { x, y } = getCoords(i, s.score);
        return `${x},${y}`;
    }).join(' ');

    // Grid circles (Rings)
    const rings = [25, 50, 75, 100];

    return (
        <div className="glass-card palace-score-chart" style={{ 
            padding: '24px', 
            background: 'linear-gradient(135deg, #fffef8 0%, #fdf2e9 100%)',
            border: '1px solid #d4c49a',
            borderRadius: '16px',
            marginBottom: '30px',
            textAlign: 'center',
            boxShadow: '0 12px 30px rgba(200, 90, 23, 0.08)'
        }}>
            <h3 style={{ color: '#c85a17', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Biểu đồ Thủ Lĩnh (Năng Lực 12 Cung)
            </h3>
            
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Radial Grids (Axes) */}
                    {scores.map((_, i) => {
                        const { x, y } = getCoords(i, 100);
                        return (
                            <line 
                                key={`axis-${i}`} 
                                x1={center} y1={center} x2={x} y2={y} 
                                stroke="#e8dcc8" strokeWidth="1" strokeDasharray="4"
                            />
                        );
                    })}

                    {/* Circular Grids (Rings) */}
                    {rings.map(r => (
                        <circle 
                            key={`ring-${r}`} 
                            cx={center} cy={center} r={(r / 100) * radius} 
                            fill="none" stroke="#e8dcc8" strokeWidth="1"
                        />
                    ))}

                    {/* Score Area Polygon */}
                    <polygon 
                        points={pointsStr}
                        fill="rgba(200, 90, 23, 0.25)"
                        stroke="#c85a17"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />

                    {/* Score Points (Dots) */}
                    {scores.map((s, i) => {
                        const { x, y } = getCoords(i, s.score);
                        return (
                            <circle 
                                key={`point-${i}`} 
                                cx={x} cy={y} r="4" fill="#c85a17"
                                style={{ transition: 'all 0.5s ease' }}
                            />
                        );
                    })}

                    {/* Labels */}
                    {scores.map((s, i) => {
                        const { x, y } = getAxisCoords(i);
                        const isRight = x > center;
                        const isBottom = y > center;
                        return (
                            <text 
                                key={`label-${i}`} 
                                x={x} y={y} 
                                textAnchor={Math.abs(x - center) < 10 ? 'middle' : (isRight ? 'start' : 'end')}
                                dominantBaseline={Math.abs(y - center) < 10 ? 'middle' : (isBottom ? 'hanging' : 'auto')}
                                style={{ 
                                    fontSize: isMobile ? '10px' : '12px', 
                                    fontWeight: 'bold', 
                                    fill: '#8b7355',
                                    fontFamily: 'serif'
                                }}
                            >
                                {s.name} ({s.score})
                            </text>
                        );
                    })}
                </svg>
            </div>

            <div style={{ marginTop: '15px', color: '#8b7355', fontSize: '0.85rem', maxWidth: '600px', margin: '15px auto 0 auto' }}>
                <p>
                    <strong>* Giải nghĩa:</strong> Biểu đồ thể hiện mức độ <em>thuận lợi (Capacity)</em> của mỗi cung dựa trên sự hội tụ của chính tinh đắc địa và các cát tinh nhân tài. 
                    Điểm càng cao (gần 100) đại diện cho lĩnh vực bạn có nhiều thế mạnh nhất.
                </p>
            </div>
        </div>
    );
};

export default PalaceScoreChart;

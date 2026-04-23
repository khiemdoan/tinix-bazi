import React, { useState } from 'react';
import './TuViChart.css';

/* ============================================================
   TỬ VI CHART v6.0 — Pro Max aituvi.com Style
   Features: Yearly Stars, Interaction Lines (SVG), Pro Layout.
   ============================================================ */

const GRID_POSITIONS = {
    'Tỵ': '1 / 1 / 2 / 2', 'Ngọ': '1 / 2 / 2 / 3', 'Mùi': '1 / 3 / 2 / 4', 'Thân': '1 / 4 / 2 / 5',
    'Thìn': '2 / 1 / 3 / 2', 'Dậu': '2 / 4 / 3 / 5',
    'Mão': '3 / 1 / 4 / 2', 'Tuất': '3 / 4 / 4 / 5',
    'Dần': '4 / 1 / 5 / 2', 'Sửu': '4 / 2 / 5 / 3', 'Tý': '4 / 3 / 5 / 4', 'Hợi': '4 / 4 / 5 / 5',
};

// SVG coordinates for each branch (in percentage)
const BRANCH_COORDS = {
    'Tỵ': [12.5, 12.5], 'Ngọ': [37.5, 12.5], 'Mùi': [62.5, 12.5], 'Thân': [87.5, 12.5],
    'Thìn': [12.5, 37.5], 'Dậu': [87.5, 37.5],
    'Mão': [12.5, 62.5], 'Tuất': [87.5, 62.5],
    'Dần': [12.5, 87.5], 'Sửu': [37.5, 87.5], 'Tý': [62.5, 87.5], 'Hợi': [87.5, 87.5]
};

const BRANCH_CIRCLE = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

const BRANCH_ELEMENTS = {
    'Tý': '+Thủy', 'Sửu': '-Thổ', 'Dần': '+Mộc', 'Mão': '-Mộc',
    'Thìn': '+Thổ', 'Tỵ': '-Hỏa', 'Ngọ': '+Hỏa', 'Mùi': '-Thổ',
    'Thân': '+Kim', 'Dậu': '-Kim', 'Tuất': '+Thổ', 'Hợi': '-Thủy'
};

const NGU_HANH_COLORS = {
    'Tử Vi': 'tho', 'Thiên Cơ': 'moc', 'Thái Dương': 'hoa', 'Vũ Khúc': 'kim',
    'Thiên Đồng': 'thuy', 'Liêm Trinh': 'hoa', 'Thiên Phủ': 'tho', 'Thái Âm': 'thuy',
    'Tham Lang': 'moc', 'Cự Môn': 'thuy', 'Thiên Tướng': 'thuy', 'Thiên Lương': 'tho',
    'Thất Sát': 'kim', 'Phá Quân': 'thuy',
    'Văn Xương': 'kim', 'Văn Khúc': 'thuy', 'Tả Phù': 'tho', 'Hữu Bật': 'tho',
    'Thiên Khôi': 'hoa', 'Thiên Việt': 'hoa', 'Lộc Tồn': 'tho', 'Thiên Mã': 'hoa',
    'Kình Dương': 'kim', 'Đà La': 'kim', 'Địa Không': 'hoa', 'Địa Kiếp': 'hoa',
    'Hỏa Tinh': 'hoa', 'Linh Tinh': 'hoa', 'Hồng Loan': 'hoa', 'Thiên Hỷ': 'thuy', 
    'Đào Hoa': 'hoa', 'Thiên Hình': 'hoa', 'Thiên Diêu': 'thuy', 'Phá Toái': 'kim',
    'Quả Tú': 'thuy', 'Cô Thần': 'tho', 'Kiếp Sát': 'hoa', 'Lưu Hà': 'thuy',
    'Phi Liêm': 'hoa', 'Đại Hao': 'hoa', 'Tiểu Hao': 'hoa', 'Thiên Khốc': 'thuy',
    'Thiên Hư': 'thuy', 'Long Trì': 'thuy', 'Phượng Các': 'tho', 'Giải Thần': 'moc',
    'Đường Phù': 'tho', 'Tấu Thư': 'kim', 'Hỷ Thần': 'hoa', 'Thái Tuế': 'hoa',
    'Bác Sĩ': 'thuy', 'Lực Sĩ': 'hoa', 'Thanh Long': 'thuy', 'Tướng Quân': 'moc',
    'Trường Sinh': 'thuy', 'Mộc Dục': 'thuy', 'Quan Đới': 'kim', 'Lâm Quan': 'kim',
    'Đế Vượng': 'kim', 'Suy': 'thuy', 'Bệnh': 'hoa', 'Tử': 'thuy',
    'Mộ': 'tho', 'Tuyệt': 'tho', 'Thai': 'tho', 'Dưỡng': 'tho',
};

const BAD_STARS = new Set([
    'Địa Không', 'Địa Kiếp', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh',
    'Đại Hao', 'Tiểu Hao', 'Thiên Hình', 'Thiên Diêu', 'Thiên Khốc', 'Thiên Hư',
    'Tang Môn', 'Bạch Hổ', 'Điếu Khách', 'Tuế Phá', 'Phi Liêm', 'Lưu Hà',
    'Kiếp Sát', 'Phá Toái', 'Cô Thần', 'Quả Tú', 'Bệnh Phù', 'Quan Phủ',
    'Phục Binh', 'Tử Phù', 'Đầu Quân', 'Âm Sát', 'Thiên Sứ', 'Thiên Nguyệt'
]);

const getColorClass = (name) => {
    const cleanName = name.startsWith('L.') ? name.substring(2) : name;
    return NGU_HANH_COLORS[cleanName] ? `nh-${NGU_HANH_COLORS[cleanName]}` : '';
};

const brightnessAbbr = (b) => {
    const map = { 'Miếu': 'M', 'Vượng': 'V', 'Đắc': 'Đ', 'Bình': 'B', 'Hãm': 'H' };
    return map[b] || b;
};

const PALACE_ABBR = {
    'Mệnh': 'MỆNH', 'Phụ Mẫu': 'PHỤ', 'Phúc Đức': 'PHÚC', 'Điền Trạch': 'ĐIỀN',
    'Quan Lộc': 'QUAN', 'Nô Bộc': 'NÔ', 'Thiên Di': 'DI', 'Tật Ách': 'TẬT',
    'Tài Bạch': 'TÀI', 'Tử Nữ': 'TỬ', 'Phu Thê': 'PHỐI', 'Huynh Đệ': 'HUYNH'
};

const PalaceBox = ({ palace, activeBranch, onHover, showYearly, showDecadal }) => {
    const {
        name, heavenlyStem, earthlyBranch, majorStars, minorStars, adjectiveStars, yearlyStars, decadalStars,
        changsheng12, decadal, isBodyPalace
    } = palace;
    
    const allSecondary = [
        ...(minorStars || []),
        ...(adjectiveStars || [])
    ];

    const leftStars = [];
    const rightStars = [];
    allSecondary.forEach(s => {
        if (BAD_STARS.has(s.name)) rightStars.push(s);
        else leftStars.push(s);
    });

    const canAbbr = heavenlyStem ? heavenlyStem.charAt(0) + '.' + earthlyBranch : earthlyBranch;

    return (
        <div
            className={`palace-box ${activeBranch === earthlyBranch ? 'is-active' : ''}`}
            style={{ gridArea: GRID_POSITIONS[earthlyBranch] }}
            onMouseEnter={() => onHover(earthlyBranch)}
            onMouseLeave={() => onHover(null)}
        >
            <div className="p-header">
                <div className="p-header-left">
                    <span className="p-canchi">{canAbbr}</span>
                    <span className="p-element">{BRANCH_ELEMENTS[earthlyBranch]}</span>
                </div>
                <span className="p-name">
                    {name}
                    {isBodyPalace && <span className="badge-than">Thân</span>}
                </span>
                <div className="p-header-right">
                    <span className="p-month-idx">{decadal?.range[0]}</span>
                </div>
            </div>

            <div className="p-major">
                {majorStars.map((sao, i) => (
                    <div key={`m-${i}`} className={`star-major ${getColorClass(sao.name)}`}>
                        <strong>{sao.name}</strong>
                        {sao.brightness && <span className="star-bright">({brightnessAbbr(sao.brightness)})</span>}
                    </div>
                ))}
            </div>

            <div className="p-minor-wrap">
                <div className="p-minor-col p-left">
                    {leftStars.map((sao, i) => (
                        <span key={`l-${i}`} className={`star-minor ${getColorClass(sao.name)}`}>
                            {sao.name} {sao.brightness && <span className="star-bright">({brightnessAbbr(sao.brightness)})</span>}
                        </span>
                    ))}
                </div>
                <div className="p-minor-col p-right">
                    {showYearly && yearlyStars?.map((sao, i) => (
                        <span key={`y-${i}`} className="star-yearly">{sao.name}</span>
                    ))}
                    {showDecadal && decadalStars?.map((sao, i) => (
                        <span key={`d-${i}`} className="star-decadal">{sao.name}</span>
                    ))}
                    {rightStars.map((sao, i) => (
                        <span key={`r-${i}`} className={`star-minor ${getColorClass(sao.name)}`}>
                            {sao.name} {sao.brightness && <span className="star-bright">({brightnessAbbr(sao.brightness)})</span>}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-adj-wrap">
                {adjectiveStars.map((sao, i) => (
                    <span key={`a-${i}`} className="star-adj">
                        {sao.name}{sao.brightness && <span className="star-bright">({brightnessAbbr(sao.brightness)})</span>}
                        {i < adjectiveStars.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </div>

            <div className="p-footer">
                <span className="p-footer-dv">ĐV.{PALACE_ABBR[name] || name}</span>
                <span className="p-footer-cs">{changsheng12}</span>
                <span className="p-footer-ln">LN.{PALACE_ABBR[name] || name}</span>
            </div>
        </div>
    );
};

const CenterInfo = ({ info }) => {
    if (!info) return null;
    const parts = (info.chineseDate || '').split(' - ');

    return (
        <div className="center-box">
            <div className="center-header">
                <div style={{fontSize:'0.8rem', color:'#666', marginBottom: '4px'}}>Năm xem: {info.targetYear}</div>
                <h1 className="center-title">LÁ SỐ TỬ VI</h1>
                <div className="center-name">{info.name}</div>
            </div>
            <table className="center-tbl">
                <tbody>
                    <tr><td className="tbl-l">Họ tên</td><td className="tbl-v">{info.name}</td></tr>
                    <tr><td className="tbl-l">Năm sinh</td><td className="tbl-v">{parts[0]}</td></tr>
                    <tr><td className="tbl-l">Tháng sinh</td><td className="tbl-v">{parts[1]}</td></tr>
                    <tr><td className="tbl-l">Ngày sinh</td><td className="tbl-v">{parts[2]}</td></tr>
                    <tr><td className="tbl-l">Giờ sinh</td><td className="tbl-v">{info.time}</td></tr>
                    <tr><td className="tbl-l">Năm xem</td><td className="tbl-v">{info.targetYear} - {info.currentAge} tuổi</td></tr>
                    <tr><td className="tbl-l">Âm Dương</td><td className="tbl-v">{info.sign} - {info.yangYinDesc}</td></tr>
                    <tr><td className="tbl-l">Bản mệnh</td><td className="tbl-v tbl-hl">{info.banMenh}</td></tr>
                    <tr><td className="tbl-l">Cục</td><td className="tbl-v">{info.cucName} - {info.cucRelation}</td></tr>
                    <tr><td className="tbl-l">Mệnh chủ</td><td className="tbl-v">{info.soul}</td></tr>
                    <tr><td className="tbl-l">Thân chủ</td><td className="tbl-v">{info.body}</td></tr>
                </tbody>
            </table>
        </div>
    );
};

const TuViChart = ({ data }) => {
    const [hoveredBranch, setHoveredBranch] = useState(null);
    const [showYearly, setShowYearly] = useState(true);
    const [showDecadal, setShowDecadal] = useState(true);
    const [inputYear, setInputYear] = useState(data?.info?.targetYear || new Date().getFullYear());

    if (!data) return null;

    const getBorderBadgeStyle = (branches) => {
        if (!branches || branches.length < 2) return null;
        const [b1, b2] = branches;
        const p1 = GRID_POSITIONS[b1].split(' / ').map(Number);
        const p2 = GRID_POSITIONS[b2].split(' / ').map(Number);
        if (p1[0] === p2[0]) {
            return { top: `${(p1[0] - 1) * 25 + 12.5}%`, left: `${(Math.max(p1[1], p2[1]) - 1) * 25}%`, transform: 'translate(-50%, -50%) rotate(90deg)' };
        }
        if (p1[1] === p2[1]) {
            return { top: `${(Math.max(p1[0], p2[0]) - 1) * 25}%`, left: `${(p1[1] - 1) * 25 + 12.5}%`, transform: 'translate(-50%, -50%)' };
        }
        return null;
    };

    const renderInteractionLines = () => {
        if (!hoveredBranch) return null;
        const start = BRANCH_COORDS[hoveredBranch];
        const baseIdx = BRANCH_CIRCLE.indexOf(hoveredBranch);
        const targets = [
            BRANCH_CIRCLE[(baseIdx + 4) % 12],
            BRANCH_CIRCLE[(baseIdx + 8) % 12],
            BRANCH_CIRCLE[(baseIdx + 6) % 12]
        ];
        return (
            <svg className="interaction-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                {targets.map(t => {
                    const end = BRANCH_COORDS[t];
                    return <line key={t} x1={`${start[0]}%`} y1={`${start[1]}%`} x2={`${end[0]}%`} y2={`${end[1]}%`} className="interaction-path" />;
                })}
            </svg>
        );
    };

    return (
        <div className="tuvi-layout">
            <div className="tuvi-grid">
                {data.palaces.map((p) => (
                    <PalaceBox 
                        key={p.earthlyBranch} 
                        palace={p} 
                        activeBranch={hoveredBranch} 
                        onHover={setHoveredBranch} 
                        showYearly={showYearly}
                        showDecadal={showDecadal}
                    />
                ))}
                <div className="center-container">
                    <CenterInfo info={{...data.info, targetYear: inputYear}} />
                </div>
                <div className="border-badge" style={getBorderBadgeStyle(data.trietKhong)}>TRIỆT</div>
                <div className="border-badge" style={getBorderBadgeStyle(data.tuanKhong)}>TUẦN</div>
                {renderInteractionLines()}
            </div>
            
            <div className="chart-controls">
                <div className="control-item">
                    <span>Năm xem</span>
                    <input 
                        type="number" 
                        value={inputYear} 
                        onChange={(e) => setInputYear(e.target.value)} 
                    />
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <label className="control-item">
                        <input 
                            type="checkbox" 
                            checked={showDecadal} 
                            onChange={(e) => setShowDecadal(e.target.checked)} 
                        />
                        An lưu đại vận
                    </label>
                    <label className="control-item">
                        <input 
                            type="checkbox" 
                            checked={showYearly} 
                            onChange={(e) => setShowYearly(e.target.checked)} 
                        />
                        An lưu tiểu vận
                    </label>
                </div>
            </div>

            <div className="chart-legend-wrap">
                <div className="chart-legend brightness">
                    <span className="l-item"><strong>M:</strong> Miếu</span>
                    <span className="l-item"><strong>V:</strong> Vượng</span>
                    <span className="l-item"><strong>Đ:</strong> Đắc</span>
                    <span className="l-item"><strong>B:</strong> Bình hòa</span>
                    <span className="l-item"><strong>H:</strong> Hãm</span>
                </div>
                
                <div className="chart-legend elements">
                    <div className="legend-item"><div className="legend-box bg-kim"></div> Kim</div>
                    <div className="legend-item"><div className="legend-box bg-moc"></div> Mộc</div>
                    <div className="legend-item"><div className="legend-box bg-thuy"></div> Thủy</div>
                    <div className="legend-item"><div className="legend-box bg-hoa"></div> Hỏa</div>
                    <div className="legend-item"><div className="legend-box bg-tho"></div> Thổ</div>
                </div>
            </div>
        </div>
    );
};

export default TuViChart;

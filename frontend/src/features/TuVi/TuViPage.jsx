import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import TuViChart from './components/TuViChart';
import PalaceScoreChart from './components/PalaceScoreChart';
import TuViDecades from './components/TuViDecades';
import TuViYearly from './components/TuViYearly';
import TuViMonthly from './components/TuViMonthly';
import TuViDaily from './components/TuViDaily';

const InteractiveSegment = ({ segment, onJump }) => {
    const formattedTxt = segment.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return (
        <div className="interactive-segment" style={{ marginBottom: '24px', position: 'relative' }}>
            <div 
                style={{ marginBottom: '12px', color: '#333', lineHeight: '1.7', fontSize: '1rem', textAlign: 'justify' }} 
                dangerouslySetInnerHTML={{ __html: formattedTxt.replace(/\n/g, '<br/>') }} 
            />
            
            {segment.yearLink && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button 
                        onClick={() => onJump(segment.yearLink)}
                        style={{ 
                            background: '#c85a17', color: '#fff', border: 'none', padding: '6px 14px', 
                            borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(200, 90, 23, 0.2)', transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Xem Tiểu Vận {segment.yearLink} tuổi →
                    </button>
                </div>
            )}
        </div>
    );
};

const InterpretationCard = ({ title, segments, onJump }) => (
    <div className="glass-card interpretation-card" style={{ padding: '24px', background: '#fffef8', border: '1px solid #d4c49a', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <h3 style={{ color: '#c85a17', borderBottom: '2px solid #e8cc8', paddingBottom: '12px', marginBottom: '20px', textTransform: 'uppercase', fontSize: '1.2rem', fontWeight: '900', letterSpacing: '1px' }}>
            {title}
        </h3>
        <div className="interpretation-body">
            {Array.isArray(segments) ? (
                segments.map((seg, idx) => (
                    <InteractiveSegment key={idx} segment={seg} onJump={onJump} />
                ))
            ) : (
                <p style={{ color: '#333', lineHeight: '1.6' }}>Chưa có dữ liệu.</p>
            )}
        </div>
    </div>
);



// ===================== LUẬN CUNG DATA =====================

const PALACE_SUMMARIES = {
    "Mệnh": { title: "Cung Mệnh + Thân", desc: "Luận Mệnh - Thân giúp bạn thấu hiểu bản thân một cách sâu sắc, từ gốc rễ bên trong đến hành trình trưởng thành và phát triển trong cuộc sống – từ 'điều bạn là' đến 'điều bạn sẽ trở thành'." },
    "Tài Bạch": { title: "Cung Tài Bạch", desc: "Luận cung Tài Bạch giúp bạn tìm hiểu cách thức, năng lực kiếm tiền, khả năng quản lý tài chính và cách sử dụng tiền của bản thân. Đây cũng là nơi phản ánh góc nhìn của bạn đối với tiền bạc và các giá trị vật chất trong cuộc sống." },
    "Quan Lộc": { title: "Cung Quan Lộc", desc: "Luận cung Quan Lộc giúp bạn tìm hiểu về con đường học tập, thi cử, công danh và sự nghiệp của bản thân. Đây là nơi phản ánh năng lực chuyên môn, học vấn, thái độ làm việc." },
    "Phụ Mẫu": { title: "Cung Phụ Mẫu", desc: "Luận cung Phụ Mẫu không chỉ giúp bạn tìm hiểu về mối quan hệ giữa cha mẹ với nhau và với bạn, về cuộc đời của họ và ảnh hưởng mà họ có đối với bạn, từ ngoại hình, phẩm chất, tài năng đến tài lộc." },
    "Phúc Đức": { title: "Cung Phúc Đức", desc: "Luận cung Phúc Đức giúp bạn tìm hiểu về đời sống tinh thần và lý tưởng sống của bản thân, đồng thời phản ánh nền tảng 'phúc đức' mà bạn được thừa hưởng từ tổ tiên." },
    "Nô Bộc": { title: "Cung Nô Bộc", desc: "Luận cung Nô Bộc giúp bạn tìm hiểu về các mối quan hệ của bản thân, từ bạn bè, đồng nghiệp đến người dưới quyền. Đây là nơi phản ánh sự gắn bó hay xa cách." },
    "Thiên Di": { title: "Cung Thiên Di", desc: "Luận cung Thiên Di giúp bạn tìm hiểu về bản thân khi bước ra ngoài giao tiếp xã hội, từ thái độ, khả năng ứng xử đến mức độ thuận lợi hay khó khăn khi ra ngoài." },
    "Huynh Đệ": { title: "Cung Huynh Đệ", desc: "Luận cung Huynh Đệ giúp bạn tìm hiểu về mối quan hệ giữa mình với anh/chị em và những người bạn xem như anh em." },
    "Điền Trạch": { title: "Cung Điền Trạch", desc: "Luận cung Điền Trạch giúp bạn tìm hiểu về tình hình nhà cửa, đất đai và bất động sản bạn sở hữu, chính là nơi trú ẩn và lưu trữ tài chính của bản thân." },
    "Tử Nữ": { title: "Cung Tử Tức", desc: "Luận cung Tử Tức giúp bạn tìm hiểu về vấn đề con cái của bản thân, từ số lượng, tính cách, tài năng đến tiềm năng phát triển của chúng." },
    "Phu Thê": { title: "Cung Phu Thê", desc: "Luận cung Phu Thê giúp bạn tìm hiểu về đời sống hôn nhân và người bạn đời của mình, từ tính cách, tài năng, dung mạo đến những thành tựu mà họ đạt được." },
    "Tật Ách": { title: "Cung Tật Ách", desc: "Luận cung Tật Ách giúp bạn tìm hiểu về sức khỏe thể chất và nội tâm của bản thân, từ thể trạng, những tiềm năng sẵn có đến các tật xấu, nỗi sợ." }
};

const ORDERED_PALACES = ["Mệnh", "Tài Bạch", "Quan Lộc", "Phụ Mẫu", "Phúc Đức", "Nô Bộc", "Thiên Di", "Huynh Đệ", "Điền Trạch", "Tử Nữ", "Phu Thê", "Tật Ách"];

const PalaceListItem = ({ palaceName, score, segments, onJump }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const info = PALACE_SUMMARIES[palaceName] || { title: `Cung ${palaceName}`, desc: `Luận giải tổng quan về cung ${palaceName}.` };
    
    return (
        <div style={{ padding: '20px 0', borderBottom: '1px solid rgba(232, 220, 200, 0.5)' }}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{ display: 'flex', gap: '15px', cursor: 'pointer', transition: 'all 0.2s' }}
            >
                <div style={{ flexShrink: 0, marginTop: '2px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f57c00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem', boxShadow: '0 2px 5px rgba(245, 124, 0, 0.3)' }}>
                        {score}
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#8b7355', fontWeight: 'bold' }}>{info.title}</h3>
                        <span style={{ fontSize: '1.2rem', color: '#f57c00', fontWeight: 'bold' }}>{isOpen ? '−' : '+'}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#444', lineHeight: '1.6', fontStyle: 'italic' }}>
                        {info.desc}
                    </p>
                </div>
            </div>

            {isOpen && (
                <div className="fade-in" style={{ marginTop: '20px', padding: '20px', background: '#fffef8', borderRadius: '12px', border: '1px solid #e8dcc8' }}>
                    {Array.isArray(segments) && segments.length > 0 ? (
                        segments.map((seg, idx) => (
                            <InteractiveSegment key={idx} segment={seg} onJump={onJump} />
                        ))
                    ) : (
                        <p style={{ color: '#999', fontSize: '0.9rem', margin: 0 }}>Dữ liệu chi tiết đang được cập nhật...</p>
                    )}
                </div>
            )}
        </div>
    );
};

// ===================== MAIN PAGE =====================

import ImageExportButton from '../../components/ImageExportButton';

const TuViPage = ({ data, isMobile }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'laso';

    const interpretations = data?.interpretations || {};
    
    // Jump to Year logic
    const handleJumpToYear = (age) => {
        setSearchParams({ tab: 'tieuvan' });
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    const currentAge = useMemo(() => {
        if (!data?.info?.solarDate) return 0;
        try {
            const birth = new Date(data.info.solarDate);
            const now = new Date();
            let age = now.getFullYear() - birth.getFullYear();
            const m = now.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
            return age + 1;
        } catch (e) { return 0; }
    }, [data?.info?.solarDate]);

    return (
        <div className="tab-pane fade-in chart-page" style={{ padding: isMobile ? '10px' : '30px' }}>
            <div className="chart-actions-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <button className="chart-action-btn" onClick={() => window.location.href = '/?tab=tuvi'} title="Quay lại trang nhập">
                        🏠 Trang chủ
                    </button>
                    <button className="chart-action-btn" onClick={() => setSearchParams({ tab: 'daivan' })} title="Xem các đại vận">
                        📈 Đại Vận
                    </button>
                    <button className="chart-action-btn" onClick={() => setSearchParams({ tab: 'tieuvan' })} title="Xem tiểu vận & nguyệt vận">
                        ⏳ Tiểu Vận & Nguyệt Vận
                    </button>
                    <button className="chart-action-btn" onClick={() => setSearchParams({ tab: 'nhatvan' })} title="Xem nhật vận (lịch tháng)">
                        📅 Nhật Vận
                    </button>
                </div>
                <div className="chart-actions-right">
                    <ImageExportButton data={data} />
                    <button 
                        className="chart-action-btn premium" 
                        onClick={() => window.location.href = '/tuvan?module=tuvi'}
                        style={{ background: 'linear-gradient(135deg, #c85a17, #8b7355)', color: '#fff' }}
                    >
                        💬 Tư vấn AI
                    </button>
                </div>
            </div>

            <div className="tuvi-content-area">

                {/* ========== TAB LÁ SỐ ========== */}
                {activeTab === 'laso' && (
                    <div className="tong-quan-container">
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '20px', gap: '10px', background: '#fffef8', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e8dcc8' }}>
                            <h2 style={{ color: '#c85a17', margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                                Tổng quan lá số của {data?.info?.name || 'Đương số'}
                            </h2>
                        </div>
                        
                        <TuViChart data={data} />



                        {interpretations.palaceScores && (
                            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                                <PalaceScoreChart scores={interpretations.palaceScores} isMobile={isMobile} />
                            </div>
                        )}

                        <div className="luangiai-content" style={{ 
                            marginTop: '30px', maxWidth: '850px', margin: '30px auto 0',
                            background: '#fffef8', padding: '30px', borderRadius: '12px',
                            border: '1px solid #d4c49a', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                        }}>
                            <h3 style={{ color: '#c85a17', fontSize: '1.3rem', fontWeight: '900', marginBottom: '24px', borderBottom: '2px solid #e8dcc8', paddingBottom: '12px' }}>
                                📖 Luận Giải Tổng Quan
                            </h3>
                            {/* Tổng quan cách cục */}
                            {interpretations.natal?.['Cách Cục'] && (
                                <div style={{ marginBottom: '30px' }}>
                                    {interpretations.natal['Cách Cục'].map((seg, idx) => (
                                        <InteractiveSegment key={`cach-cuc-${idx}`} segment={seg} onJump={handleJumpToYear} />
                                    ))}
                                </div>
                            )}
                            {/* Phân tích chuyên sâu */}
                            {interpretations.natal?.['Phân Tích Chuyên Sâu'] &&
                                interpretations.natal['Phân Tích Chuyên Sâu'].map((seg, idx) => (
                                    <InteractiveSegment key={`chuyen-sau-${idx}`} segment={seg} onJump={handleJumpToYear} />
                                ))
                            }
                        </div>
                    </div>
                )}

                {/* ========== TAB LUẬN CUNG ========== */}
                {activeTab === 'luancung' && (
                    <div className="luancung-container" style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '10px 30px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e8dcc8' }}>
                        {interpretations.palaceScores ? (
                            ORDERED_PALACES.map((pName) => {
                                const pScore = interpretations.palaceScores.find(p => p.name === pName);
                                const pSegments = interpretations.natal?.[pName];
                                return (
                                    <PalaceListItem 
                                        key={pName} 
                                        palaceName={pName} 
                                        score={pScore ? pScore.score : 0} 
                                        segments={pSegments}
                                        onJump={handleJumpToYear}
                                    />
                                );
                            })
                        ) : (
                            <p>Đang tải dữ liệu luận cung...</p>
                        )}
                    </div>
                )}

                {activeTab === 'daivan' && (
                        <TuViDecades 
                            decades={interpretations.decades} 
                            palaceScores={interpretations.palaceScores}
                            currentAge={currentAge} 
                            solarDate={data?.info?.solarDate}
                        />
                )}

                {activeTab === 'tieuvan' && (
                    <TuViYearly 
                        yearlyCycle={interpretations.yearlyCycle} 
                        currentAge={currentAge} 
                    />
                )}

                {activeTab === 'nguyetvan' && (
                    <TuViMonthly 
                        monthlyCycle={interpretations.monthlyCycle} 
                    />
                )}

                {activeTab === 'nhatvan' && (
                    <TuViDaily 
                        dailyTrend={interpretations.dailyTrend}
                    />
                )}

                {/* ========== TAB CHUYÊN ĐỀ ========== */}
                {activeTab === 'chuyende' && interpretations.topics && (
                    <div className="chuyende-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        {Object.entries(interpretations.topics).map(([topicName, segments]) => (
                            <InterpretationCard key={topicName} title={topicName} segments={segments} onJump={handleJumpToYear} />
                        ))}
                    </div>
                )}

                {/* ========== FALLBACK VẬN HẠN ========== */}
                {!interpretations.horoscope && ['tieuvan', 'nguyetvan', 'nhatvan'].includes(activeTab) && (
                    <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                        <h3>Chưa có dữ liệu vận hạn cho thời điểm này.</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TuViPage;

/**
 * TuVi AI Prompts Service
 * Handles building prompts for TuVi Đẩu Số consultant
 */

class TuViAiService {
    /**
     * Build system prompt for TuVi consultant persona
     */
    buildSystemPrompt(personaId) {
        const personas = {
            'huyen_co': `Bạn là Thầy Tử Vi Huyền Cơ - một bậc thầy uyên bác về Tử Vi Đẩu Số với hơn 35 năm tu luyện.
THẺ TÍNH CÁCH:
- Uyên bác, thâm sâu nhưng gần gũi, dễ hiểu
- Nhân văn, từ tốn, luôn hướng thiện cho người xem
- Không hù dọa bằng các sao xấu (Sát tinh), luôn tìm cách hóa giải bằng Tuần Triệt hoặc Cát tinh
- Xưng hô "Thầy" và gọi người hỏi là "con" hoặc "bạn"

PHONG CÁCH TƯ VẤN:
- Phân tích lá số theo hệ thống 14 Chính Tinh và 6 Phụ Tinh (Lục Cát, Lục Sát), vòng Thái Tuế, Lộc Tồn...
- Luận giải CỤ THỂ theo 12 cung Tử Vi được cung cấp (Mệnh, Tài, Quan...).
- Đưa ra lời khuyên thực tế.`,

            'menh_meo': `Bạn là Cô Đồng Tử Vi (hoặc Thầy Mèo Tử Vi GenZ) - am hiểu Tử Vi tử vi đẩu số nhưng nói chuyện kiểu GenZ hài hước.
THẺ TÍNH CÁCH:
- Cực kỳ giỏi Tử Vi nhưng dùng văn phong GenZ (flex, slay, pressing, ét ô ét...).
- Xưng hô "Thầy" (hoặc "Cô") và gọi là "con" hoặc "mệnh chủ".
- Đọc lá số thấy Không Kiếp thì trêu là "bug game", thấy Tử Vi Thiên Phủ thì bảo là "rich kid".

PHONG CÁCH TƯ VẤN:
- Luận chính xác các sao Tử Vi nhưng ngôn từ nhí nhảnh, hiện đại.
- Tư vấn đánh thẳng vấn đề, không vòng vo.`
        };

        const basePrompt = personas[personaId] || personas['huyen_co'];

        return `${basePrompt}

QUY TẮC TRẢ LỜI:
1. Bắt đầu bằng lời chào nhân vật.
2. Phân tích dựa trên các Cung và các Sao được báo cáo trong lá số (đặc biệt chú ý Mệnh, Thân, và cung liên quan câu hỏi).
3. KHÔNG đề cập đến Bát Tự (Thiên Can Địa Chi Tứ Trụ) vì đây là chế độ xem TỬ VI ĐẨU SỐ, hãy dùng Chính Tinh, Phụ Tinh, Âm Dương, Ngũ Hành Cục.
4. Ở cuối cùng, luôn cung cấp một phần có tiêu đề [FOLLOW_UP] chứa 3-5 câu hỏi gợi mở về các cung khác hoặc về đại hạn/tiểu hạn hiện tại.
5. Mỗi câu hỏi gợi mở phải là một dòng bắt đầu bằng dấu "-".`;
    }

    /**
     * Build user prompt with TuVi context
     */
    buildUserPrompt(tuviContext, questionText, personaId) {
        const info = tuviContext.info || {};
        const palaces = tuviContext.palaces || [];

        // Format 12 Palaces
        let palacesDetailedInfo = '';
        palaces.forEach(p => {
            const majorStr = p.majorStars?.map(s => `${s.name}(${s.brightness || ''})`).join(', ') || 'Vô Chính Diệu';
            const minorStr = p.minorStars?.map(s => s.name).join(', ') || '';
            const adjStr = p.adjectiveStars?.map(s => s.name).join(', ') || '';
            const allMinor = [minorStr, adjStr].filter(Boolean).join(', ');
            
            const changsheng = p.changsheng12 ? `Trường Sinh: ${p.changsheng12}` : '';
            const boshi = p.boshi12 ? `Lộc Tồn: ${p.boshi12}` : '';
            const suiqian = p.suiqian12 ? `Thái Tuế: ${p.suiqian12}` : '';
            const rings = [changsheng, boshi, suiqian].filter(Boolean).join(' | ');
            
            palacesDetailedInfo += `
- Cung [${p.name}] (tại ${p.earthlyBranch}):
  + Chính Tinh: ${majorStr}
  + Phụ Tinh & Thần Sát: ${allMinor}
  + Vòng Sao: ${rings}
  + Tuổi Đại Hạn: ${p.decadal?.range?.[0] || ''} - ${p.decadal?.range?.[1] || ''}
  ${p.isBodyPalace ? '*** ĐÂY LÀ CUNG AN THÂN ***' : ''}`;
        });

        // Format Horoscope (Vận Hạn hiện tại)
        const horo = tuviContext.interpretations?.horoscope || {};
        let horoscopeInfo = '';
        if (horo.yearly) {
            horoscopeInfo += `\n### Đại Vận & Lưu Niên (Vận Năm): ${horo.yearly.title}\n`;
            horoscopeInfo += horo.yearly.texts.map(t => typeof t === 'string' ? t : t.text).join(' ') + '\n';
        }
        if (horo.monthly) {
            horoscopeInfo += `\n### Lưu Nguyệt (Vận Tháng): ${horo.monthly.title}\n`;
            horoscopeInfo += horo.monthly.texts.map(t => typeof t === 'string' ? t : t.text).join(' ') + '\n';
        }
        if (horo.daily) {
            horoscopeInfo += `\n### Lưu Nhật (Vận Ngày): ${horo.daily.title}\n`;
            horoscopeInfo += horo.daily.texts.map(t => typeof t === 'string' ? t : t.text).join(' ') + '\n';
        }

        return `
## THÔNG TIN LÁ SỐ TỬ VI
- Tên: ${info.name || 'Mệnh chủ'}
- Giới tính: ${info.gender || 'Nam'}
- Năm sinh Âm Lịch: ${info.chineseDate || 'N/A'}
- Giờ sinh: ${info.time} (${info.timeRange})
- Bản Mệnh: ${info.zodiac || ''}
- Âm Dương & Cục: ${info.sign || ''}, ${info.fiveElementsClass || ''}
- Mệnh Chủ: ${info.soul || ''} | Thân Chủ: ${info.body || ''}

## 12 CUNG TRÊN LÁ SỐ (Vị trí các Sao):
${palacesDetailedInfo}

${horoscopeInfo ? `## VẬN HẠN HIỆN TẠI (Thời điểm người dùng đang hỏi):\n${horoscopeInfo}\n` : ''}

---

## CÂU HỎI CỦA NGƯỜI DÙNG
"${questionText}"

---

Hãy phân tích và trả lời câu hỏi trên dựa trên lá số Tử Vi Đẩu Số được cung cấp:
1. Xác định cung nào liên quan đến câu hỏi (ví dụ hỏi tiền bạc thì xem cung Tài Bạch và Phúc Đức; hỏi sự nghiệp thì xem Mệnh-Quan-Tài).
2. Phân tích ý nghĩa của các Chính Tinh và Phụ Tinh tại cung đó (đặc biệt chú ý Tuần/Triệt, Không Kiếp, Linh Hỏa, Khôi Việt...).
3. Trả lời bằng phong cách của ${personaId === 'menh_meo' ? 'Thầy Mệnh Mèo Tử Vi GenZ' : 'Thầy Tử Vi Huyền Cơ'}.
4. Đưa ra đoạn văn tư vấn súc tích, ngắt đoạn dễ đọc.
5. CUỐI CÙNG LÀ PHẦN [FOLLOW_UP] VỚI 3-5 CÂU HỎI GỢI MỞ.`;
    }
}

module.exports = new TuViAiService();

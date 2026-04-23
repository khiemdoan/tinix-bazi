/**
 * BaZi AI Prompts Service
 * Handles building prompts for BaZi Consultant
 */

class BaziAiService {
    /**
     * Build system prompt for BaZi consultant persona
     */
    buildSystemPrompt(personaId) {
        const personas = {
            'huyen_co': `Bạn là Thầy Huyền Cơ Bát Tự - một bậc thầy uyên bác về Tử Vi và Bát Tự (Tứ Trụ) với hơn 35 năm tu luyện và hành nghề.
THẺ TÍNH CÁCH:
- Uyên bác, thâm sâu nhưng gần gũi, dễ hiểu
- Nhân văn, từ tốn, luôn hướng thiện cho người xem
- Đạo đức nghề nghiệp cao, không hù dọa hay đưa thông tin tiêu cực không cần thiết
- Xưng hô "Thầy" và gọi người hỏi là "con" hoặc "bạn" một cách thân mật

PHONG CÁCH TƯ VẤN:
- Phân tích lá số theo trường phái chính thống Việt Nam
- Luận giải CỤ THỂ dựa trên lá số được cung cấp, KHÔNG trả lời chung chung
- Đưa ra lời khuyên thực tế, có thể thực hiện được trong cuộc sống`,

            'menh_meo': `Bạn là Thầy Mệnh Mèo GenZ - một thiên tài Bát Tự ẩn danh dưới hình hài một chú mèo vibe GenZ "mỏ hỗn" nhưng cực kỳ giỏi chuyên môn.
THẺ TÍNH CÁCH:
- Giỏi Bát Tự thực thụ nhưng nói chuyện cực kỳ GenZ, hài hước, viral, đôi khi hơi "xéo sắc" nhưng tâm tốt.
- Sử dụng slang GenZ linh hoạt (flex, ét ô ét, đỉnh nóc kịch trần, bay màu, khét lẹt, pressing...).
- Xưng hô "Thầy" (hoặc "Ta") và gọi người hỏi là "con" hoặc "mệnh chủ" một cách hài hước.
- Ghét sự sướt mướt, thích sự thực tế, đánh thẳng vào vấn đề.

PHONG CÁCH TƯ VẤN:
- Luận giải Bát Tự chính xác nhưng dùng ngôn ngữ của giới trẻ.
- Ví von các khái niệm tử vi với đời sống hiện đại (vd: Dụng thần như sạc dự phòng, Kỵ thần như bug code...).
- Luôn giữ vững chuyên môn Bát Tự kiến thức thâm sâu đằng sau lớp vỏ hài hước.`
        };

        const basePrompt = personas[personaId] || personas['huyen_co'];

        return `${basePrompt}

QUY TẮC TRẢ LỜI:
1. Bắt đầu bằng lời chào nhân vật (Huyền Cơ: từ tốn; Mệnh Mèo: hài hước, chất chơi).
2. Phân tích 3-5 điểm chính dựa trên lá số, mỗi điểm 2-3 câu.
3. KHÔNG dùng cụm từ "AI", "máy móc".
4. Ở cuối cùng, luôn cung cấp một phần có tiêu đề [FOLLOW_UP] chứa 3-5 câu hỏi gợi mở dựa trên lá số và đại vận của người dùng.
5. Mỗi câu hỏi gợi mở phải là một dòng bắt đầu bằng dấu "-". Những câu hỏi này phải thực sự liên quan đến rủi ro hoặc cơ hội sắp tới của chủ mệnh, trong đấy có 1 câu liên quan đến ngày, tháng sắp tới.`;
    }

    /**
     * Build user prompt with BaZi context
     */
    buildUserPrompt(baziContext, luckCyclesData, questionText, personaId, partnerContext = null) {
        // Get current date/time
        const now = new Date();
        const currentDateTime = now.toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            weekday: 'long'
        });

        const currentYear = now.getFullYear();

        // Extract key information
        const basicInfo = baziContext.thong_tin_co_ban || {};
        const pillars = baziContext.chi_tiet_tru || [];
        const analysis = baziContext.phan_tich || {};

        // Format detailed pillars data with Can, Chi, and Tàng Can
        const pillarsLabels = ['Năm', 'Tháng', 'Ngày', 'Giờ'];
        let pillarsDetailedInfo = '';
        pillars.forEach((p, i) => {
            const tangCanStr = p.tang_can ? p.tang_can.join(', ') : 'N/A';
            pillarsDetailedInfo += `
### Trụ ${pillarsLabels[i]}:
- Thiên Can: ${p.can || 'N/A'} (${p.hanh_can || ''})
- Địa Chi: ${p.chi || 'N/A'} (${p.hanh_chi || ''})
- Tàng Can: ${tangCanStr}
- Thập Thần Can: ${p.thap_than_can || (i === 2 ? 'Nhật Chủ' : 'N/A')}
- Thập Thần Chi: ${p.thap_than_chi || 'N/A'}
`;
        });

        // Simple pillars summary for quick reference
        const pillarsSimple = pillars.map((p, i) => {
            return `Trụ ${pillarsLabels[i]}: ${p.can} ${p.chi}`;
        }).join(' | ');

        // Format current luck cycle
        let luckInfo = '';
        if (luckCyclesData?.dai_van && luckCyclesData.dai_van.length > 0) {
            const currentDaiVan = luckCyclesData.dai_van.find(dv => {
                const endYear = dv.nam + 9;
                return currentYear >= dv.nam && currentYear <= endYear;
            });
            if (currentDaiVan) {
                luckInfo = `
- Đại Vận hiện tại: ${currentDaiVan.can_chi} (${currentDaiVan.nam} - ${currentDaiVan.nam + 9})
- Thập Thần Đại Vận: ${currentDaiVan.thap_than}
- Năm hiện tại (Lưu Niên): ${currentYear}`;
            }
        }

        // Format Dụng Thần / Kỵ Thần
        let godInfo = '';
        if (analysis.can_bang_ngu_hanh) {
            const cb = analysis.can_bang_ngu_hanh;
            godInfo = `
- Dụng Thần: ${cb.dung_than?.ngu_hanh?.join(', ') || 'Chưa xác định'}
- Hỷ Thần: ${cb.hy_than?.ngu_hanh?.join(', ') || 'Chưa xác định'}
- Kỵ Thần: ${cb.ky_than?.ngu_hanh?.join(', ') || 'Chưa xác định'}
- Cường độ Nhật Chủ: ${cb.nhan_dinh?.cuong_do || 'Chưa xác định'}`;
        }

        return `
## THỜI GIAN HIỆN TẠI
${currentDateTime}
(Năm ${currentYear})

${partnerContext ? `
## THÔNG TIN NGƯỜI PHỐI HỢP/ĐỐI PHƯƠNG
- Tên: ${partnerContext.name || 'Đối phương'}
- Giới tính: ${partnerContext.isFemale ? 'Nữ' : 'Nam'}
- Bát Tự: ${partnerContext.gans[0]} ${partnerContext.zhis[0]} (Năm) | ${partnerContext.gans[1]} ${partnerContext.zhis[1]} (Tháng) | ${partnerContext.gans[2]} ${partnerContext.zhis[2]} (Ngày) | ${partnerContext.gans[3]} ${partnerContext.zhis[3]} (Giờ)
- Nhật Chủ: ${partnerContext.gans[2]} (${partnerContext.elements?.[partnerContext.gans[2]] || ''})
- Thập Thần: ${partnerContext.ganShens?.join(', ')}
- Nạp Âm: ${partnerContext.nayin?.join(', ')}
- Vòng Trường Sinh: ${partnerContext.pillarStages?.join(', ')}
` : ''}

---

## THÔNG TIN LÁ SỐ BÁT TỰ

**Thông tin cơ bản:**
- Tên: ${basicInfo.ten || 'Mệnh chủ'}
- Giới tính: ${basicInfo.gioi_tinh || 'Nam'}
- Ngày sinh dương lịch: ${basicInfo.ngay_sinh_duong || 'N/A'}
- Ngày sinh âm lịch: ${basicInfo.ngay_sinh_am || 'N/A'}
- Giờ sinh: ${basicInfo.gio_sinh || 'N/A'}
- Mệnh (Ngũ Hành Nạp Âm): ${basicInfo.menh || 'N/A'}
- Cung Mệnh: ${basicInfo.menh_cung || 'N/A'}

**Bát Tự (Tứ Trụ) tóm tắt:**
${pillarsSimple}

**Chi tiết từng Trụ:**
${pillarsDetailedInfo}

**Phân tích Cách Cục:**
${godInfo}

**Vận hạn hiện tại:**
${luckInfo}

---

## CÂU HỎI CỦA NGƯỜI DÙNG
 
  "${questionText}"
  
  ---
  
  Hãy phân tích và trả lời câu hỏi trên dựa trên lá số Bát Tự được cung cấp.
  
  YÊU CẦU QUAN TRỌNG:
  1. Trả lời bằng phong cách của nhân vật ${personaId === 'menh_meo' ? 'Thầy Mệnh Mèo GenZ' : 'Thầy Huyền Cơ Bát Tự'}.
  2. Đưa ra 3-5 đoạn văn ngắn gọn, súc tích.
  3. CUỐI CÙNG LÀ PHẦN [FOLLOW_UP] VỚI 3-5 CÂU HỎI GỢI MỞ.
     Ví dụ về câu hỏi gợi mở dựa trên lá số:
     - Nếu có xung khắc trụ Ngày: "Con có muốn thầy luận giải sâu hơn về cung Phu Thê đang có dấu hiệu biến động không?"
     - Nếu Đại vận gặp Tài: "Đại vận này Tài tinh đang cực vượng, con có muốn thầy mách nước cách chốt deal thành công?"
     - Nếu Thân nhược: "Nhật chủ của con đang khá yếu, con có muốn biết cách chọn màu sắc và nghề nghiệp để 'buff' năng lượng không?"`;
    }

    /**
     * Build matching system prompt for BaZi compatibility
     */
    buildMatchingSystemPrompt() {
        return `Bạn là một bậc thầy chuyên gia Bát Tự (Tứ Vi) với kiến thức thâm sâu về học thuật phương Đông. 
        Nhiệm vụ của bạn là luận giải chi tiết độ tương hợp (Duyên Số) giữa hai người dựa trên lá số Bát Tự của họ, tập trung sâu vào các mâu thuẫn, thử thách và các nút thắt trong mối quan hệ.
        
        PHONG CÁCH LUẬN GIẢI:
        1. Sử dụng thuật ngữ Bát Tự chuyên nghiệp: Ngũ hành (Tương sinh/Tương khắc), Thiên Can (Hợp/Xung), Địa Chi (Hợp/Xung/Hình/Hại/Phá), Thập Thần (Tương tác giữa hai lá số), Thần Sát (Cô Thần, Quả Tú, Đào Hoa...).
        2. Phân tích CHI TIẾT và THỰC TẾ: Không được trả lời chung chung. Hãy chỉ rõ những điểm xung đột cụ thể (ví dụ: Thiên khắc địa xung ở trụ Ngày dẫn đến mâu thuẫn quan điểm sống, hay Thập Thần đối chọi gây áp lực cho đối phương).
        3. Tập trung vào 'Vấn đề': Hãy tìm ra những 'điểm yếu' trong mối quan hệ và giải thích chúng theo góc độ huyền học một cách thấu đáo.
        4. Văn phong: Uyên bác, sâu sắc, mang tính tư vấn chuyên gia.
        
        QUY TẮC SINH CÂU HỎI GỢI Ý (suggestedQuestions):
        - Các câu hỏi PHẢI được sinh ra dựa trên chính các mâu thuẫn hoặc điểm đặc biệt đã tìm thấy trong quá trình luận giải bên trên.
        - Tuyệt đối KHÔNG sử dụng câu hỏi chung chung.
        - Mỗi câu hỏi nên xoay quanh một "nút thắt" cụ thể cần được tháo gỡ (ví dụ: "Làm sao để hóa giải Thiên Khắc Địa Xung giữa hai người ở phương diện tài chính?").
        - Tập trung vào các câu hỏi mang tính 'Hóa Giải' hoặc 'Đào Sâu' vào nguyên nhân mâu thuẫn.
        
        BẠN PHẢI TRẢ VỀ DUY NHẤT MỘT ĐỐI TƯỢNG JSON theo cấu trúc sau, không kèm bất kỳ văn bản nào khác:
        {
          "totalScore": number (0-100),
          "assessment": {
            "level": "excellent" | "good" | "neutral" | "challenging" | "difficult",
            "title": "Tên đánh giá tổng quát theo văn phong Bát Tự (ví dụ: Thiên Duyên Tiền Định, Tuyệt Mệnh Hình Khắc...)",
            "summary": "Mô tả ngắn gọn nhưng súc tích về tổng quan mối hệ theo lý thuyết Bát Tự",
            "icon": "Emoji phù hợp"
          },
          "breakdown": {
            "element": { "score": number (max 30), "maxScore": 30, "description": "Phân tích sâu về sự tương tác của Ngũ hành bản mệnh và sự cân bằng năng lượng giữa hai người.", "quality": "excellent"|"good"|"neutral"|"challenging"|"difficult" },
            "ganzhi": { "score": number (max 25), "maxScore": 25, "details": [ { "type": "positive"|"negative", "text": "Luận về các tương tác Thiên Can, Địa Chi (Hợp, Xung, Hình, Hại) giữa các trụ của hai người." } ], "quality": "..." },
            "shishen": { "score": number (max 25), "maxScore": 25, "details": [ { "type": "positive"|"negative", "text": "Phân tích sự tương tác của Thập Thần, đặc biệt là Nhật Chủ và các cung quan trọng liên quan đến chủ đề." } ], "quality": "..." },
            "star": { "score": number (max 20), "maxScore": 20, "details": [ { "type": "positive"|"negative", "text": "Sự xuất hiện và ảnh hưởng của các Thần Sát mang tính chất tương hợp hoặc gây cản trở nhân duyên." } ], "quality": "..." }
          },
          "aspects": [
            { "type": "romance", "icon": "💕", "title": "Tình Cảm", "score": number (0-100), "description": "Luận chi tiết về sự gắn kết tâm hồn và cảm xúc dựa trên cung Phu Thê hoặc các sao chủ về tình cảm." },
            { "type": "communication", "icon": "💬", "title": "Giao Tiếp", "score": number (0-100), "description": "Phân tích sự thấu hiểu qua tương tác Can Chi ở trụ Ngày và trụ Tháng." },
            { "type": "children", "icon": "👶", "title": "Con Cái", "score": number (0-100), "description": "Góc nhìn về tiềm năng con cái qua trụ Giờ và các sao liên quan." },
            { "type": "finance", "icon": "💰", "title": "Tài Chính", "score": number (0-100), "description": "Sự hỗ trợ hoặc gây hao tổn về tài lộc khi ở cùng nhau (Tài tinh, Quan tinh)." },
            { "type": "lifestyle", "icon": "🏠", "title": "Lối Sống", "score": number (0-100), "description": "Sự hòa hợp trong nếp sống hàng ngày dựa trên sự tương đồng về hành khí." }
          ],
          "advice": [ { "type": "positive"|"neutral"|"warning"|"tip", "text": "Lời khuyên mang tính hóa giải các xung khắc cụ thể đã chỉ ra." } ],
          "suggestedQuestions": [ "Câu hỏi gợi ý sâu về vấn đề nan giải nhất của cặp đôi này 1", "Câu hỏi 2", "Câu hỏi 3", "Câu hỏi 4", "Câu hỏi 5" ]
        }`;
    }

    /**
     * Build matching user prompt with contexts
     */
    buildMatchingUserPrompt(person1Ctx, person2Ctx, relationshipType = 'romance') {
        const now = new Date();
        const currentDateTime = now.toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            weekday: 'long'
        });

        // Current Luck Cycle
        const { getCurrentDaiVan } = require('../dayun');
        const currentYear = now.getFullYear();
        const age1 = currentYear - person1Ctx.solar.getYear() + 1;
        const age2 = currentYear - person2Ctx.solar.getYear() + 1;

        const dv1 = getCurrentDaiVan(person1Ctx.dai_van || [], age1);
        const dv2 = getCurrentDaiVan(person2Ctx.dai_van || [], age2);

        const relMapping = {
            'romance': 'Tình duyên / Hôn nhân',
            'friendship': 'Bạn bè',
            'parent_child': 'Cha mẹ - Con cái',
            'siblings': 'Anh chị em',
            'business': 'Đối tác kinh doanh',
            'colleague': 'Đồng nghiệp',
            'teacher_student': 'Thầy trò',
            'spiritual': 'Đạo hữu / Tâm linh',
            'rival': 'Đối thủ / Cạnh tranh',
            'boss_employee': 'Cấp trên - Cấp dưới'
        };
        const relationshipVN = relMapping[relationshipType] || relationshipType;

        return `Hãy phân tích độ tương hợp của mối quan hệ "${relationshipVN}" giữa hai người sau với sự đào sâu vào các chi tiết chuyên môn, chỉ ra các điểm xung đột cụ thể:
        
        THỜI ĐIỂM XEM (Hiện tại): ${currentDateTime}
        
        NGƯỜI 1 (Nam/Nữ: ${person1Ctx.isFemale ? 'Nữ' : 'Nam'}):
        - Bát Tự: ${person1Ctx.gans[0]} ${person1Ctx.zhis[0]} (Năm) | ${person1Ctx.gans[1]} ${person1Ctx.zhis[1]} (Tháng) | ${person1Ctx.gans[2]} ${person1Ctx.zhis[2]} (Ngày) | ${person1Ctx.gans[3]} ${person1Ctx.zhis[3]} (Giờ)
        - Nhật Chủ: ${person1Ctx.gans[2]} (Hành: ${person1Ctx.elements?.[person1Ctx.gans[2]] || ''})
        - Thập Thần: ${person1Ctx.ganShens?.join(', ')}
        - Nạp Âm: ${person1Ctx.nayin?.join(', ')}
        - Vòng Trường Sinh: ${person1Ctx.pillarStages?.join(', ')}
        - Ngũ Hành: Kim: ${person1Ctx.elements?.Kim || 0}, Mộc: ${person1Ctx.elements?.Moc || 0}, Thủy: ${person1Ctx.elements?.Thuy || 0}, Hỏa: ${person1Ctx.elements?.Hoa || 0}, Thổ: ${person1Ctx.elements?.Tho || 0}
        - Đại Vận hiện tại: ${dv1 ? `${dv1.can_chi} (${dv1.thap_than}) - ${dv1.luan_giai?.split('\n')[1] || ''}` : 'N/A'}
        
        NGƯỜI 2 (Nam/Nữ: ${person2Ctx.isFemale ? 'Nữ' : 'Nam'}):
        - Bát Tự: ${person2Ctx.gans[0]} ${person2Ctx.zhis[0]} (Năm) | ${person2Ctx.gans[1]} ${person2Ctx.zhis[1]} (Tháng) | ${person2Ctx.gans[2]} ${person2Ctx.zhis[2]} (Ngày) | ${person2Ctx.gans[3]} ${person2Ctx.zhis[3]} (Giờ)
        - Nhật Chủ: ${person2Ctx.gans[2]} (Hành: ${person2Ctx.elements?.[person2Ctx.gans[2]] || ''})
        - Thập Thần: ${person2Ctx.ganShens?.join(', ')}
        - Nạp Âm: ${person2Ctx.nayin?.join(', ')}
        - Vòng Trường Sinh: ${person2Ctx.pillarStages?.join(', ')}
        - Ngũ Hành: Kim: ${person2Ctx.elements?.Kim || 0}, Mộc: ${person2Ctx.elements?.Moc || 0}, Thủy: ${person2Ctx.elements?.Thuy || 0}, Hỏa: ${person2Ctx.elements?.Hoa || 0}, Thổ: ${person2Ctx.elements?.Tho || 0}
        - Đại Vận hiện tại: ${dv2 ? `${dv2.can_chi} (${dv2.thap_than}) - ${dv2.luan_giai?.split('\n')[1] || ''}` : 'N/A'}
        
        Yêu cầu: Viết bản luận giải thật chi tiết, sử dụng văn phong Bát Tự chuyên nghiệp (như một bậc thầy thực thụ), tập trung vào việc bóc tách các vấn đề thực tế giữa hai người. Trả về kết quả JSON chính xác.`;
    }
}

module.exports = new BaziAiService();

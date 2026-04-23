// ============================================================================
// NARRATIVE COMPOSER v6.0 — Combinatorial Essay Composition Engine
// Generates deep, multi-layered analytical essays with millions of variations
// ============================================================================

const dict = require('./dictionary');
const tamHopData = require('./data/tam_hop_narratives.json');
const specialFormations = require('./data/special_formations.json');
const shards = require('./data/shards.json');
const generalNarratives = require('./data/general_narratives.json');
const flavorPool = require('./data/flavor_pool.json');
const microEssays = require('./data/micro_essays.json');
const classicalPoetry = require('./data/classical_poetry.json');

// Deterministic random for consistent output
function seedHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function seededPick(arr, seed) {
    if (!arr || arr.length === 0) return "";
    return arr[seed % arr.length];
}

class NarrativeComposer {
    constructor(chart) {
        this.chart = chart;
        this._seed = seedHash(`${chart.solarDate}-${chart.time}-${chart.gender}`);
        
        // Chọn giọng văn dựa trên hạt giống (seed)
        const toneKeys = Object.keys(shards.tones);
        this.toneKey = toneKeys[this._seed % toneKeys.length];
        this.toneData = shards.tones[this.toneKey];

        // Đánh giá sơ bộ lá số để chọn flavor (positive/negative)
        this.isGenerallyPositive = this._evaluateChartVibe();
    }

    /**
     * Main entry: compose full narrative → InteractiveSegment[]
     */
    compose() {
        const segments = [];

        // Phase 0: Dẫn nhập & Bản mệnh (Harmony)
        segments.push(...this._composeIntroduction());

        // Phase 1: Tam hợp mệnh
        segments.push(...this._composeTamHopSection());

        // Phase 1.5: Cổ Phú (Classical Poetry)
        segments.push(...this._composePoeticInterpretations());

        // Phase 2: Mẫu người đặc biệt (Tang Tuế Điếu, v.v.)
        segments.push(...this._composeSpecialPersonality());

        // Phase 3: Thân cư & Hậu vận
        segments.push(...this._composeThanCu());

        // Phase 4: Thử thách & Bài học (Huynh Đệ, Nô Bộc, Quan Lộc)
        segments.push(...this._composeChallenges());

        // Phase 5: Đại vận tiêu biểu
        segments.push(...this._composeYearPredictions());

        // Phase 5.5: Deep Dives (Micro-Essays for special combos)
        segments.push(...this._composeDeepDives());

        // Phase 6: Cách cục đặc biệt + Tổng kết
        segments.push(...this._composeSpecialFormations());
        segments.push(...this._composeClosing());

        return segments;
    }

    /**
     * Evaluate if chart is generally well-supported or challenged
     */
    _evaluateChartVibe() {
        const menh = this.chart.palaces.find(p => p.name === "Mệnh");
        const goodCount = this._countGoodStars(menh);
        const badCount = this._countBadStars(menh);
        const harmony = this._getMenhCucHarmony();
        return (goodCount >= badCount) && (harmony !== "TuongKhac");
    }

    /**
     * Phase 0: Introduction and Basic Harmony (Menh/Cuc)
     */
    _composeIntroduction() {
        const segments = [];
        const pool = this.isGenerallyPositive ? flavorPool.opening_positive : flavorPool.opening_negative;
        const openingFlavor = seededPick(pool, this._seed);
        
        const harmonyType = this._getMenhCucHarmony();
        const harmonyVariants = generalNarratives.Harmony.MenhCuc[harmonyType];
        const harmonyText = seededPick(harmonyVariants, this._seed + 1);

        segments.push({ 
            text: `${openingFlavor} Xét về phối hợp căn bản, ${harmonyText}`, 
            tags: ["Tổng quan"],
            interactive: true 
        });

        return segments;
    }

    _getMenhCucHarmony() {
        if (this.chart.info.cucRelation) {
            if (this.chart.info.cucRelation.includes('sinh')) return "TuongSinh";
            if (this.chart.info.cucRelation.includes('khắc')) return "TuongKhac";
            return "DongHanh";
        }
        return "DongHanh";
    }

    // ========================================================================
    // PHASE 1: Tam hợp mệnh identification & narrative (Enriched v6.0)
    // ========================================================================
    _composeTamHopSection() {
        const segments = [];
        const menh = this.chart.palaces.find(p => p.name === "Mệnh");
        const menhIdx = menh.index;

        const connectedIndexes = [menhIdx, (menhIdx + 4) % 12, (menhIdx + 8) % 12, (menhIdx + 6) % 12];
        const connectedPalaces = connectedIndexes.map(idx => this.chart.palaces[idx]);
        const allMainStars = connectedPalaces.flatMap(p => p.majorStars.map(s => s.name));

        let bestMatch = null;
        let bestCount = 0;
        for (const [key, data] of Object.entries(tamHopData)) {
            const count = data.stars.filter(s => allMainStars.includes(s)).length;
            if (count > bestCount) {
                bestCount = count;
                bestMatch = data;
            }
        }

        if (bestMatch && bestCount >= 3) {
            const toneOpening = seededPick(this.toneData.openings, this._seed);
            const opening = seededPick(bestMatch.openings, this._seed + 2);
            const roles = seededPick(bestMatch.starRoles, this._seed + 3);
            const roles2 = seededPick(bestMatch.starRoles2, this._seed + 4);

            segments.push({ 
                text: `${toneOpening} ${opening}`, 
                tags: ["Tam hợp mệnh", bestMatch.title], 
                interactive: true 
            });
            segments.push({ text: roles, interactive: true });
            if (roles2) {
                segments.push({ text: roles2, interactive: true });
            }
        } else {
            const menhStarNames = menh.majorStars.map(s => `${s.name} (${s.brightness})`).join(", ");
            segments.push({
                text: `Đương số có cung Mệnh an tại ${menhStarNames}. Đây là tổ hợp sao mang lại cho đương số những đặc trưng riêng biệt trong tính cách và cuộc sống, định hình nên con người và hành trình phía trước.`,
                interactive: true
            });
        }

        return segments;
    }

    // ========================================================================
    // PHASE 2: Special personality (Enriched v6.0)
    // ========================================================================
    _composeSpecialPersonality() {
        const segments = [];
        const menh = this.chart.palaces.find(p => p.name === "Mệnh");
        const menhIdx = menh.index;
        const connectedIndexes = [menhIdx, (menhIdx + 4) % 12, (menhIdx + 8) % 12, (menhIdx + 6) % 12];
        const connectedPalaces = connectedIndexes.map(idx => this.chart.palaces[idx]);
        const allMinorStars = connectedPalaces.flatMap(p =>
            [...p.minorStars, ...p.adjectiveStars].map(s => s.name)
        );

        for (const [fKey, f] of Object.entries(specialFormations)) {
            if (!f.detectStars) continue;
            const searchIn = allMinorStars;
            const matched = f.detectStars.filter(s => searchIn.includes(s));

            if (matched.length >= (f.minMatch || 1)) {
                const text = seededPick(f.texts, this._seed + 5);
                const text2 = seededPick(f.texts2 || [], this._seed + 6);
                
                segments.push({ text: text, tags: [f.title], interactive: true });
                if (text2) {
                    segments.push({ text: text2, interactive: true });
                }
            }
        }

        return segments;
    }

    // ========================================================================
    // PHASE 3: Thân cư analysis (Enriched v6.0)
    // ========================================================================
    _composeThanCu() {
        const segments = [];
        const bodyPalace = this.chart.palaces.find(p => p.isBodyPalace);
        if (!bodyPalace) return segments;

        const variants = generalNarratives.ThanCu[bodyPalace.name];
        if (variants) {
            const text = seededPick(variants, this._seed + 7);
            segments.push({ 
                text: `Hơn nữa, xét về hậu vận, ${text}`, 
                tags: ["Thân cung", `Thân cư ${bodyPalace.name}`], 
                interactive: true 
            });
        }

        return segments;
    }

    // ========================================================================
    // PHASE 4: Challenges analysis (Enriched v6.0)
    // ========================================================================
    _composeChallenges() {
        const segments = [];
        const challengeParts = [];

        // Huynh Đệ
        const huynhDe = this.chart.palaces.find(p => p.name === "Huynh Đệ");
        if (huynhDe && this._countBadStars(huynhDe) >= 2) {
            challengeParts.push(seededPick(generalNarratives.Challenges.Siblings, this._seed + 8));
        }

        // Nô Bộc
        const noBoc = this.chart.palaces.find(p => p.name === "Nô Bộc");
        if (noBoc && this._countBadStars(noBoc) >= 2) {
            challengeParts.push(seededPick(generalNarratives.Challenges.Friends, this._seed + 9));
        }

        // Quan Lộc
        const quanLoc = this.chart.palaces.find(p => p.name === "Quan Lộc");
        if (quanLoc && this._countBadStars(quanLoc) >= 2) {
            challengeParts.push(seededPick(generalNarratives.Challenges.Career, this._seed + 10));
        }

        if (challengeParts.length > 0) {
            const connector = seededPick(shards.general.connectors, this._seed);
            segments.push({ 
                text: `${connector}trong hành trình cuộc sống, đương số cũng cần lưu tâm đến một số thử thách bài học: ${challengeParts.join(" ")}`, 
                interactive: true 
            });
        }

        return segments;
    }

    _countBadStars(palace) {
        const badNames = ["Địa Không", "Địa Kiếp", "Kình Dương", "Đà La", "Hỏa Tinh", "Linh Tinh", "Thiên Hình", "Bạch Hổ", "Kiếp Sát", "Hóa Kỵ"];
        const allStarNames = [...palace.minorStars, ...palace.adjectiveStars].map(s => s.name);
        return allStarNames.filter(n => badNames.includes(n)).length;
    }

    _countGoodStars(palace) {
        const goodNames = ["Văn Xương", "Văn Khúc", "Tả Phù", "Hữu Bật", "Thiên Khôi", "Thiên Việt", "Lộc Tồn", "Hồng Loan", "Thiên Hỷ", "Long Trì", "Phượng Các", "Giải Thần", "Thiên Mã", "Thanh Long", "Thiên Đức", "Nguyệt Đức"];
        const allStarNames = [...palace.minorStars, ...palace.adjectiveStars].map(s => s.name);
        return allStarNames.filter(n => goodNames.includes(n)).length;
    }

    // ========================================================================
    // PHASE 5: Year-specific predictions (Keep current logic but use flavor)
    // ========================================================================
    _composeYearPredictions() {
        const segments = [];
        let birthYear;
        try {
            birthYear = new Date(this.chart.solarDate).getFullYear();
        } catch (e) {
            return segments;
        }

        const sortedPalaces = [...this.chart.palaces].sort((a, b) => a.decadal.range[0] - b.decadal.range[0]);
        const now = new Date();
        const currentAge = now.getFullYear() - birthYear + 1;
        const currentDecade = sortedPalaces.find(p => currentAge >= p.decadal.range[0] && currentAge <= p.decadal.range[1]);
        const nextDecadeIdx = currentDecade ? sortedPalaces.indexOf(currentDecade) + 1 : 1;
        const relevantDecades = sortedPalaces.slice(Math.max(0, nextDecadeIdx - 1), nextDecadeIdx + 1);

        for (const decade of relevantDecades) {
            const startAge = decade.decadal.range[0];
            const endAge = decade.decadal.range[1];
            const startYear = birthYear + startAge - 1;
            const endYear = birthYear + endAge - 1;

            const minorStarNames = [...decade.minorStars, ...decade.adjectiveStars].map(s => s.name).slice(0, 4).join(", ");
            const hasBadStars = this._countBadStars(decade) >= 2;
            const hasGoodStars = this._countGoodStars(decade) >= 2;

            let yearText;
            if (hasBadStars && !hasGoodStars) {
                yearText = `Trong đại vận từ ${startAge} đến ${endAge} tuổi (${startYear}-${endYear}), cung ${decade.name} báo hiệu nhiều thử thách kịch liệt. Hội hợp các sao ${minorStarNames} cho thấy cần sự cẩn trọng tối đa trong các quyết định lớn.`;
            } else if (hasGoodStars) {
                yearText = `Đến giai đoạn ${startAge}-${endAge} tuổi (${startYear}-${endYear}), vận trình hanh thông hơn hẳn tại cung ${decade.name}. Đây là lúc thu hoạch thành quả nhờ hội hợp các sao cát tinh ${minorStarNames}.`;
            } else {
                yearText = `Tại đại vận ${startAge}-${endAge} tuổi, cung ${decade.name} cho thấy một sự ổn định cần thiết. Đây là giai đoạn để tích lũy nội tâm và chuẩn bị cho những bước đi dài hơi tiếp theo.`;
            }

            segments.push({ text: yearText, yearLink: startAge, interactive: true });
        }

        return segments;
    }

    // ========================================================================
    // PHASE 6: Special formations & Closings (Enriched v6.0)
    // ========================================================================
    _composeSpecialFormations() {
        const segments = [];
        // Keep checking Khoa Quyền Lộc, etc. but use variations
        const tuHoa = { Lộc: [], Quyền: [], Khoa: [], Kỵ: [] };
        this.chart.palaces.forEach(p => {
            p.majorStars.forEach(s => {
                if (s.mutagen && tuHoa[s.mutagen]) {
                    tuHoa[s.mutagen].push({ star: s.name, palace: p.name });
                }
            });
        });

        if (tuHoa.Khoa.length > 0 && tuHoa.Quyền.length > 0 && tuHoa.Lộc.length > 0) {
            const f = specialFormations.KhoaQuyenLoc;
            if (f) {
                const text = seededPick(f.texts, this._seed + 11);
                segments.push({ text: text, tags: ["Cách cục đặc biệt", "Khoa Quyền Lộc"], interactive: true });
            }
        }

        return segments;
    }

    _composeClosing() {
        const menh = this.chart.palaces.find(p => p.name === "Mệnh");
        const menhStars = menh.majorStars.map(s => s.name).join(", ");
        const toneOutcome = seededPick(this.toneData.outcomes, this._seed + 12);
        
        const variants = generalNarratives.Closings.Base;
        const closingBase = seededPick(variants, this._seed + 13);

        const pool = this.isGenerallyPositive ? flavorPool.closing_positive : flavorPool.closing_negative;
        const closingFlavor = seededPick(pool, this._seed + 14);

        return [{ 
            text: `${closingBase} ${closingFlavor} ${toneOutcome}`, 
            tags: ["Tổng kết"], 
            interactive: true 
        }];
    }

    // Help methods
    _composePoeticInterpretations() {
        const segments = [];
        const connectedStars = this._getConnectedStars();
        const majors = connectedStars.majors;

        const checkPoetry = (key, detectStars) => {
            if (detectStars.every(s => majors.includes(s))) {
                const p = classicalPoetry[key];
                if (p) {
                    segments.push({ text: `📜 CỔ PHÚ:\n_${p.verse}_`, tags: ["Cổ Phú"], interactive: true });
                    segments.push({ text: `**Diễn nghĩa:** ${p.interpretation}`, interactive: true });
                }
            }
        };

        checkPoetry("TuPhuVuTuong", ["Tử Vi", "Thiên Phủ"]);
        checkPoetry("SatPhaTham", ["Thất Sát", "Phá Quân", "Tham Lang"]);
        checkPoetry("CoNguyetDongLuong", ["Thiên Cơ", "Thái Âm", "Thiên Đồng", "Thiên Lương"]);

        return segments;
    }

    _composeDeepDives() {
        const segments = [];
        const connectedStars = this._getConnectedStars();
        const allStars = [...connectedStars.majors, ...connectedStars.minors];

        for (const [key, essay] of Object.entries(microEssays)) {
            const matched = essay.detectStars.filter(s => allStars.includes(s));
            if (matched.length >= essay.minMatch) {
                segments.push({ text: `🔍 PHÂN TÍCH: ${essay.title}`, tags: ["Deep Dive"], interactive: true });
                essay.paragraphs.forEach(p => segments.push({ text: p, interactive: true }));
            }
        }

        return segments;
    }

    _getConnectedStars() {
        const menh = this.chart.palaces.find(p => p.name === "Mệnh");
        const menhIdx = menh.index;
        const connectedIndexes = [menhIdx, (menhIdx + 4) % 12, (menhIdx + 8) % 12, (menhIdx + 6) % 12];
        const connectedPalaces = connectedIndexes.map(idx => this.chart.palaces[idx]);
        return {
            majors: connectedPalaces.flatMap(p => p.majorStars.map(s => s.name)),
            minors: connectedPalaces.flatMap(p => [...p.minorStars, ...p.adjectiveStars].map(s => s.name))
        };
    }
}

module.exports = NarrativeComposer;

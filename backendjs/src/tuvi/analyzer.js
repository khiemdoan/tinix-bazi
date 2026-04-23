// ============================================================================
// TUVI ANALYZER v6.0 - Enhanced Narrative Composition Engine
// Generates rich, multi-variant interpretations for all chart components
// ============================================================================

const dict = require('./dictionary');

// Load TiniX Ziwei DB v3.0 (Enriched)
const db144Cuc = require('./data/144_cuc.json');
const dbPhuTinh = require('./data/phu_tinh.json');
const dbPhiTinh = require('./data/phi_tinh.json');

// Load Multi-layer Composition Data v6.0 (Sharding Architecture)
const starLayers = require('./data/star_layers.json');
const flavorPool = require('./data/flavor_pool.json');
const majorPatterns = require('./data/major_patterns.json');
const generalNarratives = require('./data/general_narratives.json');
const specialFormations = require('./data/special_formations.json');
const classicalPoetry = require('./data/classical_poetry.json');
const NarrativeComposer = require('./narrative_composer');
const HoroscopeComposer = require('./horoscope_composer');
const shards = require('./data/shards.json');

function seedHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return Math.abs(hash);
}

function seededPick(arr, seed) {
    if (!arr || arr.length === 0) return "";
    return arr[seed % arr.length];
}

/**
 * Multi-layer Star Text Composer v6.0 (The "Deep Shard" Engine)
 */
function assembleShardText(starName, seed) {
    const starShards = shards.star_atoms[starName];
    if (!starShards) return "";

    const opening = seededPick(shards.general.openings, seed);
    const action = seededPick(starShards.actions, seed + 1);
    const quality = seededPick(starShards.qualities, seed + 2);
    const outcome = seededPick(starShards.outcomes, seed + 3);

    return `${opening} ${action} ${quality} và ${outcome}`;
}

function composeStarText(starName, brightness, palaceName, gender, fiveElements, seed) {
    const layer = starLayers[starName];
    if (!layer) return null;

    let parts = [];
    
    // Layer 0: Base
    if (layer.base) parts.push(layer.base);
    
    // Layer 1: Brightness
    if (layer.brightness) {
        const bKey = brightness || "Bình";
        const bArr = layer.brightness[bKey] || layer.brightness["Bình"] || [];
        if (bArr.length > 0) parts.push(seededPick(bArr, seed));
    }

    // Layer 2: Palace context
    if (layer.palace && layer.palace[palaceName]) {
        const pArr = layer.palace[palaceName];
        parts.push(seededPick(pArr, seed + 1));
    }

    // Layer 3: Five Elements overlay
    if (layer.fiveElements && fiveElements && layer.fiveElements[fiveElements]) {
        parts.push(layer.fiveElements[fiveElements]);
    }

    // Layer 4: Gender
    if (layer.gender && gender) {
        const gKey = gender === "女" || gender === "Nữ" || gender === "female" ? "Nữ" : "Nam";
        const gArr = layer.gender[gKey];
        if (gArr && gArr.length > 0) parts.push(seededPick(gArr, seed + 2));
    }

    // Layer 5: Variation Shards
    const variationShard = assembleShardText(starName, seed + 10);
    if (variationShard) parts.push(variationShard);

    return parts.join(" ");
}

class TuViAnalyzer {
    constructor(chart) {
        this.chart = chart;
        this.interpretations = {};
        this._seed = seedHash(`${chart.solarDate}-${chart.time}-${chart.gender}`);
    }

    interpret(horoscopeDate = null) {
        // 1. Core Palace Analysis
        const palacesToAnalyze = ["Mệnh", "Tài Bạch", "Quan Lộc", "Phụ Mẫu", "Phúc Đức", "Nô Bộc", "Thiên Di", "Huynh Đệ", "Điền Trạch", "Tử Nữ", "Phu Thê", "Tật Ách"];
        this.interpretations.natal = {};
        
        palacesToAnalyze.forEach(pName => {
            const palace = this.chart.palaces.find(p => p.name === pName);
            if (palace) {
                const strings = this._analyzePalace(palace);
                this.interpretations.natal[pName] = strings.map(s => ({ text: s }));
            }
        });

        // 2. Summary Patterns
        this.interpretations.natal["Cách Cục"] = this._analyzeCachCuc().map(s => ({ text: s }));
        
        // 3. NARRATIVE COMPOSER v6.0 - Combinatorial Essays
        const composer = new NarrativeComposer(this.chart);
        const narrativeSegments = composer.compose();
        if (narrativeSegments.length > 0) {
            this.interpretations.natal["Phân Tích Chuyên Sâu"] = narrativeSegments;
        }

        // 4. Decades & Horoscope
        this.interpretations.decades = this._analyzeDecades();
        this.interpretations.yearlyCycle = this._analyzeYearlyCycle();
        this.interpretations.monthlyCycle = this._analyzeMonthlyCycle();
        this.interpretations.dailyTrend = this._analyzeDailyTrend();
        
        if (horoscopeDate) {
            this.interpretations.horoscope = this._analyzeHoroscope(horoscopeDate);
        }

        // 5. Advanced Insights & Scores
        this.interpretations.advanced = this._analyzeAdvancedInsights();
        this.interpretations.palaceScores = this._calculatePalaceScores();

        // 6. Chuyên Đề (Special Topics)
        this.interpretations.topics = this._analyzeSpecialTopics();
        
        return this.interpretations;
    }

    _analyzePalace(palace) {
        const palaceSeed = this._seed + palace.index;
        let texts = [];

        const palaceIntro = seededPick(shards.general.openings, palaceSeed);
        const palaceMeaning = dict.DecadalMeanings[palace.name] || `Cung ${palace.name} đại diện cho những khía cạnh quan trọng liên quan đến cuộc sống và vận mệnh của đương số.`;
        
        texts.push(`${palaceIntro} khi xét đến cung **${palace.name}**, chúng ta đang chạm đến cung vị chủ về: ${palaceMeaning}`);

        let composedAny = false;
        palace.majorStars.forEach((sao, idx) => {
            const composed = composeStarText(sao.name, sao.brightness, palace.name, this.chart.gender, this.chart.fiveElementsClass, palaceSeed + idx);
            if (composed) {
                const connector = seededPick(shards.general.connectors, palaceSeed + idx + 10);
                texts.push(`**Sao ${sao.name} (${sao.brightness}):** ${connector} ${composed}`);
                composedAny = true;
            }
        });

        if (!composedAny) {
            if (palace.majorStars.length === 0) {
                texts.push(`**Cung ${palace.name} Vô Chính Diệu:** Đây là cách cục 'trống rỗng', khiến tính chất của cung bị ảnh hưởng mạnh mẽ bởi cung đối diện chiếu về. Đương số cần sự linh hoạt để thích nghi.`);
            } else {
                palace.majorStars.forEach(sao => {
                    const saoInfo = dict.MajorStars[sao.name];
                    if (saoInfo) texts.push(`**Sao ${sao.name} (${sao.brightness}):** ${saoInfo.general}`);
                });
            }
        }

        const allStars = [...palace.minorStars, ...palace.adjectiveStars];
        allStars.forEach(sao => {
            // Check in dbPhuTinh first
            const phuVariants = dbPhuTinh.LucSat?.[sao.name] || dbPhuTinh.LucCat?.[sao.name] || dbPhuTinh.DaoHoa?.[sao.name];
            if (phuVariants && Array.isArray(phuVariants)) {
                texts.push(`- **${sao.name}:** ${seededPick(phuVariants, palaceSeed)}`);
            } else if (dict.GoodStars[sao.name] || dict.BadStars[sao.name]) {
                texts.push(`- **${sao.name}:** ${dict.GoodStars[sao.name] || dict.BadStars[sao.name]}`);
            }
        });

        // 3. Phi Tinh Tứ Hóa analysis (Simplified integration)
        palace.majorStars.forEach(s => {
            if (s.mutagen) {
                const key = `${s.name}_${s.mutagen}`;
                const phiVariants = dbPhiTinh[key];
                if (phiVariants && Array.isArray(phiVariants)) {
                    texts.push(`**Phi Tinh:** ${seededPick(phiVariants, palaceSeed)}`);
                }
            }
        });

        return texts;
    }

    _analyzeAdvancedInsights() {
        const insights = { harmony: null, bodyPalace: null, obstructions: [], natalTuHoa: { Lộc: [], Quyền: [], Khoa: [], Kỵ: [] } };
        const branchElements = { "Tý": "Thủy", "Hợi": "Thủy", "Dần": "Mộc", "Mão": "Mộc", "Tỵ": "Hỏa", "Ngọ": "Hỏa", "Thân": "Kim", "Dậu": "Kim", "Thìn": "Thổ", "Tuất": "Thổ", "Sửu": "Thổ", "Mùi": "Thổ" };
        
        const menhPalace = this.chart.palaces.find(p => p.name === "Mệnh");
        const menhElem = branchElements[menhPalace.earthlyBranch];
        const cucStr = this.chart.fiveElementsClass;
        const cucElemMatch = cucStr.match(/Kim|Mộc|Thủy|Hỏa|Thổ/);
        const cucElem = cucElemMatch ? cucElemMatch[0] : null;

        if (this.chart.info.cucRelation) {
            insights.harmony = { 
                title: `Mệnh & Cục (${this.chart.info.yangYinDesc})`, 
                description: `${this.chart.info.cucRelation}. ${this.chart.info.yangYinDesc}.` 
            };
        }

        const bodyPalace = this.chart.palaces.find(p => p.isBodyPalace);
        if (bodyPalace) {
            const variants = generalNarratives.ThanCu[bodyPalace.name];
            insights.bodyPalace = { 
                title: `Thân cư ${bodyPalace.name}`, 
                description: seededPick(variants, this._seed + 1) 
            };
        }

        this.chart.palaces.forEach(p => {
            const sn = [...p.majorStars, ...p.minorStars, ...p.adjectiveStars].map(s => s.name);
            if (sn.includes("Triệt Lộ") || sn.includes("Triệt Không")) insights.obstructions.push(`**Cung ${p.name}:** Bị Triệt.`);
            if (sn.includes("Tuần Không")) insights.obstructions.push(`**Cung ${p.name}:** Bị Tuần.`);
        });

        this.chart.palaces.forEach(p => {
            p.majorStars.forEach(s => {
                if (s.mutagen && insights.natalTuHoa[s.mutagen]) insights.natalTuHoa[s.mutagen].push({ star: s.name, palace: p.name });
            });
        });

        return insights;
    }

    _isSinh(a, b) {
        const sinh = { "Thủy": "Mộc", "Mộc": "Hỏa", "Hỏa": "Thổ", "Thổ": "Kim", "Kim": "Thủy" };
        return sinh[a] === b;
    }

    _isKhac(a, b) {
        const khac = { "Thủy": "Hỏa", "Hỏa": "Kim", "Kim": "Mộc", "Mộc": "Thổ", "Thổ": "Thủy" };
        return khac[a] === b;
    }

    _analyzeCachCuc() {
        const texts = [];
        
        // Find Mệnh and its Tam Hợp (Tài, Quan) + Xung chiếu (Di)
        const menhPalace = this.chart.palaces.find(p => p.name === "Mệnh");
        const taiPalace = this.chart.palaces.find(p => p.name === "Tài Bạch");
        const quanPalace = this.chart.palaces.find(p => p.name === "Quan Lộc");
        const diPalace = this.chart.palaces.find(p => p.name === "Thiên Di");

        const targetPalaces = [menhPalace, taiPalace, quanPalace, diPalace].filter(Boolean);
        
        const menhStarsSet = new Set();
        const clusterStarsSet = new Set();
        
        if (menhPalace) {
            menhPalace.majorStars.concat(menhPalace.minorStars, menhPalace.adjectiveStars)
                .forEach(s => {
                    menhStarsSet.add(s.name);
                    clusterStarsSet.add(s.name);
                });
        }
        
        targetPalaces.forEach(p => {
            p.majorStars.concat(p.minorStars, p.adjectiveStars).forEach(s => {
                clusterStarsSet.add(s.name);
            });
        });

        // 1. Check Classical Poetry
        const poetryKeys = Object.keys(classicalPoetry);
        let poetryFound = false;
        
        for (const key of poetryKeys) {
            let matched = false;
            if (key === "TuPhuVuTuong" && clusterStarsSet.has("Tử Vi") && clusterStarsSet.has("Thiên Phủ") && clusterStarsSet.has("Vũ Khúc") && clusterStarsSet.has("Thiên Tướng")) matched = true;
            if (key === "SatPhaTham" && clusterStarsSet.has("Thất Sát") && clusterStarsSet.has("Phá Quân") && clusterStarsSet.has("Tham Lang")) matched = true;
            if (key === "CoNguyetDongLuong" && clusterStarsSet.has("Thiên Cơ") && clusterStarsSet.has("Thái Âm") && clusterStarsSet.has("Thiên Đồng") && clusterStarsSet.has("Thiên Lương")) matched = true;
            if (key === "CuNhatDongCung" && menhStarsSet.has("Cự Môn") && menhStarsSet.has("Thái Dương")) matched = true;
            if (key === "NhatNguyetTranhHuy" && menhStarsSet.has("Thái Dương") && menhStarsSet.has("Thái Âm")) matched = true;
            if (key === "ThamVuDongHanh" && menhStarsSet.has("Tham Lang") && menhStarsSet.has("Vũ Khúc")) matched = true;
            
            if (matched) {
                const poetry = classicalPoetry[key];
                texts.push(`> **Phú Giao Khúc:**\n> *${poetry.verse.replace(/\\n/g, '*\n> *')}*\n\n**Luận cổ:** ${poetry.interpretation}\n\n**Ứng dụng hiện đại:** ${poetry.modern_context}`);
                poetryFound = true;
                break; // Only pick one primary poem
            }
        }

        // 2. Scan Special Formations
        const formationsArr = Object.values(specialFormations);
        let formationFoundCount = 0;
        
        for (const fm of formationsArr) {
            let matchCount = 0;
            if (fm.detectStars) {
                fm.detectStars.forEach(s => {
                    if (clusterStarsSet.has(s)) matchCount++;
                });
                
                if (matchCount >= fm.minMatch) {
                    texts.push(`### 🔮 ${fm.title}`);
                    if (fm.texts) texts.push(fm.texts.join(" "));
                    if (fm.texts2) texts.push(fm.texts2.join(" "));
                    formationFoundCount++;
                }
            } else if (fm.id === "KhoaQuyenLoc") {
                if (clusterStarsSet.has("Hóa Khoa") && clusterStarsSet.has("Hóa Quyền") && clusterStarsSet.has("Hóa Lộc")) {
                    texts.push(`### 🔮 ${fm.title}`);
                    if (fm.texts) texts.push(fm.texts.join(" "));
                    if (fm.texts2) texts.push(fm.texts2.join(" "));
                    formationFoundCount++;
                }
            } else if (fm.id === "LocTonHoaLoc") {
                if (menhStarsSet.has("Lộc Tồn") && menhStarsSet.has("Hóa Lộc")) {
                    texts.push(`### 🔮 ${fm.title}`);
                    if (fm.texts) texts.push(fm.texts.join(" "));
                    formationFoundCount++;
                }
            }
        }
        
        if (texts.length === 0) {
            texts.push(seededPick(majorPatterns.GeneralClosing.texts, this._seed));
        }

        return texts;
    }

    _analyzeDecades() {
        const sortedPalaces = this.chart.palaces.sort((a,b) => a.decadal.range[0] - b.decadal.range[0]);
        
        return sortedPalaces.map(p => {
            const seed = this._seed + p.index;
            let interpretation = this._composeDetailedDecade(p, seed);
            
            return {
                startAge: p.decadal.range[0], 
                endAge: p.decadal.range[1], 
                range: `${p.decadal.range[0]}-${p.decadal.range[1]} tuổi`,
                palaceName: p.name, 
                stars: [...p.majorStars, ...p.minorStars].map(s => s.name), 
                meaning: interpretation || dict.DecadalMeanings[p.name] || "Giai đoạn này tài lộc vận trình có nhiều biến động đáng chú ý."
            };
        });
    }

    _composeDetailedDecade(p, seed) {
        const palaceName = p.name;
        let parts = [];

        // 1. Theme opening
        const theme = dict.DecadalMeanings[palaceName] || `Đại vận tại cung ${palaceName}`;
        parts.push(theme);

        // 2. Major Stars analysis
        if (p.majorStars.length > 0) {
            p.majorStars.forEach((s, idx) => {
                const layer = starLayers[s.name];
                if (layer && layer.palace && layer.palace[palaceName]) {
                    parts.push(seededPick(layer.palace[palaceName], seed + idx));
                } else if (layer && layer.brightness && layer.brightness[s.brightness]) {
                    parts.push(seededPick(layer.brightness[s.brightness], seed + idx));
                }
            });
        } else {
            parts.push("Đây là một đại vận Vô Chính Diệu, cuộc đời có nhiều biến động khó lường, cần nương tựa vào các sao ở cung xung chiếu để định hình vận trình.");
        }

        return parts.join(" ");
    }

    _analyzeHoroscope(date) {
        const horo = this.chart.horoscope(date);
        const composer = new HoroscopeComposer(this.chart);

        return {
            yearly: {
                title: `Lưu Niên năm ${horo.yearly.heavenlyStem} ${horo.yearly.earthlyBranch}`,
                texts: composer.composeYearly(horo.yearly)
            },
            monthly: {
                title: `Lưu Nguyệt tháng ${horo.monthly.heavenlyStem} ${horo.monthly.earthlyBranch}`,
                texts: composer.composeMonthly(horo.monthly)
            },
            daily: {
                title: `Lưu Nhật ngày ${horo.daily.heavenlyStem} ${horo.daily.earthlyBranch}`,
                texts: composer.composeDaily(horo.daily, date),
                nhatHan: composer.composeDailyHan(horo.daily, date)
            }
        };
    }

    _analyzeYearlyCycle() {
        const results = [];
        const now = new Date();
        const composer = new HoroscopeComposer(this.chart);
        const allScores = this._calculatePalaceScores();

        for (let i = 0; i < 12; i++) {
            const targetDate = new Date(now);
            targetDate.setFullYear(now.getFullYear() + i);
            
            const horo = this.chart.horoscope(targetDate);
            const natalPalace = this.chart.palaces[horo.yearly.index];
            const pScore = allScores.find(s => s.name === natalPalace.name)?.score || 50;
            
            results.push({
                year: targetDate.getFullYear(),
                heavenlyStem: horo.yearly.heavenlyStem,
                earthlyBranch: horo.yearly.earthlyBranch,
                palaceName: natalPalace.name,
                score: pScore,
                texts: composer.composeYearly(horo.yearly)
            });
        }
        return results;
    }

    _calculatePalaceScores() {
        const scores = [];
        const brightnessValues = { "Miếu": 60, "Vượng": 50, "Đắc": 40, "Lợi": 30, "Bình": 25, "Bất": 20, "Hãm": 10 };
        const goodStars = ["Văn Xương", "Văn Khúc", "Tả Phù", "Hữu Bật", "Thiên Khôi", "Thiên Việt", "Lộc Tồn", "Hồng Loan", "Thiên Hỷ", "Đào Hoa", "Thiên Mã", "Long Trì", "Phượng Các", "Giải Thần", "Thanh Long", "Thiên Quan", "Thiên Phúc"];
        const badStars = ["Địa Không", "Địa Kiếp", "Kình Dương", "Đà La", "Hỏa Tinh", "Linh Tinh", "Thiên Hình", "Hóa Kỵ", "Kiếp Sát", "Bạch Hổ"];

        this.chart.palaces.forEach(p => {
            let score = 0;
            if (p.majorStars.length > 0) {
                p.majorStars.forEach(s => {
                    score += brightnessValues[s.brightness] || 25;
                    if (s.mutagen === "Lộc" || s.mutagen === "Quyền" || s.mutagen === "Khoa") score += 10;
                    if (s.mutagen === "Kỵ") score -= 15;
                });
                score = score / p.majorStars.length;
            } else {
                score = 30;
            }

            const starsNames = [...p.minorStars, ...p.adjectiveStars].map(s => s.name);
            starsNames.forEach(name => {
                if (goodStars.includes(name)) score += 5;
                if (badStars.includes(name)) score -= 8;
            });
            score = Math.max(10, Math.min(95, score));
            scores.push({ name: p.name, score: Math.round(score) });
        });
        return scores;
    }

    _analyzeMonthlyCycle() {
        const { Solar, Lunar } = require('lunar-javascript');
        const results = [];
        const now = new Date();
        const solarYear = now.getFullYear();
        const composer = new HoroscopeComposer(this.chart);
        const allScores = this._calculatePalaceScores();
        const LUNAR_MONTH_NAMES = ["Giêng", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Mười Một", "Chạp"];

        // Use lunar-javascript for fast lunar date lookup (instead of 380x astro.bySolar calls)
        // Find the Lunar New Year date for the current solar year
        let lunarNewYear;
        try {
            lunarNewYear = Lunar.fromYmd(solarYear, 1, 1);
        } catch(e) {
            // If the lunar year doesn't match, try the previous year
            lunarNewYear = Lunar.fromYmd(solarYear - 1, 1, 1);
        }
        const currentLunarYear = lunarNewYear.getYear();
        const lunarNewYearSolar = lunarNewYear.getSolar();

        // Build month boundaries using lunar-javascript (near instant)
        let monthStarts = [];
        for (let m = 1; m <= 12; m++) {
            try {
                const firstDay = Lunar.fromYmd(currentLunarYear, m, 1);
                const solar = firstDay.getSolar();
                monthStarts.push({
                    index: m,
                    name: LUNAR_MONTH_NAMES[m - 1],
                    startDate: new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay()),
                    isLeap: false
                });
            } catch(e) { /* skip invalid month */ }
        }

        // Check for leap month
        try {
            const lunarYear = require('lunar-javascript').LunarYear.fromYear(currentLunarYear);
            const leapMonth = lunarYear.getLeapMonth();
            if (leapMonth > 0) {
                const firstDay = Lunar.fromYmd(currentLunarYear, -leapMonth, 1); // negative = leap
                const solar = firstDay.getSolar();
                // Insert leap month after the regular month
                const insertIdx = monthStarts.findIndex(ms => ms.index === leapMonth) + 1;
                monthStarts.splice(insertIdx, 0, {
                    index: leapMonth,
                    name: LUNAR_MONTH_NAMES[leapMonth - 1],
                    startDate: new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay()),
                    isLeap: true
                });
            }
        } catch(e) { /* no leap month this year */ }

        // Sort by startDate just to be safe
        monthStarts.sort((a, b) => a.startDate - b.startDate);

        // Process each month
        monthStarts.forEach((m, idx) => {
            const nextMonth = monthStarts[idx + 1];
            const endDate = nextMonth ? new Date(nextMonth.startDate) : null;
            if (endDate) endDate.setDate(endDate.getDate() - 1);

            const midDate = new Date(m.startDate);
            midDate.setDate(midDate.getDate() + 14); 

            const horo = this.chart.horoscope(midDate);
            const natalPalace = this.chart.palaces[horo.monthly.index];
            const pScore = allScores.find(s => s.name === natalPalace.name)?.score || 50;

            results.push({
                index: m.index,
                name: m.name,
                year: currentLunarYear,
                isLeap: m.isLeap,
                solarRange: {
                    start: m.startDate.toISOString().split('T')[0],
                    end: endDate ? endDate.toISOString().split('T')[0] : null
                },
                score: pScore,
                texts: composer.composeMonthly(horo.monthly)
            });
        });

        return results;
    }

    _analyzeDailyTrend() {
        const results = [];
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const allScores = this._calculatePalaceScores();
        const composer = new HoroscopeComposer(this.chart);

        for (let i = 0; i < 31; i++) {
            const targetDate = new Date(startOfMonth);
            targetDate.setDate(targetDate.getDate() + i);
            
            if (targetDate.getMonth() !== now.getMonth()) break;

            const dateStr = targetDate.toISOString().split('T')[0];
            const horo = this.chart.horoscope(targetDate);
            const natalPalace = this.chart.palaces[horo.daily.index];
            const pScore = allScores.find(s => s.name === natalPalace.name)?.score || 50;

            results.push({
                date: dateStr,
                day: targetDate.getDate(),
                score: pScore,
                branch: horo.daily.earthlyBranch,
                title: `Lưu Nhật ngày ${horo.daily.heavenlyStem} ${horo.daily.earthlyBranch}`,
                texts: composer.composeDaily(horo.daily, dateStr),
                nhatHan: composer.composeDailyHan(horo.daily, dateStr)
            });
        }
        return results;
    }

    _analyzeSpecialTopics() {
        const topics = {};
        const adv = this.interpretations.advanced;

        // 1. Bản Mệnh & Cục Số
        if (adv.harmony) {
            topics["Bản Mệnh & Cục Số"] = [{ text: `**${adv.harmony.title}**: ${adv.harmony.description}` }];
        }

        // 2. Cung Thân
        if (adv.bodyPalace) {
            topics["Đặc tính Hậu vận (Cung Thân)"] = [{ text: `**${adv.bodyPalace.title}**: ${adv.bodyPalace.description}` }];
        }

        // 3. Tài chính & Sự nghiệp (Quan Lộc + Tài Bạch)
        const quanPalace = this.chart.palaces.find(p => p.name === "Quan Lộc");
        const taiPalace = this.chart.palaces.find(p => p.name === "Tài Bạch");
        if (quanPalace && taiPalace) {
            let careerTexts = [];
            
            // Check main combination in Career Palace
            const mainStars = quanPalace.majorStars.map(s => s.name).sort().join("");
            const combination = db144Cuc[mainStars]?.[quanPalace.earthlyBranch] || db144Cuc[quanPalace.majorStars[0]?.name]?.[quanPalace.earthlyBranch];
            if (combination) careerTexts.push(`**Xu hướng Sự nghiệp:** ${combination}`);

            // Wealth analysis
            const wealthStars = taiPalace.majorStars.map(s => s.name).join(", ") || "Vô Chính Diệu";
            careerTexts.push(`**Về Tài lộc:** Tại cung Tài Bạch hội hợp bộ sao **${wealthStars}**. Đây là cách cục chỉ ra tiềm năng kinh tế ${seededPick(flavorPool.Career, this._seed)}.`);

            topics["Sự nghiệp & Tài lộc"] = careerTexts.map(t => ({ text: t }));
        }

        // 4. Tình duyên & Hôn nhân (Phu Thê)
        const phuPalace = this.chart.palaces.find(p => p.name === "Phu Thê");
        if (phuPalace) {
            let phuTexts = [];
            const phuStars = phuPalace.majorStars.map(s => s.name).sort().join("");
            const combination = db144Cuc[phuStars]?.[phuPalace.earthlyBranch] || db144Cuc[phuPalace.majorStars[0]?.name]?.[phuPalace.earthlyBranch];
            
            if (combination) phuTexts.push(`**Cơ duyên Hôn nhân:** ${combination}`);
            
            // Check for Peach Blossom stars
            const starsNames = [...phuPalace.minorStars, ...phuPalace.adjectiveStars].map(s => s.name);
            if (starsNames.includes("Đào Hoa") || starsNames.includes("Hồng Loan")) {
                phuTexts.push("Lá số của bạn cho thấy cung Phu Thê có sự xuất hiện của Đào Hồng, chủ về người bạn đời duyên dáng hoặc hôn nhân có sự lãng mạn, khởi sắc.");
            }
            
            topics["Tình duyên & Gia đạo"] = phuTexts.map(t => ({ text: t }));
        }

        // 5. Sức khỏe & Bình an (Tật Ách)
        const tatPalace = this.chart.palaces.find(p => p.name === "Tật Ách");
        if (tatPalace) {
            let healthTexts = [];
            healthTexts.push(`**Về Thân tâm:** Cung Tật Ách an tại **${tatPalace.earthlyBranch}**, đây là một phần quan trọng chỉ ra nhịp điệu sinh học của bạn.`);
            
            tatPalace.majorStars.forEach(s => {
                const layer = starLayers[s.name];
                if (layer && layer.palace && layer.palace["Tật Ách"]) {
                    healthTexts.push(`- **${s.name}:** ${seededPick(layer.palace["Tật Ách"], this._seed)}`);
                }
            });

            topics["Sức khỏe & Bình an"] = healthTexts.map(t => ({ text: t }));
        }

        // 6. Tuần - Triệt & Tứ Hóa
        if (adv.obstructions.length > 0) {
            topics["Tuần Không - Triệt Lộ"] = [
                { text: "Trong tử vi, Tuần Không và Triệt Lộ đóng vai trò như những chướng ngại vật hay lực cản mang tính chu kỳ hoặc định mệnh." },
                ...adv.obstructions.map(o => ({ text: o }))
            ];
        }

        return topics;
    }
}

module.exports = TuViAnalyzer;

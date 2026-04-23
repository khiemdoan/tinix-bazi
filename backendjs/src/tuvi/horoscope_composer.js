// ============================================================================
// HOROSCOPE COMPOSER v4.0 — Natal-Integrated Narrative Engine
// Generates millions of unique variations for Yearly, Monthly, and Daily fortunes
// based on direct interaction with the user's Natal Chart.
// ============================================================================

const narratives = require('./data/horoscope_narratives.json');
const shards = require('./data/shards.json');
const horoscopeShards = require('./data/horoscope_shards.json');
const dict = require('./dictionary');

/**
 * Deterministic seed for consistent output
 */
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

class HoroscopeComposer {
    constructor(chart) {
        this.chart = chart;
        // Base seed from birth chart
        this.baseSeed = seedHash(`${chart.solarDate}-${chart.time}-${chart.gender}`);
    }

    /**
     * Compose Yearly (Lưu Niên) narrative
     */
    composeYearly(yearlyData) {
        if (!yearlyData) return [];
        const segments = [];
        const yearSeed = this.baseSeed + seedHash(`${yearlyData.heavenlyStem}-${yearlyData.earthlyBranch}`);

        // 1. Dẫn nhập (Opening)
        const opening = seededPick(horoscopeShards.openings, yearSeed);
        const stemMeaning = horoscopeShards.stems[yearlyData.heavenlyStem];
        const branchMeaning = horoscopeShards.branches[yearlyData.earthlyBranch];

        segments.push({ 
            text: `${opening} năm **${yearlyData.heavenlyStem} ${yearlyData.earthlyBranch}** mang năng lượng của Thiên Can ${yearlyData.heavenlyStem} (${stemMeaning}) và Địa Chi ${yearlyData.earthlyBranch} (${branchMeaning}).`,
            interactive: true
        });

        // 2. Phân tích Cung Vận (Palace Theme)
        const currentYearPalaceName = yearlyData.palaceNames[yearlyData.index];
        const palaceVariants = narratives.Yearly.PalaceThemes[currentYearPalaceName];
        const palaceText = palaceVariants ? seededPick(palaceVariants, yearSeed + 1) : "";

        segments.push({ 
            text: `Vận trình năm nay của bạn an tại cung **${currentYearPalaceName}**. ${palaceText}`,
            interactive: true
        });

        // 3. Phân tích Tứ Hóa Lưu Niên (Yearly Mutagens)
        if (yearlyData.mutagen && yearlyData.mutagen.length === 4) {
            const labels = ["Lộc", "Quyền", "Khoa", "Kỵ"];
            let mutagenNarratives = [];

            yearlyData.mutagen.forEach((starName, idx) => {
                const label = labels[idx];
                const variants = narratives.Yearly.MutagenNarratives[label];
                if (variants) {
                    const text = seededPick(variants, yearSeed + idx + 5);
                    mutagenNarratives.push(`Sao **${starName}** nhận Hóa **${label}**: ${text}`);
                }
            });
            
            if (mutagenNarratives.length > 0) {
                segments.push({ 
                    text: `**Biến động Tứ Hóa:** ${mutagenNarratives.join(" ")}`, 
                    interactive: true 
                });
            }
        }

        // 4. Phân tích các Sao Lưu Quan Trọng (Yearly Stars)
        let starInsights = [];
        yearlyData.stars.forEach((starsInPalace, idx) => {
            const pNameInYear = yearlyData.palaceNames[idx];
            starsInPalace.forEach(s => {
                const variants = narratives.Yearly.StarNarratives[s.name];
                if (variants) {
                    const text = seededPick(variants, yearSeed + idx + 10);
                    starInsights.push(`Tại cung **${pNameInYear}** hội hợp sao **${s.name}**: ${text}`);
                }
            });
        });

        if (starInsights.length > 0) {
            // Pick top 4 most interesting star insights
            const selectedStars = starInsights.sort(() => 0.5 - Math.random()).slice(0, 4);
            segments.push({ 
                text: selectedStars.join(" "), 
                interactive: true 
            });
        }

        // 5. Star Interactions (New Layer)
        this._addStarInteractions(yearlyData.stars[yearlyData.index] || [], yearSeed + 50, segments);

        // 6. Kết luận vận năm
        const closing = seededPick(horoscopeShards.closings, yearSeed + 99);
        segments.push({ text: `${this._addTransition(yearSeed + 60)} Tổng kết vận trình năm nay, ${closing}`, interactive: true });

        return segments;
    }

    /**
     * Compose Monthly (Lưu Nguyệt) narrative
     */
    composeMonthly(monthlyData) {
        if (!monthlyData) return [];
        const monthSeed = this.baseSeed + seedHash(`${monthlyData.heavenlyStem}-${monthlyData.earthlyBranch}`);
        
        const natalPalace = this.chart.palaces[monthlyData.index];
        const palaceName = monthlyData.palaceNames[monthlyData.index];
        const segments = [];

        // 1. Dẫn nhập & Năng lượng Bản mệnh
        const palaceTheme = dict.DecadalMeanings[palaceName] || `tác động đến phương diện ${palaceName}`;
        segments.push({ 
            text: `Trong tháng **${monthlyData.heavenlyStem} ${monthlyData.earthlyBranch}**, nhịp sống của bạn xoay quanh cung **${palaceName}** bản mệnh. Hệ quả vận trình sẽ hướng tới chủ đề: ${palaceTheme}.`,
            interactive: true
        });

        // 2. Tương tác Sao Gốc & Sao Lưu
        const natalStars = [...natalPalace.majorStars, ...natalPalace.minorStars];
        const activeStars = monthlyData.stars[monthlyData.index] || []; 
        let interactionTexts = [];
        let monthVibe = 0;

        if (monthlyData.mutagen && monthlyData.mutagen.length === 4) {
            const labels = ["Lộc", "Quyền", "Khoa", "Kỵ"];
            monthlyData.mutagen.forEach((starName, idx) => {
                const label = labels[idx];
                const isAtPalace = activeStars.some(s => s.name === starName);
                const isNatal = natalStars.some(ns => ns.name === starName);

                if (isAtPalace) {
                    if (idx === 3) monthVibe -= 2; // Kỵ
                    else monthVibe += 1;

                    if (isNatal) {
                        interactionTexts.push(`Sao bản mệnh **${starName}** đón nhận Hóa **${label}**, kích hoạt mạnh mẽ năng lực thiên bẩm của bạn.`);
                    } else {
                        interactionTexts.push(`Sao Lưu **${starName} Hóa ${label}** xuất hiện, mang tới những cơ hội và thử thách mới.`);
                    }
                }
            });
        }

        if (interactionTexts.length > 0) {
            segments.push({ 
                text: `**Biến động Tứ Hóa:** ${interactionTexts.join(" ")}`, 
                interactive: true 
            });
        }

        // 3. Phân tích Chính Tinh
        const majorStars = activeStars.filter(s => s.type === "major" || shards.star_atoms[s.name]);
        if (majorStars.length > 0) {
            majorStars.forEach((star, idx) => {
                const atom = shards.star_atoms[star.name];
                if (atom) {
                    const action = seededPick(atom.actions, monthSeed + idx * 3);
                    const outcome = seededPick(atom.outcomes, monthSeed + idx * 3 + 2);
                    const isNatal = natalStars.some(ns => ns.name === star.name);
                    
                    let prefix = isNatal ? "Kết hợp nội lực sao **" : "Dưới ảnh hưởng sao **";
                    segments.push({
                        text: `${prefix}${star.name}**, tháng này bạn nên ${action} để ${outcome}.`,
                        interactive: true
                    });
                }
            });
        } else {
            segments.push({
                text: "Tháng này tiểu hạn đi vào cung Vô Chính Diệu của bản mệnh. Lời khuyên cho bạn là hãy lấy tĩnh chế động, mưu sự cẩn trọng.",
                interactive: true
            });
        }

        // 4. Tư vấn sâu theo khía cạnh ngẫu nhiên
        const allInterests = Object.keys(narratives.Monthly.Interests);
        const selectedInterest = allInterests[monthSeed % allInterests.length];
        const variants = narratives.Monthly.Interests[selectedInterest];
        segments.push({ 
            text: `**Về ${selectedInterest}:** ${seededPick(variants, monthSeed + 99)}`, 
            interactive: true 
        });

        // 5. Star Interactions (New Layer)
        this._addStarInteractions(activeStars, monthSeed + 150, segments);

        return segments;
    }

    /**
     * Compose Daily (Lưu Nhật) narrative v5.0
     * Generates 7-8 rich segments with billions of unique combinations.
     * Each day is deeply personalized via natal chart + date-specific seeding.
     */
    composeDaily(dailyData, dateString = "") {
        if (!dailyData) return [];
        const dailyShards = require('./data/daily_shards.json');

        // Multi-factor seed: birth data + specific calendar date
        const daySeed = this.baseSeed + seedHash(`${dateString}-${dailyData.heavenlyStem}-${dailyData.earthlyBranch}`);
        
        const natalPalace = this.chart.palaces[dailyData.index];
        const palaceName = dailyData.palaceNames[dailyData.index];
        const segments = [];

        // ─── SEGMENT 1: Dẫn nhập Can Chi ───
        const opening = seededPick(dailyShards.DailyOpenings, daySeed);
        const canInsight = dailyShards.DailyCanChiInsights[dailyData.heavenlyStem];
        const canText = canInsight ? seededPick(canInsight, daySeed + 3) : "";
        
        segments.push({ 
            text: `${opening} ngày **${dailyData.heavenlyStem} ${dailyData.earthlyBranch}** — ${canText}`,
            interactive: true 
        });

        // ─── SEGMENT 2: Cung Bản mệnh & Chủ đề ngày ───
        const palaceContexts = dailyShards.PalaceDailyContexts[palaceName];
        const palaceText = palaceContexts ? seededPick(palaceContexts, daySeed + 7) : `tác động đến phương diện ${palaceName}`;
        
        segments.push({ 
            text: `Vận khí của bạn hôm nay tập trung tại cung **${palaceName}** bản mệnh — ${palaceText}.`,
            interactive: true 
        });

        // ─── SEGMENT 3: Tương tác Tứ Hóa (Natal vs Flying) ───
        const natalStars = [...natalPalace.majorStars, ...natalPalace.minorStars];
        const activeStars = dailyData.stars[dailyData.index] || []; 
        let dailyVibe = 0;
        let tuHoaTexts = [];

        if (dailyData.mutagen && dailyData.mutagen.length === 4) {
            const labels = ["Lộc", "Quyền", "Khoa", "Kỵ"];
            dailyData.mutagen.forEach((starName, idx) => {
                const label = labels[idx];
                const isAtPalace = activeStars.some(s => s.name === starName);
                const isNatal = natalStars.some(ns => ns.name === starName);

                if (isAtPalace) {
                    if (idx === 3) dailyVibe -= 3;
                    else dailyVibe += 1;

                    // Mutagen effect description
                    const effectPool = dailyShards.MutagenEffects[label];
                    const effect = effectPool ? seededPick(effectPool, daySeed + idx * 7) : "";

                    if (isNatal) {
                        const tmpl = seededPick(dailyShards.NatalStarInteractions.NatalHit, daySeed + idx);
                        tuHoaTexts.push(tmpl.replace(/\{star\}/g, starName).replace(/\{label\}/g, label));
                    } else {
                        const tmpl = seededPick(dailyShards.NatalStarInteractions.FlyingVisit, daySeed + idx);
                        tuHoaTexts.push(tmpl.replace(/\{star\}/g, starName).replace(/\{label\}/g, label));
                    }
                    if (effect) tuHoaTexts.push(effect);
                }
            });
        }

        if (tuHoaTexts.length > 0) {
            segments.push({
                text: `**Biến động Tứ Hóa:**\n\n${tuHoaTexts.map(t => "• " + t).join("\n\n")}`,
                interactive: true
            });
        }

        // ─── SEGMENT 4: Chính Tinh (Major Stars Detailed) ───
        const majorStars = activeStars.filter(s => s.type === "major" || shards.star_atoms[s.name]);
        if (majorStars.length > 0) {
            let starLines = [];
            majorStars.slice(0, 3).forEach((star, idx) => {
                const atom = shards.star_atoms[star.name];
                if (atom) {
                    const isNatal = natalStars.some(ns => ns.name === star.name);
                    
                    // Pick prefix template
                    const prefixPool = isNatal ? dailyShards.StarActionTemplates.NatalPrefix : dailyShards.StarActionTemplates.FlyingPrefix;
                    let prefix = seededPick(prefixPool, daySeed + idx * 11);
                    prefix = prefix.replace(/\{star\}/g, star.name);
                    
                    // Pick action bridge template
                    let bridge = seededPick(dailyShards.StarActionTemplates.ActionBridge, daySeed + idx * 13);
                    const action = seededPick(atom.actions, daySeed + idx * 17);
                    const quality = seededPick(atom.qualities, daySeed + idx * 19);
                    const outcome = seededPick(atom.outcomes, daySeed + idx * 23);
                    
                    bridge = bridge.replace(/\{action\}/g, action).replace(/\{quality\}/g, quality).replace(/\{outcome\}/g, outcome);
                    
                    starLines.push(`${prefix} ${bridge}`);
                }
            });
            
            if (starLines.length > 0) {
                segments.push({
                    text: `**Cát Hướng Hành Động:**\n\n${starLines.map(s => "- " + s).join("\n\n")}`,
                    interactive: true
                });
            }
        } else {
            segments.push({
                text: `**Cát Hướng Hành Động:** Cung Vô Chính Diệu trên bản mệnh — ngày hôm nay thiếu vắng Chính Tinh dẫn hướng. Tuy nhiên, hãy nhìn sang cung đối diện và các sao phụ tinh đồng cung để tìm kiếm La Bàn. Lấy tĩnh chế động, hoàn thành các công việc dở dang thay vì khởi sự mới.`,
                interactive: true
            });
        }

        // ─── SEGMENT 5: Phụ Tinh nổi bật (Minor Stars) ───
        const allMinorStars = [...(natalPalace.minorStars || []), ...(natalPalace.adjectiveStars || [])];
        const dailyMinor = activeStars.filter(s => s.type !== "major");
        const combinedMinors = [...allMinorStars, ...dailyMinor];
        let minorInsights = [];

        combinedMinors.forEach((star, idx) => {
            const pool = dailyShards.MinorStarDaily[star.name];
            if (pool) {
                minorInsights.push(`**${star.name}:** ${seededPick(pool, daySeed + idx * 29)}`);
            }
        });

        if (minorInsights.length > 0) {
            // Show up to 3 most relevant minor star insights
            const selected = minorInsights.slice(0, 3);
            segments.push({
                text: `**Tinh Bàn Phụ Trợ:**\n\n${selected.map(s => "- " + s).join("\n\n")}`,
                interactive: true
            });
        }

        // ─── SEGMENT 5.5: Star Pair Interactions (Unified Layer) ───
        this._addStarInteractions(combinedMinors, daySeed + 120, segments);

        // ─── SEGMENT 6: Lời khuyên cụ thể ───
        let advicePool;
        if (dailyVibe >= 2) advicePool = dailyShards.DailyAdvicePositive;
        else if (dailyVibe <= -2) advicePool = dailyShards.DailyAdviceCaution;
        else advicePool = daySeed % 2 === 0 ? dailyShards.DailyAdvicePositive : dailyShards.DailyAdviceCaution;
        
        const advice = seededPick(advicePool, daySeed + 41);
        segments.push({ 
            text: `**Lời khuyên hôm nay:** ${advice}`,
            interactive: true 
        });

        // ─── SEGMENT 7: Tổng kết ───
        let toneKey;
        if (dailyVibe >= 3) toneKey = "VeryPositive";
        else if (dailyVibe >= 1) toneKey = "Positive";
        else if (dailyVibe >= -1) toneKey = "Neutral";
        else toneKey = "Caution";
        
        const summary = seededPick(dailyShards.DailySummaryTones[toneKey], daySeed + 53);
        segments.push({ 
            text: `${this._addTransition(daySeed + 80)} ${summary}`,
            interactive: true 
        });

        return segments;
    }

    _addTransition(seed) {
        const dailyShards = require('./data/daily_shards.json');
        return seededPick(dailyShards.TransitionPhrases || [], seed);
    }

    _addStarInteractions(starsInPalace, seed, segments) {
        const dailyShards = require('./data/daily_shards.json');
        const starNames = starsInPalace.map(s => s.name);
        
        // Also include relevant natal stars for synergies
        const natalPalace = this.chart.palaces[starsInPalace[0]?.pIdx || 0] || { majorStars: [], minorStars: [] };
        const allStars = [...starNames, ...natalPalace.majorStars.map(s => s.name), ...natalPalace.minorStars.map(s => s.name)];

        const interactions = [];
        const comboRules = [
            { pair: ["Lộc Tồn", "Thiên Mã"], key: "Lộc Mã" },
            { pair: ["Lưu Lộc", "Lưu Mã"], key: "Lộc Mã" },
            { pair: ["Thiên Khôi", "Thiên Việt"], key: "Khôi Việt" },
            { pair: ["Lưu Khôi", "Lưu Việt"], key: "Khôi Việt" },
            { pair: ["Văn Xương", "Văn Khúc"], key: "Xương Khúc" },
            { pair: ["Lưu Xương", "Lưu Khúc"], key: "Xương Khúc" },
            { pair: ["Tả Phù", "Hữu Bật"], key: "Tả Hữu" },
            { pair: ["Hồng Loan", "Thiên Hỷ"], key: "Loan Hỷ" },
            { pair: ["Lưu Loan", "Lưu Hỷ"], key: "Loan Hỷ" },
            { pair: ["Địa Không", "Địa Kiếp"], key: "Không Kiếp" },
            { pair: ["Kình Dương", "Đà La"], key: "Kình Đà" },
            { pair: ["Lưu Dương", "Lưu Đà"], key: "Kình Đà" },
            { pair: ["Hỏa Tinh", "Linh Tinh"], key: "Hỏa Linh" },
            { pair: ["Long Trì", "Phụng Các"], key: "Long Phượng" },
            { pair: ["Thiên Khốc", "Thiên Hư"], key: "Khốc Hư" }
        ];

        comboRules.forEach(rule => {
            if (rule.pair.every(name => allStars.includes(name))) {
                const text = dailyShards.StarInteractions[rule.key];
                if (text) interactions.push(text);
            }
        });

        if (interactions.length > 0) {
            segments.push({
                text: `**Cộng Hưởng Tinh Tú:**\n\n${interactions.map(t => "⚡ " + t).join("\n\n")}`,
                interactive: true
            });
        }
    }

    /**
     * Compose Daily Hạn (Nhật Hạn) — per-life-area scoring & narrative
     * Scores 5 domains: Tài Vận, Sự Nghiệp, Tình Cảm, Sức Khỏe, Quý Nhân
     * Each domain is scored based on natal palace stars + daily flying stars
     */
    composeDailyHan(dailyData, dateString = "") {
        if (!dailyData) return [];
        const dailyShards = require('./data/daily_shards.json');
        const nhatHanData = dailyShards.NhatHan;
        if (!nhatHanData) return [];

        const daySeed = this.baseSeed + seedHash(`nhatHan-${dateString}-${dailyData.heavenlyStem}-${dailyData.earthlyBranch}`);
        const areas = nhatHanData.Areas;
        const results = [];

        Object.entries(areas).forEach(([key, area], areaIdx) => {
            // 1. Find all relevant natal palaces for this area
            let score = 50; // Base score
            let natalContext = "";

            const relevantPalaces = area.palaces.map(pName => this.chart.palaces.find(p => p.name === pName)).filter(Boolean);

            // 2. Score based on natal stars in relevant palaces
            relevantPalaces.forEach(palace => {
                const allStars = [...palace.majorStars, ...palace.minorStars, ...(palace.adjectiveStars || [])];
                allStars.forEach((star, sIdx) => {
                    if (area.goodStars.includes(star.name)) {
                        score += 8;
                        // Generate natal boost context (once, for the first good star found)
                        if (!natalContext && nhatHanData.NatalBoostTemplates) {
                            const tmpl = seededPick(nhatHanData.NatalBoostTemplates, daySeed + areaIdx * 31 + sIdx);
                            natalContext = tmpl
                                .replace(/\{palace\}/g, palace.name)
                                .replace(/\{star\}/g, star.name)
                                .replace(/\{brightness\}/g, star.brightness || "Bình")
                                .replace(/\{area\}/g, area.label);
                        }
                    }
                    if (area.badStars.includes(star.name)) {
                        score -= 10;
                        if (!natalContext && nhatHanData.NatalWeakenTemplates) {
                            const tmpl = seededPick(nhatHanData.NatalWeakenTemplates, daySeed + areaIdx * 37 + sIdx);
                            natalContext = tmpl
                                .replace(/\{palace\}/g, palace.name)
                                .replace(/\{star\}/g, star.name)
                                .replace(/\{brightness\}/g, star.brightness || "Bình")
                                .replace(/\{area\}/g, area.label);
                        }
                    }
                    // Brightness bonus
                    if (star.brightness === "Miếu" || star.brightness === "Vượng") score += 4;
                    if (star.brightness === "Hãm") score -= 5;
                    // Mutagen bonus
                    if (star.mutagen === "Lộc") score += 6;
                    if (star.mutagen === "Quyền") score += 4;
                    if (star.mutagen === "Khoa") score += 3;
                    if (star.mutagen === "Kỵ") score -= 8;
                });
            });

            // 3. Daily flying star modifiers
            const dailyPalaceIndex = dailyData.index;
            const activeStars = dailyData.stars[dailyPalaceIndex] || [];
            activeStars.forEach(star => {
                if (area.goodStars.includes(star.name)) score += 5;
                if (area.badStars.includes(star.name)) score -= 6;
            });

            // 4. Day-specific variation (seeded)
            score += ((daySeed + areaIdx * 7) % 11) - 5; // -5 to +5

            // 5. Clamp score
            score = Math.max(10, Math.min(95, score));

            // 6. Pick narrative based on score tier
            let narrativePool;
            if (score >= 65) narrativePool = area.narrativesHigh;
            else if (score >= 40) narrativePool = area.narrativesMid;
            else narrativePool = area.narrativesLow;
            
            const narrative = seededPick(narrativePool, daySeed + areaIdx * 43);

            results.push({
                key: key,
                label: area.label,
                icon: area.icon,
                score: Math.round(score),
                narrative: narrative,
                natalContext: natalContext
            });
        });

        return results;
    }
}

module.exports = HoroscopeComposer;


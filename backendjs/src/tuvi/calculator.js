/**
 * TuVi Calculator v2.0 — Custom Engine (Vietnamese Standard)
 * Replaces iztro with tuvi_engine.js for traditional Tử Vi Đẩu Số
 */
const TuViEngine = require('./tuvi_engine');
const TuViAnalyzer = require('./analyzer');

class TuViCalculator {
    constructor(options) {
        this.name = options.name || "Khách";
        this.year = options.year;
        this.month = options.month;
        this.day = options.day;
        this.hour = options.hour !== undefined ? options.hour : 12;
        this.gender = options.gender;
        this.isLunar = options.calendar === 'lunar';
        this.horoDate = options.horoDate;
    }

    calculate() {
        try {
            // Use custom TuVi engine
            const result = TuViEngine.calculate({
                year: this.year,
                month: this.month,
                day: this.day,
                hour: this.hour,
                gender: this.gender,
                isLunar: this.isLunar,
                name: this.name,
            });

            // Build chart-compatible object for TuViAnalyzer
            // This bridges the new engine output with the existing analyzer interface
            const chartCompat = {
                solarDate: result.info.solarDate,
                time: result.info.time,
                gender: result.info.gender,
                fiveElementsClass: result.info.fiveElementsClass,
                soul: result.info.soul,
                body: result.info.body,
                earthlyBranchOfSoulPalace: result.info.earthlyBranchOfSoulPalace,
                earthlyBranchOfBodyPalace: result.info.earthlyBranchOfBodyPalace,
                palaces: result.palaces,
                horoscope: (date) => TuViEngine.calculateHoroscope(date, result)
            };

            return {
                info: result.info,
                palaces: result.palaces,
                interpretations: new TuViAnalyzer(chartCompat).interpret(
                    this.horoDate || new Date().toISOString().split('T')[0]
                ),
            };
        } catch (error) {
            console.error("TuVi calculation error:", error);
            throw new Error("Không thể lập lá số Tử Vi: " + error.message);
        }
    }
}

module.exports = TuViCalculator;

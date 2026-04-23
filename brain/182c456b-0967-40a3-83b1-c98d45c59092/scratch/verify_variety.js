const HoroscopeComposer = require('C:/Users/lupan/Desktop/Workspace/AIStudioWorkspace/tinix-bazi/backendjs/src/tuvi/horoscope_composer');
const TuViEngine = require('C:/Users/lupan/Desktop/Workspace/AIStudioWorkspace/tinix-bazi/backendjs/src/tuvi/tuvi_engine');

console.log("Starting Variety Verification (100 days)...");

// 1. Calculate Natal Chart
const natalChart = TuViEngine.calculate({
    year: 1990, month: 5, day: 15, hour: 12, gender: 'Nam', isLunar: false
});

const composer = new HoroscopeComposer(natalChart);

const interpretations = new Set();
const totalDays = 100;
let duplicates = 0;

const startDate = new Date();

for (let i = 0; i < totalDays; i++) {
    const testDate = new Date(startDate);
    testDate.setDate(testDate.getDate() + i);
    const dateStr = testDate.toISOString().split('T')[0];
    
    // 2. Get Daily data from the chart
    const horo = natalChart.horoscope(testDate);
    
    // 3. Compose Daily narrative
    const result = composer.composeDaily(horo.daily, dateStr);
    
    const fullText = result.map(s => s.text).join(' ');
    
    if (interpretations.has(fullText)) {
        duplicates++;
    } else {
        interpretations.add(fullText);
    }
}

const uniquenessRatio = ((totalDays - duplicates) / totalDays) * 100;
console.log(`--- Verification Results ---`);
console.log(`Total Days Tested: ${totalDays}`);
console.log(`Unique Interpretations: ${totalDays - duplicates}`);
console.log(`Duplicates Found: ${duplicates}`);
console.log(`Uniqueness Ratio: ${uniquenessRatio.toFixed(2)}%`);

if (uniquenessRatio > 95) {
    console.log("PASS: High variety achieved.");
} else {
    console.log("FAIL: Variety is too low.");
}

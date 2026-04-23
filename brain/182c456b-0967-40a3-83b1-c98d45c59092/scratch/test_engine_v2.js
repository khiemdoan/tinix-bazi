const TuViEngine = require('C:/Users/lupan/Desktop/Workspace/AIStudioWorkspace/tinix-bazi/backendjs/src/tuvi/tuvi_engine');

try {
    const opts = {
        name: 'abc',
        year: 1984,
        month: 8,
        day: 25,
        hour: 8,
        gender: 'Nam',
        isLunar: false
    };

    console.log("Calculating...");
    const chart = TuViEngine.calculate(opts);
    if (!chart) {
        console.log("Chart is NULL");
    } else {
        console.log("Chart Info Lunar:", chart.info.lunarDate);
        console.log("Palaces Count:", chart.palaces.length);
        console.log("Mệnh at:", chart.palaces.find(p => p.name === 'Mệnh')?.earthlyBranch);
    }
} catch (e) {
    console.error("CRASH DURING CALCULATION:");
    console.error(e);
}

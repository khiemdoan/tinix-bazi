const TuViEngine = require('C:/Users/lupan/Desktop/Workspace/AIStudioWorkspace/tinix-bazi/backendjs/src/tuvi/tuvi_engine');

const opts = {
    name: 'abc',
    year: 1984,
    month: 8,
    day: 25,
    hour: 8,
    gender: 'Nam',
    isLunar: false
};

const chart = TuViEngine.calculate(opts);

console.log("--- CHART INFO ---");
console.log(JSON.stringify(chart.info, null, 2));

console.log("\n--- PALACES ---");
chart.palaces.forEach(p => {
    console.log(`Palace ${p.index} (${p.earthlyBranch}): ${p.name}`);
    console.log(`  Major: ${p.majorStars.map(s => `${s.name} (${s.brightness})${s.mutagen ? ' ['+s.mutagen+']' : ''}`).join(', ')}`);
    const minorNames = p.minorStars.map(s => s.name);
    console.log(`  Minor: ${minorNames.join(', ')}`);
});

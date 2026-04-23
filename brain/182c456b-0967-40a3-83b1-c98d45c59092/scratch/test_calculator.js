const TuViCalculator = require('C:/Users/lupan/Desktop/Workspace/AIStudioWorkspace/tinix-bazi/backendjs/src/tuvi/calculator');

try {
    const opts = {
        name: 'abc',
        year: 1984,
        month: 8,
        day: 25,
        hour: 8,
        minute: 0,
        gender: 'Nam',
        calendar: 'solar'
    };

    console.log("Calculating via Calculator...");
    const calc = new TuViCalculator(opts);
    const result = calc.calculate();
    
    console.log("SUCCESS!");
    console.log("Info:", result.info.name);
    console.log("Interpretations keys:", Object.keys(result.interpretations));
} catch (e) {
    console.error("CRASH DURING CALCULATION:");
    console.error(e);
}

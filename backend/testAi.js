  const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ override: true });

async function testModel(modelName) {
    try {
        const key = process.env.GEMINI_API_KEY.trim();
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: modelName });
        await model.generateContent('Say hello');
        console.log(`✅ SUCCESS: ${modelName} works!`);
        return true;
    } catch (e) {
        if (e.message.includes('Quota')) {
            console.log(`❌ FAILED (Quota 0): ${modelName}`);
        } else if (e.message.includes('Not Found')) {
            console.log(`❌ FAILED (Not Found): ${modelName}`);
        } else {
            console.log(`❌ FAILED (Other): ${modelName} =>`, e.message);
        }
        return false;
    }
}

async function runTests() {
    const modelsToTest = [
        'gemini-flash-latest',
        'gemini-flash-lite-latest',
        'gemini-2.5-flash-lite',
        'gemini-2.0-flash-lite-001',
        'gemini-2.0-flash-lite',
        'gemini-pro-latest',
        'gemma-3-1b-it'
    ];

    for (const m of modelsToTest) {
        await testModel(m);
    }
}
runTests();

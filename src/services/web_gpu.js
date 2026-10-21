// Check if the browser supports WebGPU
import { pipeline } from '@huggingface/transformers';
import { CreateMLCEngine, CreateWebWorkerMLCEngine, MLCEngine, WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

const workerHandler = new WebWorkerMLCEngineHandler();


const models = [
    "Llama-3.2-3B-Instruct-q4f16_1-MLC",
    "Llama-3.2-1B-Instruct-q4f16_1-MLC",
]


export async function downloadModel(modelUrl, modelName) {
    // Initialize with a progress callback
    const initProgressCallback = (progress) => {
        console.log("Model loading progress:", progress);
    };

    
}


export async function initializeWebGPU() {
    if (!navigator.gpu) {
    throw new Error('WebGPU is not supported by the current browser');
    }

    // Request a GPU adapter
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
    throw new Error('Failed to get WebGPU adapter');
    }

    // Request a GPU device
    const device = await adapter.requestDevice();

    console.log('WebGPU device initialized successfully!');

    // get device info
    const deviceInfo = {
        name: adapter.name,
        features: Array.from(adapter.features),
        limits: adapter.limits,
    };

    console.log('WebGPU device info:', deviceInfo);
}

// Base Method to run inference on the model
export const WebAI = async (query) => {
    const messages = [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: query }
    ];

    const reply = await engine.chat.completions.create({
        messages,
    });

    console.log(reply.choices[0].message);
    console.log(reply.usage);
}

export const AI_Extract = async (url) => {
        const prompt = `{extract information from given URL: '|${url}'\
        Follow this structure: \
            name: String,
            description: String,
            justification: String,
            payment: String,
            format: String,
            link: String,
            category: String,
            subcategory: String,
            unpSteps: [Number],
            summaryBullets: [String],
            languages: [String],
            link_reported: Number,
            featured: String,
            created_at: String,
            updated_at: String,
            evaluation_criteria: {
                usability_easy_to_follow: Number(1-3),
                usability_clear_keypoints: Number(1-3),
                usability_non_expert_friendly: Number(1-3),
                engagement: Number(1-3),
                support: Number(1-3),
                accreditation: Boolean,
                complementary: Number(1-3),
                unique: Number(1-3),
                local_relevance: Number(1-3),
                relevance: Number(1-3)
            },
            evaluation: {
                user_score: 0,
                totalScore: Number(sum of evaluation_criteria scores)
            }
        . The response must be in JSON format and follow the structure defined above. Do not include any information that is not relevant to the user's question. Be clear and concise in your response.}`

    const messages = [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: prompt }
    ];

    const reply = await engine.chat.completions.create({
        messages,
    });

    console.log(reply.choices[0].message);
    console.log(reply.usage);
}

export async function AISummary(url) {
    console.log("Generating summary for URL:", url);
    const prompt = `{Summarize the key information and insights from the resource found at ${url} in a clear and concise manner. Focus on the most important points and provide a brief overview of the content, highlighting any relevant data, findings, or recommendations related to urban nature-based solutions.}`

    const initProgressCallback = (progress) => {
        console.log("Model loading progress:", progress);
    };

    // Using CreateMLCEngine
    const engine = await CreateWebWorkerMLCEngine(
        new Worker(new URL('../services/web_gpu.js', import.meta.url), { type: 'module' }),
        models[1],
    )


    const messages = [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: prompt }
    ];

    const reply = await engine.chat.completions.create({
        messages,
    });

    console.log(reply.choices[0].message);
    console.log(reply.usage);
    return reply.choices[0].message.content;
}
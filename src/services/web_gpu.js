// Check if the browser supports WebGPU
import { pipeline } from '@huggingface/transformers';
import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";

// 1. Check if browser supports WebGPU
// 2. Check device compatibility and collect hw info
// 3. Based on device info, load appropriate model for the device
// 4. Initialize the model and set up the pipeline for inference (use web workers, or it will slow down UI)

export async function downloadModel(modelUrl, modelName) {
    // Initialize with a progress callback
    const initProgressCallback = (progress) => {
        console.log("Model loading progress:", progress);
    };

    const models = [
        "Llama-3.2-3B-Instruct-q4f16_1-MLC",
        "Llama-3.2-1B-Instruct-q4f16_1-MLC",]

    // Using CreateMLCEngine
    const engine = await CreateMLCEngine(models[1], { initProgressCallback });

    // Direct instantiation
    const engineInstance = new MLCEngine({ initProgressCallback });
    await engineInstance.reload(models[1]);

}

// TODO: Check device compatibility and load model that runs well with it
// Needs a list of models to use for different types of devices.
// Add explainer page about sustainable AI maybe?
// Improve the search system

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
}


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
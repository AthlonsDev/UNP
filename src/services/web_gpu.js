// Check if the browser supports WebGPU
import { pipeline } from '@huggingface/transformers';
import { CreateWebWorkerMLCEngine } from "@mlc-ai/web-llm";

const model = "Qwen2-0.5B-Instruct-q0f16-MLC";

let enginePromise;

export function downloadModel(onProgress) {
  if (!enginePromise) {
    const worker = new Worker(
      new URL("./web_llm_worker.js", import.meta.url),
      { type: "module" }
    );

    enginePromise = CreateWebWorkerMLCEngine(
      worker,
      model,
      {
        initProgressCallback: (report) => {
        //   console.log("Model loading progress:", report);

          onProgress?.(report);
        },
      }
    ).catch((error) => {
      enginePromise = undefined;
      throw error;
    });
  }

  return enginePromise;
}

export async function getWebLLMEngine() {
  if (!enginePromise) {
    throw new Error("WebLLM model has not been initialized");
  }

  return enginePromise;
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

    const engine = await getWebLLMEngine();

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

    const engine = await getWebLLMEngine();

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

    const engine = await getWebLLMEngine();

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
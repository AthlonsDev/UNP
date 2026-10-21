import { GoogleGenAI } from '@google/genai';
import { getAPIKey } from './api.js';


const fetchAPIKey = async () => {
    try {
        const apiKey = await getAPIKey();
        if (apiKey) {
            console.log("Retrieved API key:", apiKey);
            // Store the API key in a variable or state for later use
            return apiKey;
        }
    } catch (error) {
        console.error("Error fetching API key:", error);
    }
};

// TODO: Keep this system for testing purposes only, production should not call AI inference from frontend, move it to Lambda.
// ***


const models = [
    "gemma-4-26b-a4b-it",
    "gemma-4-31b-it",
    "gemini-3-flash-preview",
]

// Don't really need LLM to perform search, just change it with client side Semantic Search.
export async function AI_search(query) {
    console.log("Performing AI search for query:", query);
    const apiKey = await fetchAPIKey();
    const ai = new GoogleGenAI({apiKey: apiKey});
    const prompt = `{${query}. Extract the main search query and relevant keywords from this input. Return the result in JSON format with the following structure: ${{'query': 'main search query', 'keywords': ['keyword1', 'keyword2']}}`;
    // try with bigger model first, if it fails, fallback to smaller model
    const response = await ai.models.generateContent({
        model: models[0],
        contents: prompt,
    });
    const result = response.candidates?.[0]?.content?.parts?.[1]?.text;
    console.log("AI extract result:", result);

    return result;
}

export async function AI_extract(url) {
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

    const apiKey = await fetchAPIKey();
    const ai = new GoogleGenAI({apiKey: apiKey});
    const response = await ai.models.generateContent({
        model: models[0],
        contents: prompt,
    });

    const result = response.candidates?.[0]?.content?.parts?.[1]?.text;
    console.log("AI extract result:", result);

    const parsedResponse = jsonHandler(result);

    return parsedResponse;
}

function jsonHandler(jsonString) {
    let jString = jsonString.trim();
    console.log("converting string to JSON")
    if (jString.startsWith('```json') && jString.endsWith('```')) {
        const result = jString.slice(7, -3).trim();
        console.log("Extracted JSON from code block:", result);
        return JSON.parse(result);
    }
}

export async function AI_summary(url) {
    console.log("Performing AI summary for URL:", url);
    const prompt = `{Summarize the key information and insights from the resource found at ${url} in a clear and concise manner. Focus on the most important points and provide a brief overview of the content, highlighting any relevant data, findings, or recommendations related to urban nature-based solutions.}`
    const apiKey = await fetchAPIKey();
    const ai = new GoogleGenAI({apiKey: apiKey});
    const response = await ai.models.generateContent({
        model: models[1],
        contents: prompt,
    });

    // console.log("AI summary response:", response);

    const result = response.candidates?.[0]?.content?.parts?.[1]?.text;
    console.log("AI extract result:", result);

    return result;

}

export async function AI_checkLinks(urls) {
    console.log("Checking links for validity and accessibility:");
    const prompt = `{Check the following links for validity and accessibility: ${urls}. Return a JSON object with the following structure: { "validLinks": [list of valid links], "brokenLinks": [list of broken links] }}`
    const apiKey = await fetchAPIKey();
    const ai = new GoogleGenAI({apiKey: apiKey});
    const response = await ai.models.generateContent({
        model: models[1],
        contents: prompt,
    });

    const result = response.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Raw response:", result);

    const parsedResponse = jsonHandler(result);
    if (parsedResponse) {
        const brokenLinks = parsedResponse.brokenLinks || [];
        console.log("Broken links found:", brokenLinks);
        if (brokenLinks.length > 0) {
            replaceBrokenLinks(brokenLinks).then(async (replacementLinks) => {
                const updatedLinks = { "oldLinks": brokenLinks, "newLinks": replacementLinks };
                console.log("Replacement links found:", updatedLinks);
                // Update the database with the replacement links
            //     await updateDatabaseWithReplacementLinks(updatedLinks);
            });
        }
    }

    return result;
}

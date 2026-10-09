import {GoogleGenAI} from '@google/genai';
import { eval_data } from './evaluation.js';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// exposed API key for testing purposes only.
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

const models = [
    "gemma-4-26b-a4b-it",
    "gemma-4-31b-it",
    "gemma-3-27b-it",
    "gemma-3-12b-it",
    "gemini-3-flash-preview",
]

// Don't really need LLM to perform search, just change it with client side Semantic Search.
export async function AI_search(query) {
    console.log("Performing AI search for query:", query);
    const prompt = `{${query}. Extract the main search query and relevant keywords from this input. Return the result in JSON format with the following structure: ${{'query': 'main search query', 'keywords': ['keyword1', 'keyword2']}}`;
    const response = await ai.models.generateContent({
        model: models[0],
        contents: prompt,
    });
    // const result = response?.results?.[0]?.content?.text;
    // console.log("AI search result:", result);

    console.log("Raw Response: ", response?.candidates);

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

    const response = await ai.models.generateContent({
        model: models[0],
        contents: prompt,
    });

    const result = response.candidates?.[0]?.content?.parts?.[1]?.text;
    console.log("AI extract result:", result);

    // AI scoring system works but it takes too long, and also increases the use of tokens.
    // better to use a manual algorithm to evaluate the data and return a score. It's quicker and less probabilistic.

    // TODO: 
    // Add scoring algorithm
    // Add submit new resource on Lambda
    // Add AI Summary
    // Check links and report
    // Find new links/resources with AI search and add to database
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
    const prompt = `{Summarize the key information and insights from the resource found at ${url} in a clear and concise manner. Focus on the most important points and provide a brief overview of the content, highlighting any relevant data, findings, or recommendations related to urban nature-based solutions.}`

    const response = await ai.models.generateContent({
        model: models[0],
        contents: prompt,
    });

    const result = response.candidates?.[0]?.content?.parts?.[1]?.text;
    console.log("AI extract result:", result);

    return result;

}

export async function replaceBrokenLinks(urls) {
    const prompt = `{Find me a useful online tool or resource related to {link}\
        that is currently active and provides similar information or functionality.\
        Choose a link that does not appear in ${urls}. return a list of replacement url for each ${urls} list.`
    
    const response = await ai.models.generateContent({
        model: models[0],
        contents: prompt,
    });

    const result = response.candidates?.[0]?.content?.parts?.[1]?.text;
    console.log("AI extract result:", result);

    return result;
}

// TODO: Automatically find new resources from list of verified sources and add them to database.
// TODO: Add a fallback to AWS Bedrock, in case GoogleAI is down or not working.



import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const API_KEY = "AIzaSyB830qh_EJJhAw7Ihu5C-dOWd4bOfgC374" // Move to .env in production
const ai = new GoogleGenAI({ apiKey: API_KEY });


export async function performAIContributions(query) {
  if (!query.trim()) {
    return []
  }

  try {
    const prompt_JSON = `extract information from given URL, based on the keys in the Tools.json data structure, and return the information as a JSON object. The keys are: id, url, name, category, subcategory, languages, payment, description, summaryBullets, unpSteps, evaluation[totalScore, user_score], link, timestamp. Ensure the returned JSON object strictly adheres to this structure.
    URL: ${query}`;

    const matchSchema = z.object({
      url:z.string(),
      name:z.string(),
      category:z.string(),
    })



    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt_JSON }] }],
      // removed tools to avoid the "Tool use with a response mime type: 'application/json' is unsupported" error
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(matchSchema)
      }
    });

    // console.log("AI Response:", response.candidates[0].content.parts[0].text);

    if (response.candidates && response.candidates.length > 0) {
      const jsonString = response.candidates[0].content.parts[0].text
      return JSON.parse(jsonString)
    } else {
      // Fallback to simple split
      return query.toLowerCase().split(' ')
    }


  } catch (error) {
    console.error('AI search error:', error)
    // Fallback to simple split
    return query.toLowerCase().split(' ')
  }

}
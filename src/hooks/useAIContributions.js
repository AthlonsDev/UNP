import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const API_KEY = "AIzaSyB830qh_EJJhAw7Ihu5C-dOWd4bOfgC374" // Move to .env in production
const ai = new GoogleGenAI({ apiKey: API_KEY });


export async function performAIContributions(query) {
  if (!query.trim()) {
    return []
  }

  // {
  //     "url": "URL of the resource",
  //     "name": "Name of the resource",
  //     "category": "Tool or Guidance or Programme or Platform",
  //     "description": "Brief description of the resource",
  //     "subcategory": "Learning platform, Project management tool, podcast, etc.",
  //     "languages": language of the resource)",
  //     "payment": "Payment model (e.g., Free, Paid, Freemium)",
  //     "summaryBullets": {
  //       "for": "Who is this resource for?",
  //       "outcome": "What outcomes can be expected?",
  //       "user": "Type of user who would benefit"
  //     },
  //     "unpSteps": ["Relevant", "UNP", "steps"],
  //     "evaluation": {
  //       "totalScore": 0,
  //       "user_score": 0
  //     }
  //   }
  //   .

  try {
    const prompt_JSON = `extract information from given URL, based on the keys in the Tools.json data structure, and return the information as a JSON object. The keys are: id, url, name, category, subcategory, languages, payment, description, summaryBullets, unpSteps, evaluation[totalScore, user_score], link, timestamp. Ensure the returned JSON object strictly adheres to this structure.
    .
    URL: ${query}`;

    const matchSchema = z.object({
      url:z.string(),
      name:z.string(),
      category:z.string(),
      description:z.string(),
      subcategory:z.string(),
      languages:z.array(z.string()),
      payment:z.string(),
      summaryBullets:z.object({
        for:z.string(),
        outcome:z.string(),
        user:z.string()
      }),
      unpSteps:z.array(z.string()),
      evaluation:z.object({
        totalScore:0,
        user_score:0,
      }).optional()
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
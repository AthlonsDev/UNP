
const API_KEY = "AIzaSyB830qh_EJJhAw7Ihu5C-dOWd4bOfgC374" // Move to .env in production

export async function performAIContributions(query) {
  if (!query.trim()) {
    return []
  }

  try {
        const prompt_JSON = `extract information from given URL, based on the keys in the Tools.json data structure, and return the information as a JSON object. The keys are: id, url, name, category, subcategory, languages, payment, description, summaryBullets, unpSteps, evaluation[totalScore, user_score], link, timestamp. Ensure the returned JSON object strictly adheres to this structure.
        URL: ${query}`;

    const payloadJSON = {
      contents: [{role: "user", parts: [{text: prompt_JSON}]}],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            id: { type: "NUMBER" },
            url: { type: "STRING" },
            name: { type: "STRING" },
            category: { type: "STRING" },
            subcategory: { type: "STRING" },
            languages: { type: "ARRAY", items: { type: "STRING" } },
            payment: { type: "STRING" },
            description: { type: "STRING" },
            summaryBullets: { type: "ARRAY", items: { type: "STRING" } },
            unpSteps: { type: "ARRAY", items: { type: "STRING" } },
            evaluation: {
              type: "OBJECT",
              properties: {
                totalScore: { type: "NUMBER" },
                user_score: { type: "NUMBER" }
              }
            },
            link: { type: "STRING" },
            timestamp: { type: "STRING" }
          }
        }
      }
    }

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt_JSON }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            id: { type: "NUMBER" },
            url: { type: "STRING" },
            name: { type: "STRING" },
            category: { type: "STRING" },
            subcategory: { type: "STRING" },
            languages: { type: "ARRAY", items: { type: "STRING" } },
            payment: { type: "STRING" },
            description: { type: "STRING" },
            summaryBullets: { type: "ARRAY", items: { type: "STRING" } },
            unpSteps: { type: "ARRAY", items: { type: "STRING" } },
            evaluation: {
              type: "OBJECT",
              properties: {
                totalScore: { type: "NUMBER" },
                user_score: { type: "NUMBER" }
              }
            },
            link: { type: "STRING" },
            timestamp: { type: "STRING" }
          }
        }
      }
    }

    const request = {
      model: "gemini-2.0-flash",
      prompt: prompt_JSON,
      maxOutputTokens: 1024,
      temperature: 0.2,
      topP: 0.8,
      topK: 40,
      stopSequences: []
    }


    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response) {
      console.error('No response from AI API');
      return [];
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '<no-body>');
      console.error('AI API error', response.status, text);
      return [];
    }

    const result = await response.json().catch((err) => {
      console.error('Failed to parse AI response JSON:', err);
      return null;
    });

    return result || [];

  } catch (error) {
    console.error('AI search error:', error)
    // Fallback to simple split
    return query.toLowerCase().split(' ')
  }
}
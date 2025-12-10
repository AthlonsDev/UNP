const API_KEY = "AIzaSyB830qh_EJJhAw7Ihu5C-dOWd4bOfgC374" // Move to .env in production

export async function performAISearch(query) {
  if (!query.trim()) {
    return []
  }

  try {
    const prompt_JSON = 'extract information from given URL, based on the keys in the Tools.json data structure, and return the information as a JSON object. The keys are: id, url, name, category, subcategory, languages, payment, description, summaryBullets, unpSteps, evaluation[totalScore, user_score], link, timestamp. Ensure the returned JSON object strictly adheres to this structure.'
    const prompt = `Extract key search terms from the following query that would be useful for finding relevant 'Urban Nature Plan' tools, programmes, platforms, or guidance documents. List them as a JSON array of strings. Focus on core concepts, functions, and thematic areas.
Query: '${query}'`

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: { type: "STRING" }
        }
      }
    }


    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (result.candidates && result.candidates.length > 0) {
      const jsonString = result.candidates[0].content.parts[0].text
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
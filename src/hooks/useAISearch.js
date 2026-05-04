import { AISearch } from '../services/api';
export async function performAISearch(query) {
  if (!query.trim()) {
    return []
  }

  try {
    const prompt = `Extract key search terms from the following query that would be useful for finding relevant 'Urban Nature Plan' tools, programmes, platforms, or guidance documents. List them as a JSON array of strings. Focus on core concepts, functions, and thematic areas.
Query: '${query}'`

    const aiResponse = await AISearch(prompt)
    if (aiResponse && aiResponse.terms) {
      return aiResponse.terms
    } else {
      console.warn('AI search returned unexpected format:', aiResponse)
      return query.toLowerCase().split(' ')
    }

  } catch (error) {
    console.error('AI search error:', error)
    // Fallback to simple split
    return query.toLowerCase().split(' ')
  }
}
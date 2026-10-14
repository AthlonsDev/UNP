// import { AISearch } from '../services/api';
import { AI_search } from '../services/AI_Engine.js';
import lodash from 'lodash';


export async function performAISearch(query) {
  if (!query.trim()) {
    return []
  }

  try {
    // memoize the debounced function to avoid repeated calls for the same query
    const debouncedSearch = lodash.debounce(async (query) => {
      const prompt = `Extract key search terms from the following query that would be useful for finding relevant 'Urban Nature Plan' tools, programmes, platforms, or guidance documents. List them as a JSON array of strings. Focus on core concepts, functions, and thematic areas.
                      Query: '${query}'`
      console.log("Sending prompt to AI:", prompt)
      const aiResponse = await AI_search(prompt)
      if (aiResponse && aiResponse.terms) {
        return aiResponse.terms
      } else {
        console.warn('AI search returned unexpected format:', aiResponse)
        return query.toLowerCase().split(' ')
      }
    }, 300) // 300ms debounce

    return await debouncedSearch(query)

  } catch (error) {
    console.error('AI search error:', error)
    // Fallback to simple split
    return query.toLowerCase().split(' ')
  }
}
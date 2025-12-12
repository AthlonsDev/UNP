import { useState } from "react";


export default function Filters({ 
  filters, 
  setFilters, 
  semanticKeywords, 
  setSemanticKeywords,
  totalCount,
  filteredCount,
  onAISearch,
  onClearFilters
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchFeedback, setSearchFeedback] = useState('')

  const languageMap = {'EN':'English', 'DE':'German', 'DK':'Danish', 'NL':'Dutch', 'FR':'French', 'ES':'Spanish', 'ZH':'Chinese', 'PT':'Portuguese', 'ID':'Indonesian', 'SE':'Swedish', 'Multilingual':'Multilingual'};

  const suggestions = [
    'how do I monitor biodiversity in the city',
    'how can I find funding',
    'how do I co-create effectively',
    'how do I get political buy-in',
    'how do I ensure social justice is included',
    'who do I need to get involved'
  ]

  const handleAISearch = async () => {
    if (!searchQuery.trim()) {
      setSearchFeedback('Please enter a search query.')
      return
    }

    setIsSearching(true)
    setSearchFeedback('Thinking...')
    
    try {
      const keywords = await onAISearch(searchQuery)
      setSemanticKeywords(keywords)
      setSearchFeedback(`Keywords found: ${keywords.join(', ')}`)
    } catch (error) {
      setSearchFeedback('AI search failed, using standard search.')
      setSemanticKeywords(searchQuery.toLowerCase().split(' '))
    } finally {
      setIsSearching(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    // Trigger search automatically
    setTimeout(() => handleAISearch(), 100)
  }

  return (
    <section className="card-component p-6 mb-12">
      {/* AI Search */}
      <div className="mb-6">
        <label htmlFor="ai-search" className="block text-sm font-medium text-gray-700 mb-1">
          What do you need help with?
        </label>
        <div className="flex items-center">
          <input
            type="text"
            id="ai-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
            placeholder="e.g., 'find tools for community engagement'"
            className="flex-grow bg-gray-50 border border-gray-300 rounded-l-md shadow-sm focus:border-primary-accent focus:ring-primary-accent sm:text-sm py-2 px-3"
          />
          <button
            onClick={handleAISearch}
            disabled={isSearching}
            className="text-white px-4 py-2 rounded-r-md hover:bg-opacity-80 transition-colors font-bold flex items-center justify-center hover:cursor-pointer hover:bg-sky-700 bg-sky-500"
            // style={{ backgroundColor: 'var(--primary-accent)' }}
          >
            Search
            {isSearching && (
              <div className="ai-loading-indicator active ml-2" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1 h-4">{searchFeedback}</p>

        {/* Suggestions */}
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-600 mb-2">
            Need inspiration? Try one of these:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-btn"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Standard Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resource Type
          </label>
          { <select
            // value={filters.category}
            // onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            // className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-accent focus:ring-primary-accent sm:text-sm py-2 px-3"
            // style={{ backgroundColor: 'var(--filter-highlight-bg)' }}
          >
            <option value="">All Types</option>
            <option value="Tool">Tool</option>
            <option value="Guidance">Guidance</option>
            <option value="Programme">Programme</option>
            <option value="Platform">Platform</option>
          </select>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select>
            <option value="">All</option>
            {languageMap && Object.entries(languageMap).map(([code, name]) => (
              <option key={code} value={name}>{name}</option>
            ))}
            onSelect={(e) => handleSuggestionClick(suggestion)}
          </select>

        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost
          </label>
          <select
          >
            <option value="">All</option>
            <option value="Free">Free</option>
            <option value="Charged">Charged</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Showing {filteredCount} of {totalCount} resources
        </p>
        <button
          onClick={onClearFilters}
          className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors hover:cursor-pointer"
        >
          Clear Filters
        </button>
      </div>
    </section>
  )
}
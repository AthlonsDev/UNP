import './App.css';
import { useState } from 'react'
import Header from './components/Header'
import ContributeForm from './components/ContributeForm'
import Filters from './components/Filters'
import UNPDiagram from './components/UNPDiagram'
import Charts from './components/Charts'
import KnowledgeSnippet from './components/KnowledgeSnippet'
import ResourceCard from './components/ResourceCard'
import { useResources } from './hooks/useResources'
import { performAISearch } from './hooks/useAISearch'
import ManualContributeForm from './components/ManualContribute.jsx'

import { getResources } from './services/api'

function App() {
  const {
    resources,
    filteredResources,
    filters,
    setFilters,
    semanticKeywords,
    setSemanticKeywords,
    currentStepFilter,
    setCurrentStepFilter,
    categories,
    languages,
    loading,
    error,
    reloadResources,
    sortedResources,
    setSortOption,
    sortOption
  } = useResources()

  const handleAISearch = async (query) => {
    const keywords = await performAISearch(query)
    setSemanticKeywords(keywords)
    return keywords
  }

  // const handleAIContributions = async (url) => {
  //   const contributionData = await performAIContributions(url)
  //   return contributionData
  // }

  const handleClearFilters = () => {
    setFilters({ category: '', language: '', payment: '' })
    setSemanticKeywords([])
    setCurrentStepFilter(null)
  }

  const handleGetResources = async () => {
    getResources().then(data => {
      console.log("Resources from App.jsx:", data);
    }).catch(error => {
      console.error("Error fetching resources in App.jsx:", error);
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="ai-loading-indicator active mx-auto mb-4" />
          <p className="text-white text-lg">Loading resources...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card-component p-8 text-center">
          <p className="text-red-600 text-xl font-bold mb-4">Error Loading Resources</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={reloadResources}
            className="px-6 py-2 bg-primary-accent text-white rounded-md hover:opacity-80"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Header />
      
      <ManualContributeForm onContributionAdded={reloadResources} />
      <ContributeForm onContributionAdded={reloadResources} />
      
      <Filters 
        filters={filters}
        setFilters={setFilters}
        semanticKeywords={semanticKeywords}
        setSemanticKeywords={setSemanticKeywords}
        totalCount={resources.length}
        filteredCount={filteredResources.length}
        onAISearch={handleAISearch}
        onClearFilters={handleClearFilters}
        categories={categories}
        languages={languages}
        sorting={sortOption}
        setSortOption={setSortOption}
      />
      
      <UNPDiagram 
        currentStepFilter={currentStepFilter}
        setCurrentStepFilter={setCurrentStepFilter}
      />
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1 sticky top-8 self-start">
          <Charts 
            resources={resources}
            filteredResources={filteredResources}
          />
        </aside>
        
        <div className="lg:col-span-2">
          <KnowledgeSnippet keywords={semanticKeywords} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map((resource, index) => (
              <ResourceCard 
                key={resource.id}
                resource={resource}
                index={index}
                keywords={semanticKeywords}
              />
            ))}
          </div>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-16 card-component">
              <p className="text-2xl font-semibold" style={{ color: 'var(--primary-accent)' }}>
                No Resources Found
              </p>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default App
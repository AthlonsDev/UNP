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
import Auth from './components/auth.jsx'
import LinkHealthCheck from './components/LinkCheck';

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
    sortOption,
  } = useResources()

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [toggleForm, setToggleForm] = useState(false);

  const handleAISearch = async (query) => {
    const keywords = await performAISearch(query)
    setSemanticKeywords(keywords)
    return keywords
  }

  const handleCallback = (data) => {
    console.log("Callback data from Auth component:", data);
    if (data && data.isLoggedIn !== undefined) {
      setIsLoggedIn(data.isLoggedIn);
    }
  };

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

  const toggleContributeForm = () => {
    const formElement = document.getElementById('contributeformcontainer');
    if (formElement) {
      // formElement.classList.toggle('hidden');
      if (!toggleForm) {
        setToggleForm(true);
      } else {
        setToggleForm(false);
      }
      console.log("Toggle: ", toggleForm);
    }
  };

  const toggleLogin = () => {
    const authElement = document.getElementById('authcontainer');
    console.log("Toggling login form. Current toggle state:", toggle);
    if (authElement) {
      authElement.classList.toggle('hidden');
      if (!toggle) {
        setToggle(true);
      } else {
        setToggle(false);
      }
      console.log("Showing login form.", toggle);

    }
  };

  const hideLogin = () => {
    const authElement = document.getElementById('authcontainer');
    if (authElement && toggle) {
      authElement.classList.add('hidden');
      setToggle(false);
    }
  }


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
    <>
    <div id='login-container' className='place-self-end z-10'>

      <button className=" px-6 py-2 font-bold border border-white text-white rounded-md hover:opacity-80 transition-opacity hover:cursor-pointer hover:bg-sky-900 bg-sky-500 "
        onClick={toggleLogin}
        id='login-button'>
        👤
      </button>

    </div>

    <div id='authcontainer' className={`place-self-end flex z-20 ${toggle ? '' : 'hidden'}`}>
      <div className='absolute top-15 right-0 z-10'>
        <Auth onAuthChange={handleCallback} />
      </div>
    </div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" onClick={hideLogin}>

      <div className='absolute top-0 left-0 z-10'>
        <LinkHealthCheck />
      </div>

      <Header />

      <div className='text-center'>

        {/* <button type="button" disabled>
          <svg class="mr-2 size-10 animate-spin ..." viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing…
        </button> */}

      {isLoggedIn &&
        <button className="mt-4 mb-2 px-6 py-2 font-bold border border-white text-white rounded-md hover:opacity-80 transition-opacity hover:cursor-pointer hover:bg-sky-900 bg-sky-500 shadow-sm"
          onClick={toggleContributeForm}
          id='toggle-contribute-form-button'
        >
          +
        </button>
      }
      </div>

      <div id='contributeformcontainer' className={`mb-8 transition delay-150 duration-300 ease-in-out ${!toggleForm ? 'hidden' : ''}`}>
        <ManualContributeForm  onContributionAdded={reloadResources} />
      </div>

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
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-screen">
        <aside className="lg:col-span-1 sticky top-8 self-start overflow-y-auto">
          <Charts 
            resources={resources}
            filteredResources={filteredResources}
          />
        </aside>
        
        <div className="lg:col-span-2">
          <KnowledgeSnippet keywords={semanticKeywords} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[2000px]">
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
            <div className="text-center py-16 card-component overflow-y-auto">
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
    </>
  )
}

export default App
import './App.css';
import { useState, useEffect } from 'react'
import Header from './components/Header'
import ContributeForm from './components/ContributeForm'
import Filters from './components/Filters'
import UNPDiagram from './components/UNPDiagram'
import Charts from './components/Charts'
import KnowledgeSnippet from './components/KnowledgeSnippet'
import ResourceCard from './components/ResourceCard'
import { useResources } from './hooks/useResources'
import { performAISearch } from './hooks/useAISearch'
import { getRoot } from './services/api'
import ManualContributeForm from './components/ManualContribute.jsx'
import Auth from './components/auth.jsx'
import AISource from './components/AISource';
import { semanticSearch } from './services/SemanticSearch';
import { getResources } from './services/api'

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
}

const I = ({ size = 16, children, ...rest }) => (
  <svg {...base} width={size} height={size} {...rest}>{children}</svg>
)
const ChevronUpIcon = (p) => <I {...p}><path d="m6 15 6-6 6 6"/></I>
const ChevronDownIcon = (p) => <I {...p}><path d="m6 9 6 6 6-6"/></I>




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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [toggleForm, setToggleForm] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [filteredRes, setFilteredRes] = useState([]);
  const [aiSource, setAISource] = useState(); // Default to WebAI
  const [isStarted, setIsStarted] = useState(false);
  // const filteredResources = []
  const [isDesktop, setIsDesktop] = useState(
    () => window.innerWidth >= 900
  )

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 900)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }


  }, [])

  useEffect(() => {
    setIsStarted(false);
    console.log("app ready: ", isStarted);
    const indexingResources = async () => {
      await semanticSearch.indexDocuments(resources);
      console.log("Resources indexed for semantic search.");
      setIsStarted(true);
      console.log("app ready: ", isStarted);
    }
    indexingResources();
  }, [resources]);

  const getRootData = async () => {
      const data = await getRoot();
      if (data.ok) {
        console.log('Server is running and responding.');
        setLoading(false);
      }
  }

  const handleAISearch = async (query) => {
    // const keywords = await performAISearch(query, aiSource)
    const filteredRes = await semanticSearch.search(query);
    console.log("Filtered results from AI search:", filteredRes);
    setFilteredRes(filteredRes.map(item => item.document));
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

  useEffect(() => {
    console.log("Window width:", window.innerWidth);
    if (window.innerWidth < 900) {
      console.log("Mobile view detected. Hiding charts by default.");
    } else {
      console.log("Desktop view detected. Showing charts by default.");
    }
  }, [window]);

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


  const handleSourceSelect = (source) => {
    console.log("Selected AI source:", source);
    setAISource(source);
    // You can add logic here to handle the selected source, e.g., update state or make API calls
  }

  return (
    <>
    {!isStarted && (
      <div className="fullscreen-loading-overlay">
        <div className="text-center py-16">
          <div className="ai-loading-indicator active mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )}

    <div id='login-container' className='place-self-end z-12'>

      <button className="profile-btn"
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

      <div className='absolute top-0 left-0  z-10'>
        <AISource onSourceSelect={handleSourceSelect} />
      </div>

      <Header />

      <div className='text-center'>

      {isLoggedIn &&
        <button className="contribute-btn mb-4"
          onClick={toggleContributeForm}
          id='toggle-contribute-form-button'
        >
          {toggleForm === false && 'Add Resources'}
          {toggleForm === true && 'Close Form'}
        </button>
      }
      </div>

      <div id='contributeformcontainer' className={`mb-8 transition delay-150 duration-300 ease-in-out ${!toggleForm ? 'hidden' : ''}`}>
        <ManualContributeForm  onContributionAdded={reloadResources} source={aiSource} />
      </div>

      <Filters 
        filters={filters}
        setFilters={setFilters}
        semanticKeywords={semanticKeywords}
        setSemanticKeywords={setSemanticKeywords}
        totalCount={resources.length}
        filteredCount={filteredRes.length}
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

{/* Desktop Layout */}
{/* TODO: check if device is desktop or mobile */}
      {isDesktop ? (
        
        <aside className="lg:col-span-1 sticky top-8 self-start overflow-y-auto">
          <Charts 
            resources={resources}
            filteredResources={filteredResources}
          />
        </aside>
      ) : (
        <div className="sticky-following-button">
            <button className="contribute-btn mb-4 w-full" onClick={() => setShowCharts(!showCharts)}> Charts {showCharts ? 
              <div className="flex items-center justify-center">
                <ChevronUpIcon /> 
              </div>
              : 
              <div className="flex items-center justify-center">
                <ChevronDownIcon />
              </div>}</button>
            {showCharts && (
              <Charts 
                resources={resources}
                filteredResources={filteredResources}
              />
            )}
        </div>
      )}
        
        <div className="lg:col-span-2">
          <KnowledgeSnippet keywords={semanticKeywords} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[2000px] z-index-5">
            {filteredRes.length > 0 ? (
              filteredRes.map((resource, index) => (
                <ResourceCard 
                  key={resource.id}
                  resource={resource}
                  index={index}
                />
              ))
            ) : (
            filteredResources.map((resource, index) => (
              <ResourceCard 
                key={resource.id}
                resource={resource}
                index={index}
                keywords={semanticKeywords}
                AISource={aiSource}
              />
            ))
          )}
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
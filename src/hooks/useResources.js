import { useState, useEffect, useMemo } from 'react'
import { getResources } from '../services/api'

export function useResources() {
  const [resources, setResources] = useState([])
  const [filters, setFilters] = useState({
    category: '',
    language: '',
    payment: '',
    sorting:''
  })
  const [sorting, setSorting] = useState({
    sortingOptions: ''
  })
  const [semanticKeywords, setSemanticKeywords] = useState([])
  const [currentStepFilter, setCurrentStepFilter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOption, setSortOption] = useState(null);

  useEffect(() => {
    loadResources()
  }, [])

  async function loadResources() {
    try {
      setLoading(true)
      const data = await getResources()
      setResources(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredResources = useMemo(() => {
    var sortBy = () => 0; // Default no sorting
    return resources.filter(item => {
      const itemText = [
        item.name,
        item.description,
        item.subcategory,
        item.summaryBullets?.for,
        item.summaryBullets?.outcome,
        item.summaryBullets?.user
      ].join(' ').toLowerCase()

      

      const matchesSearch = semanticKeywords.length > 0
        ? semanticKeywords.some(kw => itemText.includes(kw.toLowerCase()))
        : true

      const matchesCategory = filters.category 
        ? item.category === filters.category 
        : true

      const matchesLanguage = filters.language
        ? item.languages.includes(filters.language) || item.languages.includes('Multilingual')
        : true

      const matchesStep = currentStepFilter
        ? item.unpSteps.includes(currentStepFilter)
        : true

      const matchesPayment = filters.payment
        ? item.payment === filters.payment
        : true

      console.log("Sorting...", filters.sorting);

      if (filters.sorting === 'User') {
        sortBy = (a, b) => (b?.evaluation?.user_score) - (a?.evaluation?.user_score)
      }
      if (filters.sorting === 'Total') {
        sortBy = (a, b) => (b?.evaluation?.totalScore) - (a?.evaluation?.totalScore)
      }
      

      return matchesSearch && matchesCategory && matchesLanguage && matchesStep && matchesPayment
    }).sort(sortBy);
  }, [resources, filters, semanticKeywords, currentStepFilter])

  const sortedResources = useMemo(() => {
    // Not needed as sorting is handled in filteredResources
    // But removing it breaks something else, too lazy to refactor now
    // So don't touch, unless you want to fix this properly :)
  }, [filteredResources, sorting])

      

  return {
    resources,
    filteredResources,
    filters,
    setFilters,
    semanticKeywords,
    setSemanticKeywords,
    currentStepFilter,
    setCurrentStepFilter,
    sortedResources,
    setSortOption,
    // loading,
    error
  }
}
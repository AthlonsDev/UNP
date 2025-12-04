import { useState, useEffect, useMemo } from 'react'
import { fetchResources } from '../services/api'

export function useResources() {
  const [resources, setResources] = useState([])
  const [filters, setFilters] = useState({
    category: '',
    language: '',
    payment: ''
  })
  const [semanticKeywords, setSemanticKeywords] = useState([])
  const [currentStepFilter, setCurrentStepFilter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadResources()
  }, [])

  async function loadResources() {
    try {
      setLoading(true)
      const data = await fetchResources()
      
      // Optionally merge with localStorage contributions
      const contributions = JSON.parse(localStorage.getItem('contributions') || '[]')
      const allResources = [...data, ...contributions]
      
      setResources(allResources)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Failed to load resources:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredResources = useMemo(() => {
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
        ? item.languages?.includes(filters.language) || item.languages?.includes('Multilingual')
        : true

      const matchesStep = currentStepFilter
        ? item.unpSteps?.includes(currentStepFilter)
        : true

      const matchesPayment = filters.payment
        ? item.payment === filters.payment
        : true

      return matchesSearch && matchesCategory && matchesLanguage && matchesStep && matchesPayment
    }).sort((a, b) => (b.evaluation?.totalScore || 0) - (a.evaluation?.totalScore || 0))
  }, [resources, filters, semanticKeywords, currentStepFilter])

  // Get unique categories and languages from loaded data
  const categories = useMemo(() => 
    [...new Set(resources.map(item => item.category))].filter(Boolean).sort(),
    [resources]
  )

  const languages = useMemo(() => 
    [...new Set(resources.flatMap(item => item.languages || []))].filter(Boolean).sort(),
    [resources]
  )

  return {
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
    reloadResources: loadResources
  }
}
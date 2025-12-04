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
      setResources(data)
    } catch (err) {
      setError(err.message)
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
        ? item.languages.includes(filters.language) || item.languages.includes('Multilingual')
        : true

      const matchesStep = currentStepFilter
        ? item.unpSteps.includes(currentStepFilter)
        : true

      const matchesPayment = filters.payment
        ? item.payment === filters.payment
        : true

      return matchesSearch && matchesCategory && matchesLanguage && matchesStep && matchesPayment
    }).sort((a, b) => b.evaluation.totalScore - a.evaluation.totalScore)
  }, [resources, filters, semanticKeywords, currentStepFilter])

  return {
    resources,
    filteredResources,
    filters,
    setFilters,
    semanticKeywords,
    setSemanticKeywords,
    currentStepFilter,
    setCurrentStepFilter,
    // loading,
    error
  }
}
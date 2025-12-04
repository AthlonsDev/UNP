import { useEffect, useRef } from 'react'
import ApexCharts from 'apexcharts'

export default function Charts({ resources, filteredResources }) {
  const categoryChartRef = useRef(null)
  const scoreChartRef = useRef(null)
  const categoryChartInstance = useRef(null)
  const scoreChartInstance = useRef(null)

  const getChartOptions = (extraOptions = {}) => ({
    chart: { 
      background: 'transparent', 
      toolbar: { show: false }, 
      animations: { easing: 'easeOutCubic', speed: 800 }
    },
    theme: { mode: 'light' },
    colors: ['#629158', '#00A3A3', '#F97316', '#FBBF24'],
    stroke: { show: false },
    grid: { show: false },
    ...extraOptions
  })

  useEffect(() => {
    if (!resources.length) return

    // Category Chart
    const categoryCounts = resources.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {})
    
    const allCategories = [...new Set(resources.map(i => i.category))].sort()
    const categorySeries = allCategories.map(cat => categoryCounts[cat] || 0)
    
    const catChartOptions = getChartOptions({
      series: categorySeries,
      chart: { 
        type: 'radialBar', 
        height: 350,
        ...getChartOptions().chart 
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: { fontSize: '22px' },
            value: { fontSize: '16px' },
            total: {
              show: true,
              label: 'Total',
              formatter: () => resources.length
            }
          }
        }
      },
      labels: allCategories,
    })

    categoryChartInstance.current = new ApexCharts(categoryChartRef.current, catChartOptions)
    categoryChartInstance.current.render()

    // Score Chart
    const scoreBins = resources.reduce((acc, item) => {
      const score = item.evaluation.totalScore
      if (score >= 25) acc['25+ (Excellent)']++
      else if (score >= 23) acc['23-24 (Great)']++
      else if (score >= 20) acc['20-22 (Good)']++
      else acc['<20 (Standard)']++
      return acc
    }, {
      '25+ (Excellent)': 0,
      '23-24 (Great)': 0,
      '20-22 (Good)': 0,
      '<20 (Standard)': 0
    })

    const scoreChartOptions = getChartOptions({
      series: Object.values(scoreBins),
      chart: { 
        type: 'polarArea', 
        height: 350,
        ...getChartOptions().chart 
      },
      labels: Object.keys(scoreBins),
      yaxis: { show: false },
      legend: { position: 'bottom' }
    })

    scoreChartInstance.current = new ApexCharts(scoreChartRef.current, scoreChartOptions)
    scoreChartInstance.current.render()

    // Cleanup
    return () => {
      categoryChartInstance.current?.destroy()
      scoreChartInstance.current?.destroy()
    }
  }, [resources])

  useEffect(() => {
    if (!categoryChartInstance.current || !scoreChartInstance.current) return

    // Update Category Chart
    const categoryCounts = filteredResources.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {})
    
    const allCategories = [...new Set(resources.map(i => i.category))].sort()
    const newCategorySeries = allCategories.map(cat => categoryCounts[cat] || 0)
    
    categoryChartInstance.current.updateOptions({
      plotOptions: {
        radialBar: {
          dataLabels: {
            total: {
              formatter: () => filteredResources.length
            }
          }
        }
      }
    })
    categoryChartInstance.current.updateSeries(newCategorySeries)

    // Update Score Chart
    const scoreBins = filteredResources.reduce((acc, item) => {
      const score = item.evaluation.totalScore
      if (score >= 25) acc['25+ (Excellent)']++
      else if (score >= 23) acc['23-24 (Great)']++
      else if (score >= 20) acc['20-22 (Good)']++
      else acc['<20 (Standard)']++
      return acc
    }, {
      '25+ (Excellent)': 0,
      '23-24 (Great)': 0,
      '20-22 (Good)': 0,
      '<20 (Standard)': 0
    })

    scoreChartInstance.current.updateSeries(Object.values(scoreBins))
  }, [filteredResources, resources])

  return (
    <div className="sticky-sidebar-content space-y-8">
      <div className="card-component p-4">
        <h3 className="font-bold text-xl mb-2 text-center">
          Resource Distribution by Type
        </h3>
        <p className="text-center text-gray-500 mb-4 text-sm px-2">
          This chart shows the breakdown of the 126 resources by their primary type.
        </p>
        <p className="text-center text-gray-500 mb-4 text-sm">
          Showing {filteredResources.length} of {resources.length} resources.
        </p>
        <div ref={categoryChartRef}></div>
      </div>
      
      <div className="card-component p-4">
        <h3 className="font-bold text-xl mb-2 text-center">
          Top Scoring Resources
        </h3>
        <p className="text-center text-gray-500 mb-4 text-sm px-2">
          This chart visualizes the quality of resources based on their evaluation score 
          against city-defined criteria.
        </p>
        <div ref={scoreChartRef}></div>
      </div>
    </div>
  )
}
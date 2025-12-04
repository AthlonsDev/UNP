const RESOURCE_DATA_PATH = '/Tools.json'

let cachedData = null

export async function fetchResources() {
  if (cachedData) {
    return cachedData
  }

  try {
    const response = await fetch(RESOURCE_DATA_PATH)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    cachedData = await response.json()
    return cachedData
  } catch (error) {
    console.error('Error fetching resource data:', error)
    throw error
  }
}

export async function addContribution(url, name) {
  try {
    const data = await fetchResources()
    const maxId = Math.max(...data.map(item => item.id), 0)
    
    const newEntry = {
      id: maxId + 1,
      url,
      name,
      category: "Tool",
      subcategory: "User Contributed",
      languages: ["EN"],
      payment: "Free",
      description: "",
      summaryBullets: { for: "", outcome: "", user: "" },
      unpSteps: [],
      evaluation: { totalScore: 0 },
      link: url,
      timestamp: new Date().toISOString()
    }
    
    // Store in localStorage (since we can't write to JSON directly)
    const contributions = JSON.parse(localStorage.getItem('contributions') || '[]')
    contributions.push(newEntry)
    localStorage.setItem('contributions', JSON.stringify(contributions))
    
    return newEntry
  } catch (error) {
    console.error('Error adding contribution:', error)
    throw error
  }
}
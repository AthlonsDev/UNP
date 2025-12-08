// import { axios } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/";

export async function postContribution(features) {
  const response = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });
  return await response.json();
}



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

    postContribution(newEntry)

    console.log('New data: ', cachedData)
    
    return newEntry
  } catch (error) {
    console.error('Error adding contribution:', error)
    throw error
  }
}
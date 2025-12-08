<<<<<<< HEAD
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
=======
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
>>>>>>> f5f42b7a5024a7421c997e0732eab85bbbf1abbc

export async function getRoot() {
  const response = await fetch(`${API_URL}/`);
  return await response.json();
}

export async function getResources() {
  const response = await fetch(`${API_URL}/get_data`);
  console.log("Fetched resources:", response);
  return await response.json();
}

export async function updateResources(data) {
  const response = await fetch(`${API_URL}/update_data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await response.json();
}

export async function updateUserScore(resourceId, userScore) {
  const response = await fetch(`${API_URL}/update_score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ resourceId, userScore })
  });
  return await response.json();
}






const RESOURCE_DATA_PATH = '/Tools.json'


let cachedData = null
var randId = function() {
  return 'id-' + Math.random();
};

export async function addContribution(url, name) {
    const newEntry = {
      id: randId(),
      url,
      name,
      category: "Tool",
      subcategory: "User Contributed",
      languages: ["EN"],
      payment: "Free",
      description: "",
      summaryBullets: { for: "", outcome: "", user: "" },
      unpSteps: [],
      evaluation: { totalScore: 0, user_score: 0 },
      link: url,
      timestamp: new Date().toISOString()
<<<<<<< HEAD
    };
    const response = await updateResources(newEntry);
    return response;

=======
    }

    postContribution(newEntry)

    console.log('New data: ', cachedData)
    
    return newEntry
  } catch (error) {
    console.error('Error adding contribution:', error)
    throw error
  }
>>>>>>> f5f42b7a5024a7421c997e0732eab85bbbf1abbc
}
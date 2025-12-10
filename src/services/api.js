import { performAIContributions } from "../hooks/useAIContributions";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
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

let cachedData = null
var randId = function() {
  return 'id-' + Math.random();
};

export async function addContribution(url) {

    const AIEntry = await performAIContributions(url);
    if (AIEntry) {
      console.log("AI Contribution Entry added:", AIEntry);
      const response = await updateResources(AIEntry);
      return response;
    }

    // const newEntry = {
    //   id: randId(),
    //   url,
    //   name,
    //   category: "Tool",
    //   subcategory: "User Contributed",
    //   languages: ["EN"],
    //   payment: "Free",
    //   description: "",
    //   summaryBullets: { for: "", outcome: "", user: "" },
    //   unpSteps: [],
    //   evaluation: { totalScore: 0, user_score: 0 },
    //   link: url,
    //   timestamp: new Date().toISOString()
    // };
    const response = await updateResources(newEntry);
    return response;

  }
import { performAIContributions } from "../hooks/useAIContributions";
import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
export async function getRoot() {
  const response = await fetch(`${API_URL}/`);
  return await response.json();
}

export async function getResources() {
  const response = await fetch(`${API_URL}/get_data`);
  // console.log("Fetched resources:", response);
  return await response.json();
}

export async function updateResources(data) {
  // response to send string instead of object
  const response = await fetch(`${API_URL}/update_data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'url': data })
  });
  return await response.json();
};

export async function upvoteScore(id) {
  const res = await fetch(`${API_URL}/upvote/${id}?score=1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ resourceId: id, userScore: 1 })
  });
  return await res.json();
}

export async function downvoteScore(id) {
  const res = await fetch(`${API_URL}/downvote/${id}?score=-1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ resourceId: id, userScore: -1 })
  });
  return await res.json();
}

// let cachedData = null
// var randId = function() {
//   return 'id-' + Math.random();
// };

export async function addContribution(url) {

    const AIEntry = await performAIContributions(url);
    if (AIEntry) {
      // console.log("AI Contribution Entry added:", AIEntry);
      const response = await updateResources(AIEntry);
      return response;
    }

    const response = await updateResources(newEntry);
    return response;

  }
import { performAIContributions } from "../hooks/useAIContributions";
import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
// const API_URL = import.meta.env.VITE_API_URL || "https://13.135.231.65";
// const API_URL = import.meta.env.VITE_API_URL || "https://gxac4qj060.execute-api.eu-west-2.amazonaws.com/Stage01";
export async function getRoot() {
  const response = await fetch(`${API_URL}/`);
  return await response.json();
}

export async function getResources() {
  const response = await fetch(`${API_URL}/get_data`, {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`get_data failed: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();

  if (!text || !text.trim()) {
    return [];
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('get_data returned non-JSON content');
  }
}

export async function checkBadURL() {
  const response = await fetch(`${API_URL}/link_check`);
  return await response.json();
}

export async function updateResources(data) {
  const response = await fetch(`${API_URL}/update_data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'data': data })
  });
  return await response.json();
};

export async function AISearch(prompt) {
  const response = await fetch(`${API_URL}/ai_search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'prompt': prompt })
  });
  return await response.json();
};

export async function reportLink(id) {
  const res = await fetch(`${API_URL}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: id })
  });
  return await res.json();
}

export async function upvoteScore(id) {
  const res = await fetch(`${API_URL}/upvote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: id })
  });
  return await res.json();
}

export async function downvoteScore(id) {
  const res = await fetch(`${API_URL}/downvote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: id })
  });
  return await res.json();
}

export async function fillForm(query) {
  const response = await fetch(`${API_URL}/fill_form`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'url': query })
  });
  return await response.json();
}

export async function updateLink(data) {
  const response = await fetch(`${API_URL}/update_links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'urls': data })
  });
  return await response.json();
}

export async function sumRes(data) {
  const response = await fetch(`${API_URL}/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'url': data })
  });
  return await response.json();
}



export async function authUser(username, password) {
  const response = await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 'username': username, 'password': password})
  });
    return await response.json();
}

// For testing purposes only, to be removed later
export async function getNewLinks() {
  const response = await fetch(`${API_URL}/replace_link`);
  return await response.json();
}

export async function replaceLink(link) {
    const response = await fetch(`${API_URL}/replace_link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 'url': link })
    });
    return await response.json();
}

export async function getBadLinks() {
  const response = await fetch(`${API_URL}/bad_links`);
  return await response.json();
}


export async function startServer() {
  const response = await fetch(`${API_URL}/start`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error('Failed to start server');
  }
  if (response.status === 200) {
    return response;
  }
}


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
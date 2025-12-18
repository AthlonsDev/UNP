import { generateSvgBackground } from '../utils/svgPatterns.js'
// import { updateUserScore } from '../services/api.js'
import { getResources, upvoteScore, downvoteScore } from '../services/api.js'
import React from 'react'
import { useState } from 'react'
import { int, set } from 'zod'

const icons = {
  'Tool': '🔧',
  'Guidance': '📖',
  'Programme': '🚀',
  'Platform': '🌐',
  'Upvote': '👍',
  'Downvote': '👎'
}

export default function ResourceCard({ resource, index, keywords }) {
  const isFeatured = index === 0
  const patternUrl = generateSvgBackground(resource.category)
  const icon = icons[resource.category] || '⭐'
  const [score, setScore] = useState(resource.evaluation.user_score || 0);
  const [hasVoted, setHasVoted] = useState(0); // set id of voted resource
  const [voteType, setVoteType] = useState(null); // 'upvote', 'downvote', or null


  const highlightText = (text) => {
    if (keywords.length === 0) return text
    
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi')
    return text.replace(regex, (match) => `<span class="highlight">${match}</span>`)
  }

  const sortResourcesByScore = (int) => {
    if (resource.evaluation.totalScore >= 0) {
      // sort resources as descending based on totalScore
      return setResources(prevResources => 
        [...prevResources].sort((a, b) => b.evaluation.totalScore - a.evaluation.totalScore)
      )

    }
  }

  const upvote = async () => {
    // alert(`You liked: ${resource.id}`)
    var _id = resource.id-1
    const res = await upvoteScore(_id);
    setScore(score + 1);
    setHasVoted(_id);
    setVoteType('upvote');
    console.log("Upvoted resource:", _id);
    // Refresh page data
    await getResources();
  }

  const downvote = async () => {
    // alert(`You disliked: ${resource.id}`)
    var _id = resource.id-1
    const res = await downvoteScore(_id);
    setScore(score - 1);
    setHasVoted(_id);
    setVoteType('downvote');
    await getResources();
  }

  return (

    <div 
      className="resource-card card-component card-enter"
      style={{ animationDelay: `${index * 50}ms` }}
    >

      <div 
        className="card-bg-pattern" 
        style={{ backgroundImage: `url('${patternUrl}')`}}
      />
      
      <div className="p-6 flex flex-col h-full relative">
        
        {isFeatured && (
          <div 
            className="absolute top-0 right-0 text-white font-bold text-xs py-1 px-3 rounded-tr-xl rounded-bl-xl"
            style={{ backgroundColor: 'var(--dark-green-badge)' }}
          >
            
            🏆 Top Scored

            <button className={`absolute top-7 right-0 inline-block text-center font-bold text-white py-2 px-4 rounded-md hover:bg-opacity-80 transition-transform transform hover:scale-105 hover:cursor-pointer ${voteType === 'upvote' ? 'bg-green-600' : ''}`}
              onClick={upvote}
              disabled={voteType === "upvote"}>
              {icons['Upvote']}
            </button>
            <button className={`absolute top-7 right-12 inline-block text-center font-bold text-white py-2 px-4 rounded-md hover:bg-opacity-80 transition-transform transform hover:scale-105 hover:cursor-pointer ${voteType === 'downvote' ? 'bg-red-600' : ''}`}
              onClick={downvote}
              disabled={voteType === "downvote"}>
              {icons['Downvote']}
            </button>
          <p className='absolute top-15 right-4 text-black font-bold text-xs py-1 px-3 rounded-tr-xl rounded-bl-xl'>
            Score: {score}
          </p>
          </div>          
          
        )}

        {isFeatured || (
          <div>
            <button className={`absolute top-0 right-0 inline-block text-center font-bold text-white py-2 px-4 rounded-md hover:bg-opacity-80 transition-transform transform hover:scale-105 hover:cursor-pointer ${voteType === 'upvote' ? 'bg-green-600': ''}`}
              onClick={upvote}
              disabled={voteType === "upvote"}>
              {icons['Upvote']}
            </button>
            <button className={`absolute top-0 right-12 inline-block text-center font-bold text-white py-2 px-4 rounded-md hover:bg-opacity-80 transition-transform transform hover:scale-105 hover:cursor-pointer ${voteType === 'downvote' ? 'bg-red-600': ''}`}
              onClick={downvote}
              disabled={voteType === "downvote"}>
              {icons['Downvote']}
            </button>
            <p className='absolute top-10 right-4 text-black font-bold text-xs py-1 px-3 rounded-tr-xl rounded-bl-xl'>
              Score: {score}
            </p>
          </div>
        )}

        <h4 
          className="text-xl font-bold pr-16"
          style={{ color: 'var(--primary-accent)' }}
          dangerouslySetInnerHTML={{ __html: `${icon} ${highlightText(resource.name)}` }}
        />
        
        <div className="my-2">
          <span className="text-sm font-semibold">{resource.category}</span>
          <span className="text-sm text-gray-500"> / {resource.subcategory}</span>
        </div>
        
        <p 
          className="text-gray-600 text-sm mt-2 flex-grow"
          dangerouslySetInnerHTML={{ __html: highlightText(resource.description) }}
        />
        
        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p><strong>For:</strong> {resource.summaryBullets.for}</p>
          <p><strong>Outcome:</strong> {resource.summaryBullets.outcome}</p>
        </div>
        
        <div className="mt-auto pt-6">
          <a 
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-block text-center font-bold text-white py-2 px-4 rounded-md hover:bg-opacity-80 transition-transform transform hover:scale-105"
            style={{ backgroundColor: 'var(--accent-orange)' }}
          >
            Access Resource →
          </a>
        </div>
      </div>
    </div>
  )
}
import { generateSvgBackground } from '../utils/svgPatterns.js'

const icons = {
  'Tool': '🔧',
  'Guidance': '📖',
  'Programme': '🚀',
  'Platform': '🌐'
}

export default function ResourceCard({ resource, index, keywords }) {
  const isFeatured = index === 0
  const patternUrl = generateSvgBackground(resource.category)
  const icon = icons[resource.category] || '⭐'

  const highlightText = (text) => {
    if (keywords.length === 0) return text
    
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi')
    return text.replace(regex, (match) => `<span class="highlight">${match}</span>`)
  }

  return (
    <div 
      className="resource-card card-component card-enter"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div 
        className="card-bg-pattern" 
        style={{ backgroundImage: `url('${patternUrl}')` }}
      />
      
      <div className="p-6 flex flex-col h-full relative">
        {isFeatured && (
          <div 
            className="absolute top-0 right-0 text-white font-bold text-xs py-1 px-3 rounded-tr-xl rounded-bl-xl"
            style={{ backgroundColor: 'var(--dark-green-badge)' }}
          >
            🏆 Top Scored
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
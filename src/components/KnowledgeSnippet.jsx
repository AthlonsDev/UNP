import { knowledgeSnippets } from '../utils/knowledgeSnippets'

export default function KnowledgeSnippet({ keywords }) {
  if (keywords.length === 0) return null

  const queryText = keywords.join(' ').toLowerCase()
  
  const foundSnippet = knowledgeSnippets.find(snippet =>
    snippet.keywords.some(kw => queryText.includes(kw))
  )

  if (!foundSnippet) return null

  return (
    <div className="card-component p-6 mb-6">
      <h3 
        className="text-lg font-bold flex items-center"
        style={{ color: 'var(--primary-accent)' }}
      >
        <span className="text-2xl mr-2">💡</span>
        <span>{foundSnippet.title}</span>
      </h3>
      <p 
        className="mt-2 text-sm text-gray-700"
        dangerouslySetInnerHTML={{ __html: foundSnippet.text }}
      />
    </div>
  )
}
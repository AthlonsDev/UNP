import { useState } from 'react'
import { addContribution } from '../services/api'

export default function ContributeForm() {
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url || !name) {
      // alert("Please fill in both the URL and Name fields before submitting.")
      return
    }

    try {
<<<<<<< HEAD
      await addContribution(url, name)
=======
      await addContribution({ url, name })

>>>>>>> f5f42b7a5024a7421c997e0732eab85bbbf1abbc
      // Reset form
      setUrl('')
      setName('')
    } catch (error) {
      console.error('Error saving contribution:', error)
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <section className="card-component p-6 mb-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-accent)' }}>
          Contribute
        </h2>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              required
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Resource name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 font-bold text-white rounded-md hover:opacity-80 transition-opacity"
            style={{ backgroundColor: 'var(--accent-orange)' }}
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  )
}
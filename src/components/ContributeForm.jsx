import { useState } from 'react'
import { addContribution } from '../services/api'
import '../App.css'
import { updateResources } from '../services/api'

export default function ContributeForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url) {
      // alert("Please fill in both the URL and Name fields before submitting.")
      return
    }

    try {
      // await addContribution(url)
      setLoading(true)
      const response = await updateResources(url);
      if (response) {
        setLoading(false);
        alert('Contribution submitted successfully!')
      }
      setUrl('')
      
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
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 font-bold text-white rounded-md hover:opacity-80 transition-opacity hover:cursor-pointer hover:bg-sky-900 bg-sky-600"
          >
            Submit
          </button>
          {loading &&
            <div class="justify-center mt-4 flex">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900">
              </div>
              {/* <!-- From Uiverse.io by xXJollyHAKERXx -->  */}
              {/* <div class="spinner">
                  <div class="spinner1"></div>
              </div> */}
            </div>
          }
        </form>
      </div>
    </section>
  )
}
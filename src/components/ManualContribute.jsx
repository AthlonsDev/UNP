import { useState } from 'react'
import { addContribution } from '../services/api'
import '../App.css'
import { updateResources } from '../services/api'
import { set } from 'zod'

export default function ContributeForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url) {
      // alert("Please fill in both the URL and Name fields before submitting.")
      return
    }

    try {
      // await addContribution(url)
      setLoading(true)
      console.log("Submitting contribution with URL:", url);
      const response = await updateResources(url);
      if (response) {
        setLoading(false);
        setSuccess(true);
        setError(false);
        // alert('Contribution submitted successfully!')
      }
      setUrl('')
      
    } catch (error) {
      console.error('Error saving contribution:', error)
      alert('An error occurred. Please try again.')
      setLoading(false);
      setSuccess(false);
      setError(true);
    }
  }

  return (
    <section className="card-component p-6 mb-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-accent)' }}>
            Submit New Resource
        </h2>
        <h3>
            Know a useful resource that's missing? Share it with us by filling the form below.
            It will be reviewed and added to our collection!
        </h3>
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
            className="mt-4 px-6 py-2 font-bold text-white rounded-md hover:opacity-80 transition-opacity hover:cursor-pointer hover:bg-sky-900 bg-sky-500"
          >
            Submit
          </button>
          {loading &&
            <div class="justify-center mt-4 flex">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900">
              </div>
            </div>
          }
          {success &&
            <p className="text-green-600 font-bold mt-4">Contribution submitted successfully!</p>
          }
          {error &&
            <p className="text-red-600 font-bold mt-4">An error occurred. Please try again.</p>
          }
        </form>
      </div>
    </section>
  )
}
import { useState } from 'react'
import axios from 'axios'

function App() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await axios.post('/api/review', { code, language })
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>AI Code Reviewer</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            maxLength={5000}
            rows={10}
            cols={50}
            required
          />
        </div>
        <div>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Language (e.g. python)"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Reviewing...' : 'Submit Code'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <pre>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default App

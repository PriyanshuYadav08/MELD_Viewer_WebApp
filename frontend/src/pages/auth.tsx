import { useState } from 'react'

type AuthPageProps = {
  onLoginSuccess: (email: string) => void
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [email, setEmail] = useState('demo@meldviewer.app')
  const [password, setPassword] = useState('demo123')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Login failed')
      }

      const json = await response.json()
      setStatus(json.message)
      onLoginSuccess(json.user_email)
    } catch (error) {
      if (error instanceof Error) {
        setStatus(error.message)
      } else {
        setStatus('Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h1>Sign in</h1>
        <p>Use the demo credentials or enter your own details.</p>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </label>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <div className="panel-footer">
        <p>
          Demo: <strong>demo@meldviewer.app</strong> / <strong>demo123</strong>
        </p>
        {status && <p className="status-message">{status}</p>}
      </div>
    </section>
  )
}
'use client'

import { useActionState } from 'react'

import { login } from '../auth-actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null)
  return (
    <div className="login-wrap">
      <form className="login-card" action={action}>
        <h1>JV Ventures CMS</h1>
        <p className="muted">Sign in to edit the website.</p>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="username" autoFocus />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        {state?.error && <p className="err-msg" style={{ marginBottom: '1rem' }}>{state.error}</p>}
        <button className="btn btn-primary" type="submit" disabled={pending} style={{ width: '100%', justifyContent: 'center' }}>
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './Login.css'

export default function Login({ onLogin, onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const emailLower = email.trim().toLowerCase()

    try {
      // 1. Tenta login como Proprietário (Supabase Auth)
      if (emailLower === 'ricardo.mazon@escola.pr.gov.br') {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: emailLower,
          password,
        })
        if (authError) throw authError
        onLogin(data.user)
        return
      }

      // 2. Tenta login como Funcionário (tabela funcionarios)
      const { data: funcionario, error: funcError } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('email', emailLower)
        .eq('senha', password)
        .single()

      if (funcError || !funcionario) {
        throw new Error('E-mail ou senha incorretos')
      }

      const userFuncionario = {
        id: funcionario.id,
        email: funcionario.email,
        user_metadata: {
          role: 'colaborador',
          nome: funcionario.nome,
        },
        isFuncionario: true,
      }

      onLogin(userFuncionario)
    } catch (err) {
      let msg = err.message || 'Erro ao realizar login'
      if (msg.includes('Invalid login credentials')) {
        msg = 'E-mail ou senha incorretos'
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      {onBack && (
        <button onClick={onBack} className="login-back-btn" title="Voltar para a página inicial">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Início</span>
        </button>
      )}

      <div className="login-card">
        {/* Topo / Logo */}
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <h1 className="login-title">GreenTask</h1>
          <p className="login-subtitle">Entre com suas credenciais para continuar</p>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="login-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Senha</label>
            <div className="input-container">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                style={{ paddingRight: '36px' }}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? (
              <>
                <span className="spinner" />
                <span>Entrando...</span>
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="login-card-footer">
          GreenTask &bull; Gestão Sustentável de Tarefas
        </div>
      </div>
    </div>
  )
}
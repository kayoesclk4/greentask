import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailLower,
          password,
        })
        if (error) throw error
        onLogin(data.user)
        return
      }

      // 2. Tenta login como Funcionário (tabela funcionarios)
      const { data: funcionario, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('email', emailLower)
        .eq('senha', password)
        .single()

      if (error || !funcionario) {
        throw new Error('E-mail ou senha incorretos')
      }

      // Cria um objeto de usuário parecido com o do Supabase
      const userFuncionario = {
        id: funcionario.id,
        email: funcionario.email,
        user_metadata: {
          role: 'colaborador',
          nome: funcionario.nome
        },
        // marca que veio da tabela funcionarios
        isFuncionario: true
      }

      onLogin(userFuncionario)

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#2e7d32', 
          marginBottom: '8px',
          fontSize: '28px'
        }}>
          Green Task
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginBottom: '30px' 
        }}>
          Gestão de tarefas sustentável
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500' }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
              placeholder="seu@email.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
              placeholder="Digite sua senha"
            />
          </div>

          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#81c784' : '#2e7d32',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
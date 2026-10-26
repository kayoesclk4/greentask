import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import TaskList from './components/TaskList'
import CadastrarFuncionario from './components/CadastrarFuncionario'
import GerenciarSetores from './components/GerenciarSetores'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tela, setTela] = useState('tarefas') // tarefas | funcionarios | setores

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const isOwner = user?.email === 'ricardo.mazon@escola.pr.gov.br' ||
                  user?.user_metadata?.role === 'proprietario'

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e8f5e9',
        fontFamily: 'Arial, sans-serif',
        color: '#2e7d32',
        fontSize: '18px'
      }}>
        Carregando...
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: '#2e7d32',
        color: 'white',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h1 style={{ margin: 0, fontSize: '22px' }}>Green Task</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {isOwner && (
            <>
              <button
                onClick={() => setTela('tarefas')}
                style={{
                  background: tela === 'tarefas' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Tarefas
              </button>
              <button
                onClick={() => setTela('funcionarios')}
                style={{
                  background: tela === 'funcionarios' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Funcionários
              </button>
              <button
                onClick={() => setTela('setores')}
                style={{
                  background: tela === 'setores' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Setores
              </button>
            </>
          )}

          <span style={{ fontSize: '13px', marginLeft: '8px' }}>{user.email}</span>

          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <main style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
        {tela === 'tarefas' && <TaskList user={user} />}
        {tela === 'funcionarios' && isOwner && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CadastrarFuncionario onClose={() => setTela('tarefas')} />
          </div>
        )}
        {tela === 'setores' && isOwner && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GerenciarSetores onClose={() => setTela('tarefas')} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
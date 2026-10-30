import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import LandingPage from './components/LandingPage'
import TaskList from './components/TaskList'
import CadastrarFuncionario from './components/CadastrarFuncionario'
import GerenciarSetores from './components/GerenciarSetores'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authView, setAuthView] = useState('landing') // 'landing' | 'login'
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
    setAuthView('landing')
  }

  const isOwner = user?.email === 'ricardo.mazon@escola.pr.gov.br' ||
                  user?.user_metadata?.role === 'proprietario'

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-spinner" />
        <span>Carregando GreenTask...</span>
      </div>
    )
  }

  // Visitante não autenticado: Landing Page ou Login
  if (!user) {
    if (authView === 'login') {
      return (
        <Login
          onLogin={setUser}
          onBack={() => setAuthView('landing')}
        />
      )
    }

    return (
      <LandingPage
        onGoToLogin={() => setAuthView('login')}
      />
    )
  }

  // Usuário autenticado
  return (
    <div className="app-layout">
      {/* Header Limpo */}
      <header className="app-header">
        <div className="app-brand" onClick={() => setTela('tarefas')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <span className="app-brand-title">GreenTask</span>
        </div>

        {/* Abas para Proprietário */}
        {isOwner && (
          <nav className="app-nav-tabs">
            <button
              onClick={() => setTela('tarefas')}
              className={`app-nav-btn ${tela === 'tarefas' ? 'active' : ''}`}
            >
              Tarefas
            </button>
            <button
              onClick={() => setTela('funcionarios')}
              className={`app-nav-btn ${tela === 'funcionarios' ? 'active' : ''}`}
            >
              Funcionários
            </button>
            <button
              onClick={() => setTela('setores')}
              className={`app-nav-btn ${tela === 'setores' ? 'active' : ''}`}
            >
              Setores
            </button>
          </nav>
        )}

        {/* Informações do Usuário e Logout */}
        <div className="app-user-section">
          <span className="app-user-email">{user.email}</span>
          <button onClick={handleLogout} className="app-logout-btn">
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="app-main">
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
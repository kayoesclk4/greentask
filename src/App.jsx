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
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('greentask_theme')
    if (saved) return saved
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('greentask_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

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
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )
    }

    return (
      <LandingPage
        onGoToLogin={() => setAuthView('login')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  // Usuário autenticado
  return (
    <div className="app-layout">
      {/* Header Material 3 Expressive com Transparência */}
      <header className="app-header">
        <div className="app-brand" onClick={() => setTela('tarefas')}>
          <div className="app-brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <span className="app-brand-title">GreenTask</span>
        </div>

        {/* Abas Expressivas Centralizadas para Proprietário */}
        {isOwner ? (
          <nav className="app-nav-tabs">
            <button
              onClick={() => setTela('tarefas')}
              className={`app-nav-btn ${tela === 'tarefas' ? 'active' : ''}`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <span>Tarefas</span>
            </button>
            <button
              onClick={() => setTela('funcionarios')}
              className={`app-nav-btn ${tela === 'funcionarios' ? 'active' : ''}`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Funcionários</span>
            </button>
            <button
              onClick={() => setTela('setores')}
              className={`app-nav-btn ${tela === 'setores' ? 'active' : ''}`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>Setores</span>
            </button>
          </nav>
        ) : (
          <div className="app-nav-placeholder" />
        )}

        {/* Informações do Usuário, Tema Escuro e Logout */}
        <div className="app-user-section">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            <span className="theme-toggle-label">{theme === 'dark' ? 'Claro' : 'Escuro'}</span>
          </button>

          <div className="app-user-chip">
            <span className="app-user-avatar">
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </span>
            <span className="app-user-email">{user.email}</span>
          </div>

          <button onClick={handleLogout} className="app-logout-btn" title="Sair da conta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sair</span>
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
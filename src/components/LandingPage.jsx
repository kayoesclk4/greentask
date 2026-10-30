import './LandingPage.css'

export default function LandingPage({ onGoToLogin, theme, onToggleTheme }) {
  return (
    <div className="landing-container">
      {/* Barra de Navegação Material 3 Expressive com Transparência */}
      <header className="landing-navbar">
        <div className="landing-brand">
          <div className="landing-brand-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <span className="landing-brand-title">GreenTask</span>
        </div>

        {/* Botões de Navegação Centralizados */}
        <nav className="landing-nav-center">
          <a href="#inicio" className="landing-nav-btn active">
            <span>Início</span>
          </a>
          <a href="#recursos" className="landing-nav-btn">
            <span>Recursos</span>
          </a>
          <a href="#sustentabilidade" className="landing-nav-btn">
            <span>Sustentabilidade</span>
          </a>
        </nav>

        <div className="landing-nav-actions">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
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
          )}

          <button onClick={onGoToLogin} className="landing-btn-login">
            Acessar Conta
          </button>
        </div>
      </header>

      {/* Hero Central */}
      <main className="landing-hero">
        <div className="landing-pill">
          <span>🌱</span> Gestão Inteligente & Ecológica
        </div>

        <h1 className="landing-title">
          Organize tarefas e conecte sua equipe com <span>sustentabilidade</span>.
        </h1>

        <p className="landing-subtitle">
          Uma plataforma simples e prática para distribuir demandas por setor, acompanhar prazos em tempo real e eliminar o papel da rotina da sua empresa.
        </p>

        <div className="landing-hero-actions">
          <button onClick={onGoToLogin} className="landing-btn-primary">
            <span>Entrar na Plataforma</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        {/* 3 Cartões de Recursos com Transparência */}
        <div className="landing-features">
          <div className="landing-card">
            <div className="landing-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h3 className="landing-card-title">Divisão por Setores</h3>
            <p className="landing-card-desc">
              Organize atribuições com clareza entre departamentos e colaboradores específicos.
            </p>
          </div>

          <div className="landing-card">
            <div className="landing-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="landing-card-title">Prazos e Prioridades</h3>
            <p className="landing-card-desc">
              Acompanhe o status das demandas e garanta entregas no tempo certo sem estresse.
            </p>
          </div>

          <div className="landing-card">
            <div className="landing-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <h3 className="landing-card-title">100% Digital e Verde</h3>
            <p className="landing-card-desc">
              Substitua planilhas desorganizadas e folhas de papel por processos modernos e limpos.
            </p>
          </div>
        </div>
      </main>

      {/* Rodapé Simples */}
      <footer className="landing-footer">
        GreenTask &bull; Gestão Sustentável de Tarefas
      </footer>
    </div>
  )
}

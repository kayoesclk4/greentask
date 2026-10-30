import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function GerenciarSetores({ onClose }) {
  const [setores, setSetores] = useState([])
  const [nome, setNome] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [editNome, setEditNome] = useState('')
  const [loading, setLoading] = useState(true)
  const [mensagem, setMensagem] = useState(null)

  const fetchSetores = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('setores')
      .select('*')
      .order('nome')

    if (!error) setSetores(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchSetores()
  }, [])

  const handleCriar = async (e) => {
    e.preventDefault()
    if (!nome.trim()) return

    const { error } = await supabase
      .from('setores')
      .insert({ nome: nome.trim() })

    if (error) {
      setMensagem({ tipo: 'erro', texto: error.message })
    } else {
      setNome('')
      setMensagem({ tipo: 'sucesso', texto: 'Setor criado com sucesso!' })
      fetchSetores()
    }
  }

  const handleEditar = async (id) => {
    if (!editNome.trim()) return

    const { error } = await supabase
      .from('setores')
      .update({ nome: editNome.trim() })
      .eq('id', id)

    if (error) {
      setMensagem({ tipo: 'erro', texto: error.message })
    } else {
      setEditandoId(null)
      setEditNome('')
      setMensagem({ tipo: 'sucesso', texto: 'Setor atualizado!' })
      fetchSetores()
    }
  }

  const handleExcluir = async (id, nomeSetor) => {
    if (!confirm(`Excluir o setor "${nomeSetor}"?`)) return

    const { error } = await supabase
      .from('setores')
      .delete()
      .eq('id', id)

    if (error) {
      setMensagem({ tipo: 'erro', texto: error.message })
    } else {
      setMensagem({ tipo: 'sucesso', texto: 'Setor excluído!' })
      fetchSetores()
    }
  }

  return (
    <div className="setores-modal-card" style={{
      background: 'white',
      padding: '28px',
      borderRadius: '20px',
      boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
      maxWidth: '580px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'rgba(22, 163, 74, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16a34a'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h2 style={{ margin: 0, color: '#166534', fontSize: '20px', fontWeight: '750' }}>Gerenciar Setores</h2>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1
          }}
          title="Fechar"
        >
          ✕
        </button>
      </div>

      {/* Formulário criar */}
      <form onSubmit={handleCriar} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do novo setor (ex: Logística)"
          required
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1.5px solid #cbd5e1',
            background: '#ffffff',
            color: '#0f172a',
            fontSize: '14.5px',
            boxSizing: 'border-box',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{
            background: '#16a34a',
            color: 'white',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontWeight: '650',
            fontSize: '14.5px',
            whiteSpace: 'nowrap',
            boxShadow: '0 3px 10px rgba(22, 163, 74, 0.25)',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          + Criar
        </button>
      </form>

      {mensagem && (
        <div style={{
          background: mensagem.tipo === 'sucesso' ? '#dcfce7' : '#fee2e2',
          color: mensagem.tipo === 'sucesso' ? '#166534' : '#991b1b',
          border: `1px solid ${mensagem.tipo === 'sucesso' ? '#bbf7d0' : '#fecaca'}`,
          padding: '11px 14px',
          borderRadius: '10px',
          marginBottom: '18px',
          fontSize: '13.5px',
          fontWeight: '550'
        }}>
          {mensagem.texto}
        </div>
      )}

      {/* Lista de setores em cinza de alto contraste */}
      <div style={{ marginBottom: '10px', fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Setores Cadastrados ({setores.length})
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Carregando setores...</p>
      ) : setores.length === 0 ? (
        <div style={{
          background: '#f1f5f9',
          border: '1.5px dashed #cbd5e1',
          padding: '28px',
          borderRadius: '14px',
          textAlign: 'center',
          color: '#64748b'
        }}>
          Nenhum setor cadastrado ainda. Crie o primeiro acima!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {setores.map((setor) => (
            <div
              key={setor.id}
              className="setor-item-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: '#e2e8f0', // Cinza sólido de alto contraste
                borderRadius: '14px',
                border: '1.5px solid #cbd5e1',
                boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
                transition: 'transform 0.15s ease'
              }}
            >
              {editandoId === setor.id ? (
                <>
                  <input
                    type="text"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #94a3b8',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: '14px'
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditar(setor.id)}
                    style={{
                      background: '#16a34a',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '650'
                    }}
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => { setEditandoId(null); setEditNome('') }}
                    style={{
                      background: '#cbd5e1',
                      color: '#334155',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#334155',
                    flexShrink: 0
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <span style={{ flex: 1, fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>
                    {setor.nome}
                  </span>
                  <button
                    onClick={() => { setEditandoId(setor.id); setEditNome(setor.nome) }}
                    style={{
                      background: '#dbeafe',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      padding: '7px 15px',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '650'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(setor.id, setor.nome)}
                    style={{
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      padding: '7px 15px',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '650'
                    }}
                  >
                    Excluir
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

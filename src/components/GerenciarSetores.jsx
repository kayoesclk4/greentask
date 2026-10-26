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
      setMensagem({ tipo: 'sucesso', texto: 'Setor criado!' })
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
    <div style={{
      background: 'white',
      padding: '28px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      maxWidth: '560px',
      width: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#2e7d32' }}>Gerenciar Setores</h2>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666' }}
        >
          ×
        </button>
      </div>

      {/* Formulário criar */}
      <form onSubmit={handleCriar} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do novo setor"
          required
          style={{
            flex: 1,
            padding: '11px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            boxSizing: 'border-box'
          }}
        />
        <button
          type="submit"
          style={{
            background: '#2e7d32',
            color: 'white',
            border: 'none',
            padding: '11px 18px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            whiteSpace: 'nowrap'
          }}
        >
          + Criar
        </button>
      </form>

      {mensagem && (
        <div style={{
          background: mensagem.tipo === 'sucesso' ? '#e8f5e9' : '#ffebee',
          color: mensagem.tipo === 'sucesso' ? '#2e7d32' : '#c62828',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {mensagem.texto}
        </div>
      )}

      {/* Lista de setores */}
      {loading ? (
        <p style={{ color: '#666' }}>Carregando...</p>
      ) : setores.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center' }}>Nenhum setor cadastrado.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {setores.map((setor) => (
            <div
              key={setor.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                background: '#f9f9f9',
                borderRadius: '8px',
                border: '1px solid #eee'
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
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ddd'
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditar(setor.id)}
                    style={{
                      background: '#2e7d32',
                      color: 'white',
                      border: 'none',
                      padding: '7px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => { setEditandoId(null); setEditNome('') }}
                    style={{
                      background: '#eee',
                      color: '#333',
                      border: 'none',
                      padding: '7px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, fontWeight: '500', color: '#333' }}>{setor.nome}</span>
                  <button
                    onClick={() => { setEditandoId(setor.id); setEditNome(setor.nome) }}
                    style={{
                      background: '#e3f2fd',
                      color: '#1565c0',
                      border: 'none',
                      padding: '7px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(setor.id, setor.nome)}
                    style={{
                      background: '#ffebee',
                      color: '#c62828',
                      border: 'none',
                      padding: '7px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
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
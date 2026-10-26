import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function CadastrarFuncionario({ onClose }) {
  const [funcionarios, setFuncionarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)

  // Campos do formulário
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  // Edição
  const [editandoId, setEditandoId] = useState(null)
  const [editNome, setEditNome] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editSenha, setEditSenha] = useState('')

  const [mensagem, setMensagem] = useState(null)

  const fetchFuncionarios = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .order('nome')

    if (!error) setFuncionarios(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchFuncionarios()
  }, [])

  const handleCriar = async (e) => {
    e.preventDefault()
    setMensagem(null)

    const { error } = await supabase
      .from('funcionarios')
      .insert({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha,
        role: 'colaborador'
      })

    if (error) {
      setMensagem({ tipo: 'erro', texto: error.message })
    } else {
      setNome('')
      setEmail('')
      setSenha('')
      setMostrarForm(false)
      setMensagem({ tipo: 'sucesso', texto: 'Funcionário cadastrado!' })
      fetchFuncionarios()
    }
  }

  const handleEditar = async (id) => {
    if (!editNome.trim() || !editEmail.trim()) return

    const dados = {
      nome: editNome.trim(),
      email: editEmail.trim().toLowerCase()
    }

    // Só atualiza senha se preencheu
    if (editSenha.trim()) {
      dados.senha = editSenha
    }

    const { error } = await supabase
      .from('funcionarios')
      .update(dados)
      .eq('id', id)

    if (error) {
      setMensagem({ tipo: 'erro', texto: error.message })
    } else {
      setEditandoId(null)
      setEditNome('')
      setEditEmail('')
      setEditSenha('')
      setMensagem({ tipo: 'sucesso', texto: 'Funcionário atualizado!' })
      fetchFuncionarios()
    }
  }

  const handleExcluir = async (id, nomeFunc) => {
    if (!confirm(`Excluir o funcionário "${nomeFunc}"?`)) return

    const { error } = await supabase
      .from('funcionarios')
      .delete()
      .eq('id', id)

    if (error) {
      setMensagem({ tipo: 'erro', texto: error.message })
    } else {
      setMensagem({ tipo: 'sucesso', texto: 'Funcionário excluído!' })
      fetchFuncionarios()
    }
  }

  return (
    <div style={{
      background: 'white',
      padding: '28px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      maxWidth: '700px',
      width: '100%'
    }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#2e7d32' }}>Funcionários</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              setMostrarForm(!mostrarForm)
              setMensagem(null)
            }}
            style={{
              background: '#2e7d32',
              color: 'white',
              border: 'none',
              padding: '9px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            {mostrarForm ? 'Cancelar' : '+ Cadastrar'}
          </button>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666' }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Formulário de cadastro */}
      {mostrarForm && (
        <form onSubmit={handleCriar} style={{
          background: '#f9f9f9',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '24px',
          border: '1px solid #eee'
        }}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
              placeholder="Ex: João Silva"
            />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
              placeholder="funcionario@escola.com"
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <button
            type="submit"
            style={{
              background: '#2e7d32',
              color: 'white',
              border: 'none',
              padding: '11px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Cadastrar Funcionário
          </button>
        </form>
      )}

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

      {/* Lista de funcionários */}
      {loading ? (
        <p style={{ color: '#666' }}>Carregando...</p>
      ) : funcionarios.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '30px 0' }}>
          Nenhum funcionário cadastrado ainda.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {funcionarios.map((func) => (
            <div
              key={func.id}
              style={{
                padding: '14px 16px',
                background: '#f9f9f9',
                borderRadius: '8px',
                border: '1px solid #eee'
              }}
            >
              {editandoId === func.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="text"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    placeholder="Nome"
                    style={{ padding: '9px', borderRadius: '6px', border: '1px solid #ddd' }}
                  />
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="E-mail"
                    style={{ padding: '9px', borderRadius: '6px', border: '1px solid #ddd' }}
                  />
                  <input
                    type="password"
                    value={editSenha}
                    onChange={(e) => setEditSenha(e.target.value)}
                    placeholder="Nova senha (deixe vazio para manter)"
                    style={{ padding: '9px', borderRadius: '6px', border: '1px solid #ddd' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditar(func.id)}
                      style={{
                        background: '#2e7d32',
                        color: 'white',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditandoId(null)}
                      style={{
                        background: '#eee',
                        color: '#333',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#333' }}>{func.nome}</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>{func.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setEditandoId(func.id)
                        setEditNome(func.nome)
                        setEditEmail(func.email)
                        setEditSenha('')
                      }}
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
                      onClick={() => handleExcluir(func.id, func.nome)}
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
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
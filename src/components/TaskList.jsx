import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [setores, setSetores] = useState([])
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('media')
  const [dueDate, setDueDate] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [setorId, setSetorId] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [filtroSetor, setFiltroSetor] = useState('')

  const isOwner = user?.email === 'ricardo.mazon@escola.pr.gov.br' ||
                  user?.user_metadata?.role === 'proprietario'

  const fetchData = async () => {
    setLoading(true)

    try {
      let query = supabase.from('tasks').select('*')

      if (isOwner) {
        query = query.eq('user_id', user.id)
      } else {
        query = query.eq('assigned_to', user.email)
      }

      if (filtroSetor) {
        query = query.eq('setor_id', filtroSetor)
      }

      const { data: tasksData, error: tasksError } = await query.order('created_at', { ascending: false })

      if (tasksError) {
        console.error('Erro ao buscar tarefas:', tasksError.message)
        setTasks([])
      } else {
        setTasks(tasksData || [])
      }

      if (isOwner) {
        const { data: funcData } = await supabase.from('funcionarios').select('*').order('nome')
        const { data: setoresData } = await supabase.from('setores').select('*').order('nome')
        setFuncionarios(funcData || [])
        setSetores(setoresData || [])
      }
    } catch (err) {
      console.error('Erro geral:', err)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [user, filtroSetor])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const { error } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      priority,
      due_date: dueDate || null,
      assigned_to: assignedTo || null,
      setor_id: setorId || null,
      status: 'pendente'
    })

    if (error) {
      alert('Erro ao criar tarefa: ' + error.message)
    } else {
      setTitle('')
      setDescription('')
      setPriority('media')
      setDueDate('')
      setAssignedTo('')
      setSetorId('')
      setShowForm(false)
      fetchData()
    }
  }

  const changeStatus = async (id, newStatus) => {
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id)
    if (error) alert('Erro ao atualizar status: ' + error.message)
    else fetchData()
  }

  const deleteTask = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) alert('Erro ao excluir: ' + error.message)
    else fetchData()
  }

  const getStatusColor = (status) => {
    if (status === 'pendente') return '#ff9800'
    if (status === 'em_andamento') return '#2196f3'
    if (status === 'concluida') return '#4caf50'
    return '#999'
  }

  const getPriorityColor = (priority) => {
    if (priority === 'alta') return '#f44336'
    if (priority === 'media') return '#ff9800'
    if (priority === 'baixa') return '#4caf50'
    return '#999'
  }

  const getNomeSetor = (setorId) => {
    const setor = setores.find(s => s.id === Number(setorId) || s.id === setorId)
    return setor ? setor.nome : null
  }

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: '#2e7d32', margin: 0 }}>
            {isOwner ? 'Minhas Tarefas' : 'Tarefas Atribuídas'}
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
            {isOwner ? 'Você é o Proprietário' : 'Você é Colaborador'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {isOwner && setores.length > 0 && (
            <select
              value={filtroSetor}
              onChange={(e) => setFiltroSetor(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
            >
              <option value="">Todos os setores</option>
              {setores.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          )}

          {isOwner && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: '#2e7d32', color: 'white', border: 'none',
                padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
              }}
            >
              {showForm ? 'Cancelar' : '+ Nova Tarefa'}
            </button>
          )}
        </div>
      </div>

      {isOwner && showForm && (
        <form onSubmit={handleCreateTask} style={{
          background: 'white', padding: '24px', borderRadius: '12px',
          marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Título *</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
              placeholder="Ex: Revisar relatório"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Descrição</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)} rows="3"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', resize: 'vertical' }}
              placeholder="Detalhes da tarefa..."
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Responsável</label>
              <select
                value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="">Selecione o colaborador</option>
                {funcionarios.map((f) => (
                  <option key={f.id} value={f.email}>{f.nome} ({f.email})</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Setor</label>
              <select
                value={setorId} onChange={(e) => setSetorId(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="">Selecione o setor</option>
                {setores.map((s) => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Prioridade</label>
              <select
                value={priority} onChange={(e) => setPriority(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Prazo</label>
              <input
                type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <button type="submit" style={{
            background: '#2e7d32', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
          }}>
            Criar Tarefa
          </button>
        </form>
      )}

      {loading ? (
        <p style={{ color: '#666' }}>Carregando tarefas...</p>
      ) : tasks.length === 0 ? (
        <div style={{
          background: 'white', padding: '40px', borderRadius: '12px',
          textAlign: 'center', color: '#666', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          {isOwner ? 'Nenhuma tarefa encontrada.' : 'Nenhuma tarefa atribuída a você.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tasks.map((task) => (
            <div key={task.id} style={{
              background: 'white',
              padding: '20px 22px',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              borderLeft: `6px solid ${getStatusColor(task.status)}`
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', gap: '12px', marginBottom: '10px'
              }}>
                <h3 style={{ margin: 0, color: '#222', fontSize: '17px', fontWeight: '600', lineHeight: '1.3' }}>
                  {task.title}
                </h3>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {getNomeSetor(task.setor_id) && (
                    <span style={{
                      background: '#e8f5e9', color: '#2e7d32',
                      padding: '4px 10px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap'
                    }}>
                      {getNomeSetor(task.setor_id)}
                    </span>
                  )}
                  <span style={{
                    background: getPriorityColor(task.priority), color: 'white',
                    padding: '4px 10px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap'
                  }}>
                    {task.priority}
                  </span>
                </div>
              </div>

              {task.description && (
                <p style={{ color: '#555', margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.5', textAlign: 'left' }}>
                  {task.description}
                </p>
              )}

              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '16px',
                marginBottom: '14px', fontSize: '13px', color: '#666'
              }}>
                {task.assigned_to && (
                  <span>
                    <strong style={{ color: '#444' }}>Responsável:</strong> {task.assigned_to}
                  </span>
                )}
                {task.due_date && (
                  <span>
                    <strong style={{ color: '#444' }}>Prazo:</strong>{' '}
                    {new Date(task.due_date).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0'
              }}>
                <select
  value={task.status}
  onChange={(e) => changeStatus(task.id, e.target.value)}
  style={{
    padding: '7px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '13px',
    backgroundColor: '#ffffff',
    color: '#222222',
    WebkitTextFillColor: '#222222',
    opacity: 1,
    cursor: 'pointer',
    colorScheme: 'light'
  }}
>
  <option
    value="pendente"
    style={{ color: '#222222', backgroundColor: '#ffffff' }}
  >
    Pendente
  </option>

  <option
    value="em_andamento"
    style={{ color: '#222222', backgroundColor: '#ffffff' }}
  >
    Em andamento
  </option>

  <option
    value="concluida"
    style={{ color: '#222222', backgroundColor: '#ffffff' }}
  >
    Concluída
  </option>
</select>

                {isOwner && (
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      background: '#ffebee', color: '#c62828', border: 'none',
                      padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
                    }}
                  >
                    Excluir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
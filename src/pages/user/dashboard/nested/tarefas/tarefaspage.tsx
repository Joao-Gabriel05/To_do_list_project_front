import { useEffect, useState } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { getasksRequest, postTaskRequest } from './api/tarefas';

interface Tarefa {
    _id: string;
    status: string;
    members: string[];
    priority: string;
    title: string;
    due_date: string;
}

export const Tarefas = () => {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [newTask, setNewTask] = useState({
        title: '',
        status: 'pendente',
        priority: 'média',
        due_date: '',
        members: '',
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        async function fetchTarefas() {
            try {
                const tarefas = await getasksRequest<Tarefa[]>('/director/get-task');
                setTarefas(tarefas);
            } catch (error) {
                toast.error('Erro ao carregar as tarefas');
                console.error('Erro ao carregar as tarefas:', error);
            }
        }
        fetchTarefas();
    }, []);

    const handleCreateTask = async () => {
        try {
            const { title, status, priority, due_date, members } = newTask;
            const membersArray = members.split(',').map(member => member.trim());
            const taskToCreate = { title, status, priority, due_date, members: membersArray };

            const createdTask = await postTaskRequest<Tarefa>('/director/create-task', taskToCreate);
            setTarefas(prev => [...prev, createdTask]); // Adiciona a nova tarefa à lista
            toast.success('Tarefa criada com sucesso!');
            setNewTask({ title: '', status: 'pendente', priority: 'média', due_date: '', members: '' }); // Reseta o formulário
            setShowForm(false); // Oculta o formulário após criar a tarefa
        } catch (error) {
            toast.error('Erro ao criar a tarefa');
            console.error('Erro ao criar a tarefa:', error);
        }
    };

    return (
        <TarefasStyles>
            <h1 className="text-2xl font-bold mb-4">Tarefas</h1>

            {/* Botão para exibir o formulário */}
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Criar Nova Tarefa
                </button>
            )}

            {/* Formulário para criar uma nova tarefa */}
            {showForm && (
                <div className="mb-6 p-4 border border-gray-300 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Criar Nova Tarefa</h2>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Título"
                            value={newTask.title}
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <select
                            value={newTask.priority}
                            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                            className="w-full p-2 border rounded"
                        >
                            <option value="baixa">Baixa</option>
                            <option value="média">Média</option>
                            <option value="alta">Alta</option>
                        </select>
                        <input
                            type="date"
                            value={newTask.due_date}
                            onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Membros (separados por vírgula)"
                            value={newTask.members}
                            onChange={e => setNewTask({ ...newTask, members: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <button
                            onClick={handleCreateTask}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Criar Tarefa
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Lista de tarefas */}
            {tarefas.length === 0 ? (
                <p>Não há tarefas disponíveis.</p>
            ) : (
                <div className="space-y-4">
                    {tarefas.map(tarefa => (
                        <div key={tarefa._id} className="p-4 border border-gray-300 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold">{tarefa.title}</h2>
                            <p><strong>Status:</strong> {tarefa.status}</p>
                            <p><strong>Prioridade:</strong> {tarefa.priority}</p>
                            <p><strong>Data de vencimento:</strong> {tarefa.due_date}</p>
                            <p><strong>Membros:</strong> {tarefa.members.join(', ')}</p>
                        </div>
                    ))}
                </div>
            )}
        </TarefasStyles>
    );
};

const TarefasStyles = styled.div`
    background-color: #f9f9f9;
    padding: 20px;
    margin: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    .space-y-4 > * + * {
        margin-top: 1rem;
    }
    .text-xl {
        font-size: 1.25rem;
    }
    input, select {
        display: block;
        width: 100%;
        margin-top: 0.5rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
    button {
        cursor: pointer;
    }
`;

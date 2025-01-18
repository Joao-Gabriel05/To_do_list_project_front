import { useEffect, useState } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { getasksRequest, postTaskRequest, editTaskRequest } from './api/tarefas';

interface Tarefa {
    _id: string;
    status: "não iniciado" | "em progresso" | "finalizado";
    members: string[];
    priority: "pouco importante" | "importante" | "muito importante";
    title: string;
    due_date: string;
}

export const Tarefas = () => {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [newTask, setNewTask] = useState({
        title: '',
        status: 'não iniciado',
        priority: 'pouco importante',
        due_date: '',
        members: '',
    });
    const [showForm, setShowForm] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);  
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        due_date: '',
    });
    const [sortBy, setSortBy] = useState<'due_date' | 'priority'>('due_date');  // Estado para controlar a ordenação

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

            if (!title || !status || !priority || !due_date || !members) {
                toast.error('Preencha todos os campos obrigatórios!');
                return;
            }

            const membersArray = members.split(',').map(member => member.trim());

            const taskToCreate = { 
                title, 
                status, 
                priority, 
                due_date, 
                members: membersArray 
            };

            const createdTask = await postTaskRequest<Tarefa>('/director/create-task', taskToCreate);

            if (createdTask) {
                const tarefas = await getasksRequest<Tarefa[]>('/director/get-task');
                setTarefas(tarefas);
                toast.success('Tarefa criada com sucesso!');
                setNewTask({ title: '', status: 'não iniciado', priority: 'pouco importante', due_date: '', members: '' });
                setShowForm(false);
            } else {
                toast.error('Erro ao criar a tarefa');
            }
        } catch (error) {
            toast.error('Erro ao criar a tarefa');
            console.error('Erro ao criar a tarefa:', error);
        }
    };

    const handleEditTask = async () => {
        if (editingTaskId) {
            const { title, status, priority, due_date, members } = newTask;
            const membersArray = members.split(',').map(member => member.trim());
    
            const taskToEdit = { 
                _id: editingTaskId,   // Incluindo o _id, caso o back-end precise disso
                title, 
                status, 
                priority, 
                due_date, 
                members: membersArray 
            };
    
            try {
                const updatedTask = await editTaskRequest<Tarefa>('/director/edit-task', editingTaskId, taskToEdit);
    
                if (updatedTask) {
                    const tarefas = await getasksRequest<Tarefa[]>('/director/get-task');
                    setTarefas(tarefas);
                    toast.success('Tarefa atualizada com sucesso!');
                    setNewTask({ title: '', status: 'não iniciado', priority: 'pouco importante', due_date: '', members: '' });
                    setShowForm(false);
                    setEditingTaskId(null); 
                } else {
                    toast.error('Erro ao atualizar a tarefa');
                }
            } catch (error) {
                toast.error('Erro ao atualizar a tarefa');
                console.error('Erro ao atualizar a tarefa:', error);
            }
        }
    };
    

    const handleTaskClick = (tarefa: Tarefa) => {
        setEditingTaskId(tarefa._id);  
        setNewTask({
            title: tarefa.title,
            status: tarefa.status,
            priority: tarefa.priority,
            due_date: tarefa.due_date,
            members: tarefa.members.join(', ')  
        });
        setShowForm(true);  
    };

    // Função para formatar a data no formato dd/mm/aaaa
    const formatDate = (date: string) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    // Função para filtrar as tarefas
    const filteredTarefas = tarefas.filter(tarefa => {
        const matchesStatus = filters.status ? tarefa.status === filters.status : true;
        const matchesPriority = filters.priority ? tarefa.priority === filters.priority : true;
        const matchesDueDate = filters.due_date ? tarefa.due_date === filters.due_date : true;

        return matchesStatus && matchesPriority && matchesDueDate;
    });

    // Função para ordenar as tarefas
    const sortedTarefas = filteredTarefas.sort((a, b) => {
        if (sortBy === 'due_date') {
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        } else {
            const priorities = ['muito importante', 'importante', 'pouco importante'];
            return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
        }
    });

    const handleStatusChange = async (taskId: string,status_atualizado:string) => {
        try {
            // Buscar a tarefa original
            const task = await getasksRequest<Tarefa>(`/director/get-task/${taskId}`);
            
            if (task) {
                // Atualizar o status e manter os outros campos
                const updatedTask = { ...task, status: status_atualizado };
                
                // Enviar a tarefa com o novo status
                const result = await editTaskRequest<Tarefa>('/director/edit-task', taskId, updatedTask);
                
                if (result) {
                    // Atualizar a lista de tarefas após a alteração
                    const tarefas = await getasksRequest<Tarefa[]>('/director/get-task');
                    setTarefas(tarefas);
                    toast.success('Status alterado');
                }
            }
        } catch (error) {
            toast.error('Erro ao atualizar o status da tarefa');
            console.error('Erro ao atualizar o status da tarefa:', error);
        }
    };

    return (
        <TarefasStyles>
            <h1 className="text-2xl font-bold mb-4">Tarefas</h1>

            <div className="mb-6">
                <h3 className="font-semibold mb-2">Filtros</h3>
                <div className="flex space-x-4">
                    <select
                        value={filters.status}
                        onChange={e => setFilters({ ...filters, status: e.target.value })}
                        className="p-2 border rounded"
                    >
                        <option value="">Todos os Status</option>
                        <option value="não iniciado">Não Iniciado</option>
                        <option value="em progresso">Em Progresso</option>
                        <option value="finalizado">Finalizado</option>
                    </select>
                    <select
                        value={filters.priority}
                        onChange={e => setFilters({ ...filters, priority: e.target.value })}
                        className="p-2 border rounded"
                    >
                        <option value="">Todas as Prioridades</option>
                        <option value="pouco importante">Pouco Importante</option>
                        <option value="importante">Importante</option>
                        <option value="muito importante">Muito Importante</option>
                    </select>
                    <input
                        type="date"
                        value={filters.due_date}
                        onChange={e => setFilters({ ...filters, due_date: e.target.value })}
                        className="p-2 border rounded"
                    />
                </div>
            </div>

            {/* Componente de "Organizar por" */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Organizar por</h3>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setSortBy('due_date')}
                        className={`px-4 py-2 border rounded ${sortBy === 'due_date' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    >
                        Data de Vencimento
                    </button>
                    <button
                        onClick={() => setSortBy('priority')}
                        className={`px-4 py-2 border rounded ${sortBy === 'priority' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    >
                        Prioridade
                    </button>
                </div>
            </div>

            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Criar Nova Tarefa
                </button>
            )}

            {showForm && (
                <div className="mb-6 p-4 border border-gray-300 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingTaskId ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
                    </h2>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Título"
                            value={newTask.title}
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <select
                            value={newTask.status}
                            onChange={e => setNewTask({ ...newTask, status: e.target.value })}
                            className="w-full p-2 border rounded"
                        >
                            <option value="não iniciado">Não Iniciado</option>
                            <option value="em progresso">Em Progresso</option>
                            <option value="finalizado">Finalizado</option>
                        </select>
                        <select
                            value={newTask.priority}
                            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                            className="w-full p-2 border rounded"
                        >
                            <option value="pouco importante">Pouco Importante</option>
                            <option value="importante">Importante</option>
                            <option value="muito importante">Muito Importante</option>
                        </select>
                        <input
                            type="date"
                            value={newTask.due_date}
                            onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Membros"
                            value={newTask.members}
                            onChange={e => setNewTask({ ...newTask, members: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={editingTaskId ? handleEditTask : handleCreateTask}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {editingTaskId ? 'Atualizar Tarefa' : 'Criar Tarefa'}
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

<ul className="space-y-4">
    {sortedTarefas.map((tarefa) => {
        // Obter a data atual (em milissegundos desde a época Unix)
        const today = new Date();
        const todayInMs = today.getTime(); // Data atual em milissegundos

        // Converter a due_date de string para milissegundos
        const dueDate = new Date(tarefa.due_date);
        const dueDateInMs = dueDate.getTime(); // Data de vencimento em milissegundos

        // Calcular a diferença de dias
        const timeDifference = dueDateInMs - todayInMs;
        const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convertendo de milissegundos para dias

        // Determinar a cor do fundo dependendo do status
        const containerClass = tarefa.status === 'em progresso' 
            ? 'bg-white' // Cor de fundo branca para tarefas em progresso
            : 'bg-gray-300'; // Cor de fundo cinza para tarefas não iniciadas ou finalizadas

        return (
            <li 
                key={tarefa._id} 
                className={`p-4 border rounded-md shadow-sm flex justify-between items-center ${containerClass}`}
                onClick={() => {
                    if (tarefa.status === 'não iniciado') {
                        handleStatusChange(tarefa._id, 'em progresso');
                    }
                }}
            >
                <div>
                    <h3 className="font-semibold">{tarefa.title}</h3>
                    <p> {tarefa.status}</p>
                    <p>
                        <span
                            className={`inline-block w-4 h-4 rounded-full mr-2 ${tarefa.priority === 'muito importante' ? 'bg-red-500' : 
                                tarefa.priority === 'importante' ? 'bg-yellow-500' : 'bg-green-500'}`}
                        ></span>
                    </p>
                    <p>
                        {daysRemaining >= 0 ? `Faltam ${daysRemaining} dias para o vencimento` : `Atrasado em ${Math.abs(daysRemaining)} dias`}
                    </p>
                    <p>Membros: {tarefa.members.join(', ')}</p>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={tarefa.status === 'finalizado'}
                        onChange={() => handleStatusChange(tarefa._id, 'finalizado')}
                        className="mr-4"
                    />
                    <button
                        onClick={() => handleTaskClick(tarefa)}
                        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                        Editar
                    </button>
                </div>
            </li>
        );
    })}
</ul>





        </TarefasStyles>
    );
};

const TarefasStyles = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;

    .space-y-4 > * + * {
        margin-top: 1rem;
    }

    button {
        transition: background-color 0.3s;
    }
`;

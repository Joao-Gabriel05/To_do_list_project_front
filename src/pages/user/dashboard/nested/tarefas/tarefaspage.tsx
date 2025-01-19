import { useEffect, useState } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { getasksRequest, postTaskRequest, editTaskRequest, deleteTaskRequest } from './api/tarefas';

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
    const [sortBy, setSortBy] = useState<'due_date' | 'priority'>('due_date');
    const [menuVisible, setMenuVisible] = useState<string | null>(null); // Controle do menu contextual

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
                _id: editingTaskId,  
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

    const handleDeleteTask = async (taskId: string) => {
        try {
            const result = await deleteTaskRequest('/director/delete-task', taskId);
            
            if (result) {
                // A API retornou sucesso, agora vamos buscar as tarefas atualizadas
                const tarefas = await getasksRequest<Tarefa[]>('/director/get-task');
                
                // Se a lista estiver vazia após a exclusão, definimos um array vazio
                if (tarefas.length === 0) {
                    setTarefas([]);
                } else {
                    setTarefas(tarefas);
                }
                
                toast.success('Tarefa deletada com sucesso!');
            } else {
                toast.error('Erro ao deletar a tarefa');
            }
        } catch (error) {
            toast.error('Erro ao deletar a tarefa');
            console.error('Erro ao deletar a tarefa:', error);
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


    const filteredTarefas = tarefas.filter(tarefa => {
        const matchesStatus = filters.status ? tarefa.status === filters.status : true;
        const matchesPriority = filters.priority ? tarefa.priority === filters.priority : true;
        const matchesDueDate = filters.due_date ? tarefa.due_date === filters.due_date : true;

        return matchesStatus && matchesPriority && matchesDueDate;
    });

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
         <div className="header-container flex items-center justify-between mb-6 px-6 py-3">
            <div className="organizar-por">
                <h3 className="font-semibold text-white mb-2">Organizar por</h3>
                <div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'due_date' | 'priority')}
                        className="px-4 py-2  border rounded bg-white"
                    >
                        <option value="due_date">Data de Vencimento</option>
                        <option value="priority">Prioridade</option>
                    </select>
                </div>
            </div>

            <div className="filters-container">
                <h3 className="font-semibold text-white mb-2">Filtros</h3>
                <div className="flex space-x-4">
                    <select
                        value={filters.status}
                        onChange={e => setFilters({ ...filters, status: e.target.value })}
                        className="p-1 border rounded"
                    >
                        <option value="">Todos os Status</option>
                        <option value="não iniciado">Não Iniciado</option>
                        <option value="em progresso">Em Progresso</option>
                        <option value="finalizado">Finalizado</option>
                    </select>
                    <select
                        value={filters.priority}
                        onChange={e => setFilters({ ...filters, priority: e.target.value })}
                        className="p-1 border rounded"
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
                        className="p-1 border rounded"
                    />
                </div>
            </div>
        </div>

        <h1 className="text-6xl font-bold text-white text-center mt-6">To-do List</h1>

            {/* Botão Criar Nova Tarefa */}
            {!showForm && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full max-w-lg"
                    >
                        Criar Nova Tarefa
                    </button>
                </div>
            )}


            {showForm && (
                <div className="mb-6 p-4 border border-gray-300 rounded-lg shadow-sm">
                    <h2 className="text-xl text-white font-semibold mb-4">
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
            const today = new Date();
            const todayInMs = today.getTime();
            const dueDate = new Date(tarefa.due_date);
            const dueDateInMs = dueDate.getTime();
            const timeDifference = dueDateInMs - todayInMs;
            const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
            const containerClass = tarefa.status === 'em progresso' 
                ? 'bg-white' 
                : 'bg-gray-400';

            const handleToggleMenu = (id: string | null) => {
                setMenuVisible((prev) => (prev === id ? null : id));
            };

    return (
        <li 
            key={tarefa._id} 
            className={`p-4 rounded-md shadow-sm flex justify-between items-center ${containerClass}`}
        >
            <div>
                <h1 className="font-bold text-3xl">{tarefa.title}</h1>
                <p className="font-semibold">
                {
                    tarefa.status === 'não iniciado' ? 'A tarefa ainda não foi iniciada' :
                    tarefa.status === 'em progresso' ? 'A tarefa está em processo' :
                    tarefa.status === 'finalizado' ? 'A tarefa foi finalizada' :
                    'Status desconhecido'
                }
                </p>
                <p>
                    <span
                        className={`inline-block w-4 h-4 rounded-full mr-2 ${
                            tarefa.priority === 'muito importante' ? 'bg-red-500' : 
                            tarefa.priority === 'importante' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                    ></span>
                </p>
                <p className={daysRemaining <= 0 ? "text-red-500" : ""}>
                    {daysRemaining >= 0 
                        ? `Faltam ${daysRemaining} dias para o vencimento` 
                        : `Atrasado em ${Math.abs(daysRemaining)} dias`}
                </p>
                <p>Membros: {tarefa.members.join(', ')}</p>
            </div>
            <div className="flex items-center relative">
            <div className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={tarefa.status === 'finalizado'}
                        onChange={() => {
                            const newStatus = tarefa.status === 'finalizado' ? 'em progresso' : 'finalizado';
                            handleStatusChange(tarefa._id, newStatus);
                        }}
                        id={`checkbox-${tarefa._id}`}
                        className="checkbox-input"
                    />
                    <label htmlFor={`checkbox-${tarefa._id}`} className="checkbox-label"></label>
                </div>


                {/* Botão de ações */}
                <div className="relative">
                    <button
                        onClick={() => handleToggleMenu(tarefa._id)}
                        className="p-2 bg-transparent text-black rounded hover:bg-gray-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-7 h-7"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 12a.75.75 0 100-1.5.75.75 0 000 1.5zm5.25 0a.75.75 0 100-1.5.75.75 0 000 1.5zm5.25 0a.75.75 0 100-1.5.75.75 0 000 1.5z"
                            />
                        </svg>
                    </button>
                    {/* Menu de opções */}
                    {menuVisible === tarefa._id && (
                        <div className="absolute top-10 right-0 bg-white border rounded shadow-md z-10">
                            <button
                                onClick={() => {
                                    handleTaskClick(tarefa);
                                    handleToggleMenu(null);
                                }}
                                className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => {
                                    handleDeleteTask(tarefa._id);
                                    handleToggleMenu(null);
                                }}
                                className="block px-4 py-2 text-left hover:bg-gray-100 w-full text-red-600"
                            >
                                Deletar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
})}
</ul>





        </TarefasStyles>
    );
};

const TarefasStyles = styled.div`
    background-color: #1E40AF; /* Azul quente (mais saturado) */

    min-height: 100vh; /* Garantir que ocupe toda a altura da tela */

    .space-y-4 {
        display: flex;
        flex-direction: column;
        justify-content: flex-start; /* Alinha o conteúdo para o topo */
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
        margin-top: 1rem;
        width: 100%; /* Garante que ocupe toda a largura possível */
    }

    button {
        transition: background-color 0.3s;
    }
    .checkbox-container {
        position: relative;
        display: inline-block;
    }
    
    .checkbox-input {
        appearance: none; /* Remove o estilo padrão */
        -webkit-appearance: none; /* Remove o estilo padrão no Safari */
        width: 30px; /* Tamanho do checkbox */
        height: 30px; /* Tamanho do checkbox */
        border-radius: 50%; /* Tornar o checkbox redondo */
        background-color: #f3f4f6; /* Cor de fundo */
        border: 2px solid #34D399; /* Cor da borda */
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .checkbox-input:checked {
        background-color: #34D399; /* Cor verde quando selecionado */
        border-color: #34D399; /* Cor da borda quando selecionado */
    }
    
    .checkbox-input:checked::before {
        content: ''; /* Insere o checkmark */
        width: 10px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        transform: rotate(45deg);
        position: absolute;
    }
    
    .checkbox-label {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%; /* Tornar o label redondo também */
        cursor: pointer;
    }
    
    
`;


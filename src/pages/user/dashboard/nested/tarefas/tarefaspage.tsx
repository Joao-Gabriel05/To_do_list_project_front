import { useEffect, useState } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { defaultRequest } from './api/tarefas';

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

    useEffect(() => {
        async function fetchTarefas() {
            try {
                const tarefas = await defaultRequest<Tarefa[]>('/director/get-task');
                setTarefas(tarefas);
            } catch (error) {
                toast.error('Erro ao carregar as tarefas');
                console.error('Erro ao carregar as tarefas:', error);
            }
        }
        fetchTarefas();
    }, []);

    return (
        <TarefasStyles>
            <h1 className="text-2xl font-bold mb-4">Tarefas</h1>
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
`;
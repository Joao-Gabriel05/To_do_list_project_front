import { useEffect, useState } from 'react';
import { getasksRequest } from './api/graficos.ts'; // Ajuste o caminho conforme necessário
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { styled } from 'styled-components';

// Registra os componentes necessários do Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export const Graficos = () => {
    const [dadosTarefas, setDadosTarefas] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tarefas = await getasksRequest<any[]>('/director/get-task');
                
                // Contagem de tarefas por status
                const contagemStatus = tarefas.reduce((acc: Record<string, number>, tarefa) => {
                    const status = tarefa.status;  // A chave 'status' é utilizada para contar cada tipo
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                }, {});

                // Contagem de tarefas por prioridade
                const contagemPriority = tarefas.reduce((acc: Record<string, number>, tarefa) => {
                    const priority = tarefa.priority;  // A chave 'priority' é utilizada para contar cada tipo
                    acc[priority] = (acc[priority] || 0) + 1;
                    return acc;
                }, {});

                // Configuração dos dados do gráfico de status
                setDadosTarefas({
                    labels: ['Não Iniciado', 'Em Progresso', 'Finalizado'],
                    datasets: [
                        {
                            label: 'Quantidade de Tarefas por Status',
                            data: [
                                contagemStatus['não iniciado'] || 0,
                                contagemStatus['em progresso'] || 0,
                                contagemStatus['finalizado'] || 0
                            ],
                            backgroundColor: ['#006400', '#FF9900', '#FF0000'],  // Cores para as barras
                            borderColor: ['#006400', '#FF9900', '#FF0000'],      // Cor da borda das barras
                            borderWidth: 1,
                        },
                    ],
                });

                // Configuração dos dados do gráfico de prioridade
                setDadosTarefas((prevState: any) => ({
                    ...prevState,
                    priorityChart: {
                        labels: ['Pouco Importante', 'Importante', 'Muito Importante'],
                        datasets: [
                            {
                                label: 'Quantidade de Tarefas por Prioridade',
                                data: [
                                    contagemPriority['pouco importante'] || 0,
                                    contagemPriority['importante'] || 0,
                                    contagemPriority['muito importante'] || 0
                                ],
                                backgroundColor: ['#808080', '#FFCC00', '#FF0000'],  // Cores para as barras
                                borderColor: ['#808080', '#FFCC00', '#FF0000'],
                                borderWidth: 1,
                            },
                        ],
                    }
                }));

            } catch (error) {
                console.error("Erro ao buscar tarefas:", error);
            }
        };

        fetchData();
    }, []);

    if (!dadosTarefas) {
        return <div>Carregando dados...</div>;
    }

    return (
        <GraficosStyles>
            <div className="space-y-4">
                <div className="chart-container">
                    <Bar
                        data={dadosTarefas}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top', labels: { font: { size: 14 } } },
                                title: { display: true, text: 'Distribuição de Tarefas por Status', font: { size: 20, weight: 'bold' } },
                            },
                            scales: {
                                x: { title: { display: true, text: 'Status', font: { size: 16 } } },
                                y: { title: { display: true, text: 'Quantidade', font: { size: 16 } } },
                            }
                        }}
                    />
                </div>
    
                <div className="chart-container">
                    <Bar
                        data={dadosTarefas.priorityChart}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top', labels: { font: { size: 14 } } },
                                title: { display: true, text: 'Distribuição de Tarefas por Prioridade', font: { size: 20, weight: 'bold' } },
                            },
                            scales: {
                                x: { title: { display: true, text: 'Prioridade', font: { size: 16 } } },
                                y: { title: { display: true, text: 'Quantidade', font: { size: 16 } } },
                            }
                        }}
                    />
                </div>
            </div>
        </GraficosStyles>
    );
};

// Styled component para os gráficos
const GraficosStyles = styled.div`
    background-color: #1E40AF; /* Azul quente (mais saturado) */

`;



export default Graficos;

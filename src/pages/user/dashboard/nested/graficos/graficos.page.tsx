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
                    labels: ['Pendente', 'Em Progresso', 'Finalizada'],
                    datasets: [
                        {
                            label: 'Quantidade de Tarefas por Status',
                            data: [
                                contagemStatus['pendente'] || 0,
                                contagemStatus['em progresso'] || 0,
                                contagemStatus['finalizada'] || 0
                            ],
                            backgroundColor: ['#808080', '#4CAF50', '#2196F3'],  // Cores para as barras
                            borderColor: ['#808080', '#4CAF50', '#2196F3'],      // Cor da borda das barras
                            
                            
                            
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
                                backgroundColor: ['#006400', '#FF9900', '#FF0000'],  // Cores para as barras
                                borderColor: ['#006400', '#FF9900', '#FF0000'],      // Cor da borda das barras
                                
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
            <div className="content-container">
                <div className="chart-container">
                    <div className="chart-box">
                        <Bar
                            data={dadosTarefas}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: 'top', labels: { font: { size: 14 } } },
                                    title: { 
                                        display: true, 
                                        text: 'Distribuição de Tarefas por Status', 
                                        font: { size: 20, weight: 'bold' }, 
                                        color: '#1E40AF' 
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Status',
                                            font: {
                                                size: 16,
                                                weight: 'bold' 
                                            },
                                            color: '#1E40AF'
                                        }
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Quantidade',
                                            font: {
                                                size: 16,
                                                weight: 'bold' 
                                            },
                                            color: '#1E40AF'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
    
                <div className="chart-container">
                    <div className="chart-box">
                        <Bar
                            data={dadosTarefas.priorityChart}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: 'top', labels: { font: { size: 14 } } },
                                    title: { display: true, text: 'Distribuição de Tarefas por Prioridade', font: { size: 20, weight: 'bold' }, color: '#1E40AF' },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Prioridade',
                                            font: {
                                                size: 16,
                                                weight: 'bold' 
                                            },
                                            color: '#1E40AF'
                                        }
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Quantidade',
                                            font: {
                                                size: 16,
                                                weight: 'bold' 
                                            },
                                            color: '#1E40AF'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </GraficosStyles>
    );
};

// Styled component para os gráficos
const GraficosStyles = styled.div`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    background-color: #f4f7fc; /* Cor de fundo mais suave */

    .content-container {
        color: #1E40AF;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 1200px;
        gap: 40px;
    }

    .chart-container {
        width: 100%;
        max-width: 1100px;
        height: 500px;
        padding: 20px;
        display: flex;
        justify-content: center;
    }

    /* Contêiner com borda e sombreamento */
    .chart-box {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        border-radius: 15px; /* Arredondando os cantos */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombras para profundidade */
        padding: 20px;
        border: 1px solid #ddd;
    }

    /* Responsividade */
    @media (max-width: 1024px) {
        .chart-container {
            height: 350px;
        }
    }

    @media (max-width: 768px) {
        .chart-container {
            height: 300px;
        }
    }
`;

export default Graficos;
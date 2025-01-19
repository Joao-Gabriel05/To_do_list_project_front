import { Route, Routes } from 'react-router-dom';
import { Header } from './components/header';
import { Menu } from './components/menu';
import styled from 'styled-components';
import { Tarefas } from './nested/tarefas/tarefaspage';
import { Graficos } from './nested/graficos/graficos.page'; 


export const Dashboard = () => {
    return (
        <DashboardStyles>
            <Header/>
            <Menu/>
            <Routes>
                <Route path="tarefas" element={<Tarefas />}/>
            </Routes>
            <Routes>
                <Route path="graficos" element={<Graficos />}/>
            </Routes>
        </DashboardStyles>
    )
}

const DashboardStyles = styled.div`
    display: grid;
    grid-template-columns: 220px 1fr;
    grid-template-rows: 100px 1fr;
    width: 100vw;
    background-color: #f9f9f9;
`
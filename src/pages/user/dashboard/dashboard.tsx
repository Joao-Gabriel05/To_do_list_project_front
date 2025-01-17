import { Route, Routes } from 'react-router-dom';
import { Header } from './components/header';
import { Menu } from './components/menu';
import styled from 'styled-components';
import { Projeto } from './nested/projetos/projetospage';
import { Tarefas } from './nested/tarefas/tarefaspage';
import { Membros } from './nested/membros/membros.page'; 


export const Dashboard = () => {
    return (
        <DashboardStyles>
            <Header/>
            <Menu/>
            <Routes>
                <Route path="projetos" element={<Projeto />}/>
            </Routes>
            <Routes>
                <Route path="tarefas" element={<Tarefas />}/>
            </Routes>
            <Routes>
                <Route path="membros" element={<Membros />}/>
            </Routes>
        </DashboardStyles>
    )
}

const DashboardStyles = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 100px 1fr;
    height: 100vh;
    width: 100vw;
    background-color: #f9f9f9;
`
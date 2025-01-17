import { redirect, RouteObject } from 'react-router-dom';
import { Dashboard } from './dashboard/dashboard';
import { Projeto } from './dashboard/nested/projetos/projetospage'; 
import { Tarefas } from './dashboard/nested/tarefas/tarefaspage';
import { Membros } from './dashboard/nested/membros/membros.page';

const routes : RouteObject[] = [
    {
        path: "user/dashboard",
        element: <Dashboard />,
        id: "dashboard",
        children: [
            {
                index: true,
                loader: async () => redirect('/user/dashboard/projetos')
            },
            {
                path: "projetos",
                element: <Projeto />,
                id: "projetos"
                
            },
            {
                path: "tarefas",
                element: <Tarefas />,
                id: "tarefas"
            },
            {
                path: "membros",
                element: <Membros />,
                id: "membros"
            }
        ]
    }
]

export default routes;
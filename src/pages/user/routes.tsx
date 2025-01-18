import { redirect, RouteObject } from 'react-router-dom';
import { Dashboard } from './dashboard/dashboard';
import { Projeto } from './dashboard/nested/projetos/projetospage'; 
import { Tarefas } from './dashboard/nested/tarefas/tarefaspage';
import { Graficos } from './dashboard/nested/graficos/graficos.page';

const routes: RouteObject[] = [
    {
        path: "user/dashboard",
        element: <Dashboard />,
        id: "dashboard",
        children: [
            {
                index: true,
                loader: async () => redirect('/user/dashboard/tarefas'), // Redireciona para "tarefas" ao acessar "user/dashboard"
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
                path: "graficos",
                element: <Graficos />,
                id: "grafios"
            }
        ]
    }
];

export default routes;

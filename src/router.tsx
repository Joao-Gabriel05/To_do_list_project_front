import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App";
import userRoutes from './pages/user/routes';

export const router = createBrowserRouter([
    {
        path: "/",
        loader: () => redirect('/user/dashboard/tarefas'), // Redireciona para user/dashboard/tarefas
        element: <App />,
    },
    ...userRoutes,
]);

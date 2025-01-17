import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import userRoutes from './pages/user/routes';

export const router = createBrowserRouter([
    ...userRoutes,
    {
        path: "/",
        element: <App />,
    }
]);


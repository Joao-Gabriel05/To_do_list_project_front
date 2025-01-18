import { config } from '../../../../../../config/config.ts';

export async function getasksRequest<T>(route: string, method: string = 'GET', body?: any): Promise<T> {
    const { apiBaseUrl } = config;

    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Inclui cookies na requisição
    };

    // Adiciona o corpo da requisição, se necessário
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(apiBaseUrl + route, options);

        // Valida se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        // Retorna o JSON da resposta
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch ${route}:`, error);
        throw error; // Repropaga o erro para o chamador lidar
    }
}


export async function postTaskRequest<T>(route: string, body: any): Promise<T> {
    const { apiBaseUrl } = config;

    const options: RequestInit = {
        method: 'POST', // Método POST para criar a tarefa
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Inclui cookies na requisição
        body: JSON.stringify(body), // Converte o corpo para JSON
    };

    try {
        const response = await fetch(apiBaseUrl + route, options);

        // Valida se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        // Retorna o JSON da resposta
        return await response.json();
    } catch (error) {
        console.error(`Failed to post to ${route}:`, error);
        throw error; // Repropaga o erro para o chamador lidar
    }
}

export async function deleteTaskRequest<T>(route: string, taskId: string): Promise<T> {
    const { apiBaseUrl } = config;

    const options: RequestInit = {
        method: 'DELETE', // Método DELETE para remover a tarefa
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Inclui cookies na requisição
    };

    try {
        const response = await fetch(apiBaseUrl + route + '/' + taskId, options);

        // Valida se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        // Retorna o JSON da resposta (caso necessário)
        return await response.json();
    } catch (error) {
        console.error(`Failed to delete task with id ${taskId} from ${route}:`, error);
        throw error; // Repropaga o erro para o chamador lidar
    }
}

export async function editTaskRequest<T>(route: string, taskId: string, body: any): Promise<T> {
    const { apiBaseUrl } = config;

    const options: RequestInit = {
        method: 'PUT', // Método PUT para editar a tarefa
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Inclui cookies na requisição
        body: JSON.stringify(body), // Converte o corpo para JSON
    };

    try {
        const response = await fetch(apiBaseUrl + route + '/' + taskId, options);

        // Valida se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        // Retorna o JSON da resposta (caso necessário)
        return await response.json();
    } catch (error) {
        console.error(`Failed to edit task with id ${taskId} at ${route}:`, error);
        throw error; // Repropaga o erro para o chamador lidar
    }
}

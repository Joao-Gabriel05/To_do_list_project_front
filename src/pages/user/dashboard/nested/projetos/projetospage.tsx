import styled from 'styled-components';
import toast from 'react-hot-toast';

export const Projeto = () => {
    return (
        <ProjetoStyles>
            <h1>Projetos</h1>
            <button onClick={() => toast.error('Erro')}>Click me!</button>
        </ProjetoStyles>
    )
}

const ProjetoStyles = styled.div`
    background-color: #f9f9f9;
    padding: 20px;
    margin: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`
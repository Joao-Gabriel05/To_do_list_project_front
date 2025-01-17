import { menuItems } from "../constants/menu-items";
import styled from "styled-components";

export const Menu = () => {
    return (
        <MenuStyles>
            <h1>Menu</h1>
            {menuItems.map((item, index) => {
                return (
                    <MenuItem key={index} href={item.href}>
                        <IconWrapper>{item.icon}</IconWrapper>
                        <Label>{item.label}</Label>
                    </MenuItem>
                );
            })}
        </MenuStyles>
    );
}

const MenuStyles = styled.div`
    grid-column: 1;
    grid-row: 1 / span 2;
    background-color: #f9f9f9;
    padding: 20px;
    border-right: 1px solid #ddd;

    h1 {
        font-size: 24px;
        margin-bottom: 20px;
    }
`;

const MenuItem = styled.a`
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #333;
    padding: 10px 0;
    transition: color 0.3s;

    &:hover {
        color: #007BFF;
    }
`;

const IconWrapper = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 18px;
`;

const Label = styled.span`
    font-size: 16px;
`;

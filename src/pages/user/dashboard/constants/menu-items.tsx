import { ChartBar,CalendarCheck} from '@phosphor-icons/react';

export const menuItems = [

    {
        label: 'Tarefas',
        icon: <CalendarCheck />,
        href: '/user/dashboard/tarefas',
    },
    {
        label: 'Graficos',
        icon: <ChartBar />,
        href: '/user/dashboard/graficos',
    }
];
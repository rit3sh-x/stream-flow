import {
    Bell,
    CreditCard,
    FileDuoToneBlack,
    Home,
    Settings,
} from './icons'

export const MENU_ITEMS = (workspaceId: string, theme: 'dark' | 'light' | undefined): { title: string; href: string; icon: React.ReactNode }[] => [
    {
        title: 'Home',
        href: `/dashboard/${workspaceId}/home`,
        icon: <Home lighter={theme === 'light'} />
    },
    {
        title: 'My Library',
        href: `/dashboard/${workspaceId}`,
        icon: <FileDuoToneBlack lighter={theme === 'light'} />,
    },
    {
        title: 'Notifications',
        href: `/dashboard/${workspaceId}/notifications`,
        icon: <Bell lighter={theme === 'light'} />,
    },
    {
        title: 'Billing',
        href: `/dashboard/${workspaceId}/billing`,
        icon: <CreditCard lighter={theme === 'light'} />,
    },
    {
        title: 'Settings',
        href: `/dashboard/${workspaceId}/settings`,
        icon: <Settings lighter={theme === 'light'} />,
    },
]
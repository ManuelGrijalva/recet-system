import React from 'react';
import Link from 'next/link';

interface BottomNavItem {
  label: string;
  href: string;
  isSpecialAction?: boolean;
  icon: (props: { className?: string }) => React.JSX.Element;
}

const navItems: BottomNavItem[] = [
  {
    label: 'Inicio',
    href: '/',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Ingredientes',
    href: '/search',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    label: 'Publicar',
    href: '/compose',
    isSpecialAction: true,
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Guardados',
    href: '/saved',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
  },
  {
    label: 'Perfil',
    href: '/profile',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export function MobileBottomNav(): React.JSX.Element {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white dark:bg-[#0a0a0a] border-t border-zinc-200 dark:border-zinc-800 px-3 flex items-center justify-around"
      aria-label="Navegación móvil"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        if (item.isSpecialAction) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-2 p-1.5 focus:outline-none"
              aria-label={item.label}
            >
              <div className="w-10 h-10 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-sm">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors focus:outline-none"
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

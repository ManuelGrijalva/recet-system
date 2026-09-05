import React from 'react';
import Link from 'next/link';
import { Avatar } from '../ui/Avatar';
import { BrandMark } from '../ui/BrandMark';

interface NavItem {
  label: string;
  href: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

const navItems: NavItem[] = [
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
    label: 'Buscar por ingredientes',
    href: '/search',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    label: 'Crear receta',
    href: '/compose',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Recetas guardadas',
    href: '/saved',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
  },
  {
    label: 'Explorar tradiciones',
    href: '/explore',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    label: 'Mi perfil',
    href: '/profile',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export function DesktopSidebar(): React.JSX.Element {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-5 py-6 z-40">
      {/* Brand Header */}
      <div className="mb-8 px-2">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <BrandMark size="md" />
          <div>
            <span className="font-semibold text-lg tracking-tight text-zinc-950 dark:text-zinc-50 block leading-tight">
              Recetario Jutiapa
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
              Saberes tradicionales
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3.5 px-3 py-2.5 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Icon className="w-5 h-5 shrink-0 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section at Bottom */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          <Avatar alt="Manuel Grijalva" fallbackName="Manuel Grijalva" size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              Manuel Grijalva
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              Colaborador Jutiapa
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}

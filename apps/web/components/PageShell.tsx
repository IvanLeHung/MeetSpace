import React from 'react';
import { Sidebar } from './Sidebar';
import { Hero } from './Hero';
import { RoleSwitcher } from './RoleSwitcher';

export function PageShell({
  pathname,
  title,
  children
}: {
  pathname: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pageShell">
      <React.Suspense fallback={<div className="sidebar" />}>
        <Sidebar pathname={pathname} />
      </React.Suspense>
      <main className="main">
        <Hero />
        {title ? <h2 style={{ marginTop: 0 }}>{title}</h2> : null}
        <React.Suspense fallback={<div>Loading...</div>}>
          <RoleSwitcher />
        </React.Suspense>
        <div style={{ height: 18 }} />
        {children}
      </main>
    </div>
  );
}

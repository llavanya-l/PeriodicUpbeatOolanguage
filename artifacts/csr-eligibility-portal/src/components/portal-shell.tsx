import { type ReactNode } from 'react';
import { ArrowRight, ClipboardList, FileText, Home, LogOut, Menu, ShieldCheck, X } from 'lucide-react';
import { useClerk, useUser } from '@clerk/react';
import { Link, useLocation } from 'wouter';
import { useState } from 'react';

export function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" data-testid="brand-mark">
      <div className="relative grid size-10 shrink-0 place-items-center rounded-[13px] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-[0_8px_18px_hsl(var(--accent)/.24)]">
        <span className="absolute left-[10px] top-[10px] size-2 rounded-full bg-current" />
        <span className="absolute bottom-[10px] right-[10px] size-2 rounded-full bg-current" />
        <span className="h-5 w-1.5 rounded-full bg-current" />
      </div>
      {!compact && <span className="font-display text-[22px] leading-none tracking-[-.04em]">civic<span className="text-[hsl(var(--accent))]">path</span></span>}
    </div>
  );
}

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="relative z-20 border-b border-[hsl(var(--border)/.7)] bg-[hsl(var(--background)/.88)] backdrop-blur-md">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link href="/" className="transition-transform hover:scale-[1.01]" data-testid="link-home-brand"><Mark /></Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <a href="#how-it-works" className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]" data-testid="link-how-it-works">How it works</a>
          <a href="#your-data" className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]" data-testid="link-your-data">Your data</a>
          <Link href="/login/admin" className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]" data-testid="link-admin-access">Admin access</Link>
        </nav>
        <Link href="/login/user" className="hidden items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] shadow-[0_8px_20px_hsl(var(--primary)/.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_hsl(var(--primary)/.24)] md:flex" data-testid="link-start-application">
          Start an application <ArrowRight className="size-4" />
        </Link>
        <button className="grid size-10 place-items-center rounded-full border border-[hsl(var(--border))] md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu" data-testid="button-toggle-menu">
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {menuOpen && (
        <div className="absolute left-4 right-4 top-[68px] rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-xl md:hidden">
          <div className="grid gap-1">
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium" data-testid="link-mobile-how-it-works">How it works</a>
            <a href="#your-data" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium" data-testid="link-mobile-your-data">Your data</a>
            <Link href="/login/admin" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium" data-testid="link-mobile-admin">Admin access</Link>
            <Link href="/login/user" onClick={() => setMenuOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))]" data-testid="link-mobile-start">Start an application <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      )}
    </header>
  );
}

const userLinks = [
  { href: '/user/dashboard', label: 'Overview', icon: Home },
  { href: '/user/apply', label: 'My application', icon: ClipboardList },
];

export function AppShell({ role, children }: { role: 'user' | 'admin'; children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();
  const isAdmin = role === 'admin';
  const links = isAdmin ? [{ href: '/admin/dashboard', label: 'Review workspace', icon: ClipboardList }] : userLinks;
  const displayName = user?.firstName || user?.primaryEmailAddress?.emailAddress || (isAdmin ? 'Case reviewer' : 'Your application');
  const initials = displayName.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || (isAdmin ? 'CR' : 'AP');
  return (
    <div className="min-h-[100dvh] bg-[hsl(var(--background))]">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-[hsl(var(--sidebar))] px-5 py-6 text-[hsl(var(--sidebar-foreground))] transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2">
          <Link href={isAdmin ? '/admin/dashboard' : '/user/dashboard'} data-testid="link-shell-brand"><Mark /></Link>
          <button className="grid size-8 place-items-center rounded-lg text-[hsl(var(--sidebar-foreground)/.75)] md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation" data-testid="button-close-navigation"><X className="size-5" /></button>
        </div>
        <div className="mt-14 px-2">
          <p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.42)]">{isAdmin ? 'Case management' : 'Applicant space'}</p>
          <nav className="mt-4 grid gap-1" aria-label="Application navigation">
            {links.map(({ href, label, icon: Icon }) => {
              const active = location === href || (href === '/user/dashboard' && location.startsWith('/user/result'));
              return <Link key={href} href={href} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${active ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))] shadow-[inset_3px_0_0_hsl(var(--accent))]' : 'text-[hsl(var(--sidebar-foreground)/.62)] hover:bg-[hsl(var(--sidebar-accent)/.65)] hover:text-[hsl(var(--sidebar-foreground))]'}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon className={`size-[18px] ${active ? 'text-[hsl(var(--accent))]' : ''}`} />{label}</Link>;
            })}
          </nav>
        </div>
        <div className="mt-auto space-y-4">
          <div className="rounded-2xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/.55)] p-4">
            <div className="flex items-center gap-2 text-[hsl(var(--accent))]"><ShieldCheck className="size-4" /><span className="font-mono-app text-[10px] uppercase tracking-[.12em]">Private by design</span></div>
            <p className="mt-2 text-xs leading-5 text-[hsl(var(--sidebar-foreground)/.58)]">Your information is used only to assess your application.</p>
          </div>
          <button onClick={() => void signOut({ redirectUrl: '/' })} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[hsl(var(--sidebar-foreground)/.58)] transition-colors hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]" data-testid="button-sign-out"><LogOut className="size-[18px]" />Sign out</button>
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-[hsl(var(--foreground)/.35)] md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" data-testid="button-navigation-overlay" />}
      <div className="md:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-[hsl(var(--border)/.8)] bg-[hsl(var(--background)/.9)] px-5 backdrop-blur-md lg:px-10">
          <button className="grid size-10 place-items-center rounded-xl border border-[hsl(var(--border))] md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation" data-testid="button-open-navigation"><Menu className="size-5" /></button>
          <div className="hidden items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] md:flex"><span className="size-2 rounded-full bg-[hsl(var(--chart-3))]" />{isAdmin ? 'Staff workspace' : 'Your secure space'}</div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-xs font-semibold">{displayName}</p><p className="font-mono-app text-[10px] text-[hsl(var(--muted-foreground))]">{isAdmin ? 'CSR team' : 'Applicant portal'}</p></div>
            <div className="grid size-9 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-sm font-semibold text-[hsl(var(--primary))]">{initials}</div>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] px-5 py-8 lg:px-10 lg:py-11">{children}</main>
      </div>
    </div>
  );
}

export function StatusPill({ status, label }: { status: string; label?: string }) {
  const styles: Record<string, string> = {
    approved: 'bg-[hsl(155_35%_90%)] text-[hsl(155_40%_29%)]',
    eligible: 'bg-[hsl(155_35%_90%)] text-[hsl(155_40%_29%)]',
    pending: 'bg-[hsl(39_75%_90%)] text-[hsl(34_64%_31%)]',
    review: 'bg-[hsl(39_75%_90%)] text-[hsl(34_64%_31%)]',
    rejected: 'bg-[hsl(4_64%_91%)] text-[hsl(2_55%_38%)]',
    not_eligible: 'bg-[hsl(4_64%_91%)] text-[hsl(2_55%_38%)]',
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono-app text-[10px] uppercase tracking-[.08em] ${styles[status] ?? 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'}`} data-testid={`status-${status}`}><span className="size-1.5 rounded-full bg-current" />{label ?? status.replaceAll('_', ' ')}</span>;
}

export function LoadingBlocks() {
  return <div className="grid gap-4 md:grid-cols-3" data-testid="loading-state"><div className="h-28 animate-pulse rounded-2xl bg-[hsl(var(--muted))]" /><div className="h-28 animate-pulse rounded-2xl bg-[hsl(var(--muted))]" /><div className="h-28 animate-pulse rounded-2xl bg-[hsl(var(--muted))]" /></div>;
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return <div className="rounded-2xl border border-[hsl(var(--destructive)/.3)] bg-[hsl(var(--destructive)/.05)] p-8 text-center" data-testid="error-state"><p className="font-display text-2xl">We couldn’t load that just now.</p><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">The service may be taking a breath. Try again in a moment.</p><button onClick={onRetry} className="mt-5 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--primary-foreground))]" data-testid="button-retry">Try again</button></div>;
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card)/.5)] p-10 text-center" data-testid="empty-state"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><FileText className="size-5" /></div><p className="mt-4 font-display text-2xl">{title}</p><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">{body}</p></div>;
}
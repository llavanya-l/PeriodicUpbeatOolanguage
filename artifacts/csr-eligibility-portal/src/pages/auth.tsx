import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Mark } from '@/components/portal-shell';

export default function AuthPage({ role }: { role: 'user' | 'admin' }) {
  const [, setLocation] = useLocation();
  const isAdmin = role === 'admin';
  const destination = isAdmin ? '/admin/dashboard' : '/user/dashboard';

  const beginAuth = (path: '/sign-in' | '/sign-up') => {
    window.sessionStorage.setItem('civicpath-auth-redirect', destination);
    setLocation(path);
  };

  return (
    <div className="grid min-h-[100dvh] bg-[hsl(var(--background))] lg:grid-cols-[.82fr_1.18fr]">
      <div className="relative hidden overflow-hidden bg-[hsl(var(--primary))] p-10 text-[hsl(var(--primary-foreground))] lg:flex lg:flex-col lg:justify-between">
        <Link href="/" data-testid="link-auth-brand"><Mark /></Link>
        <div className="relative z-10 max-w-md pb-10">
          <div className="mb-8 size-12 rounded-2xl border border-[hsl(var(--primary-foreground)/.2)] p-3 text-[hsl(var(--accent))]"><ShieldCheck className="size-full" /></div>
          <h1 className="font-display text-6xl leading-[.95] tracking-[-.055em]">A little clarity can change a lot.</h1>
          <p className="mt-7 max-w-sm text-sm leading-7 text-[hsl(var(--primary-foreground)/.64)]">A calm place to find support, understand your options, and take the next step at your own pace.</p>
        </div>
        <div className="absolute -bottom-[16%] -right-[20%] size-[480px] rounded-full border border-[hsl(var(--accent)/.3)]" />
        <div className="absolute -bottom-[8%] -right-[12%] size-[330px] rounded-full border border-[hsl(var(--accent)/.2)]" />
      </div>
      <div className="flex flex-col px-5 py-7 sm:px-10 lg:px-20 lg:py-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:hidden" data-testid="link-mobile-auth-brand"><Mark /></Link>
          <Link href="/" className="ml-auto flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]" data-testid="link-back-home"><ArrowLeft className="size-4" /> Back to home</Link>
        </div>
        <div className="m-auto w-full max-w-[430px] py-16">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--secondary))] px-3 py-1.5 font-mono-app text-[10px] uppercase tracking-[.13em] text-[hsl(var(--primary))]"><span className="size-1.5 rounded-full bg-[hsl(var(--chart-3))]" /> Secure entry</div>
          <h2 className="font-display text-5xl leading-none tracking-[-.05em] text-[hsl(var(--primary))]">{isAdmin ? 'Welcome back, reviewer.' : 'Let’s find your next step.'}</h2>
          <p className="mt-5 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{isAdmin ? 'Reviewer access is reserved for approved CivicPath staff accounts.' : 'Create an account or sign in to keep your application and updates together.'}</p>
          <div className="mt-9 grid gap-3">
            <button type="button" onClick={() => beginAuth('/sign-in')} className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[hsl(var(--primary))] text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_hsl(var(--primary)/.2)]" data-testid="button-sign-in">
              Sign in securely <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button type="button" onClick={() => beginAuth('/sign-up')} className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm font-semibold text-[hsl(var(--primary))] transition-colors hover:bg-[hsl(var(--secondary))]" data-testid="button-create-account">
              Create an account <ArrowRight className="size-4" />
            </button>
          </div>
          <div className="mt-8 flex items-start gap-3 border-t border-[hsl(var(--border))] pt-6 text-xs leading-5 text-[hsl(var(--muted-foreground))]">
            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-[hsl(var(--chart-3))]" />
            <span>Passwords, verification, and sessions are handled securely by CivicPath Auth.</span>
          </div>
          {isAdmin ? (
            <div className="mt-7 rounded-2xl border border-[hsl(var(--accent)/.35)] bg-[hsl(var(--accent)/.08)] p-4 text-xs leading-5 text-[hsl(var(--foreground))]" data-testid="text-admin-setup">
              <p className="font-semibold text-[hsl(var(--accent-foreground))]">Hackathon reviewer setup</p>
              <p className="mt-1 text-[hsl(var(--muted-foreground))]">Create one account here, then set its public metadata <span className="font-mono-app">role</span> to <span className="font-mono-app">admin</span> in the workspace Auth pane before signing in.</p>
            </div>
          ) : (
            <p className="mt-7 text-center text-sm text-[hsl(var(--muted-foreground))]">Need to review applications? <Link href="/login/admin" className="font-semibold text-[hsl(var(--primary))]" data-testid="link-switch-admin">Staff access</Link></p>
          )}
        </div>
      </div>
    </div>
  );
}
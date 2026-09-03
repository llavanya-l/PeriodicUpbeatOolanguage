import { ArrowDown, ArrowRight, Check, CircleHelp, LockKeyhole, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { Mark, PublicHeader } from '@/components/portal-shell';

export default function Landing() {
  return (
    <div className="min-h-[100dvh] overflow-hidden bg-[hsl(var(--background))]">
      <PublicHeader />
      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 lg:px-10 lg:pb-28 lg:pt-24">
        <div className="absolute right-[-14%] top-[-20%] -z-0 size-[520px] rounded-full bg-[hsl(var(--accent)/.10)] blur-3xl" />
        <div className="grid items-end gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
          <div className="relative z-10">
            <div className="animate-rise-in inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.7)] px-3.5 py-2 font-mono-app text-[10px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]"><span className="size-1.5 rounded-full bg-[hsl(var(--chart-3))]" /> A clearer way forward</div>
            <h1 className="animate-rise-in delay-1 mt-7 max-w-[700px] font-display text-[clamp(3.3rem,7.4vw,7.4rem)] leading-[.91] tracking-[-.065em] text-[hsl(var(--primary))]">Support should feel <em className="text-[hsl(var(--accent))]">within reach.</em></h1>
            <p className="animate-rise-in delay-2 mt-8 max-w-[535px] text-lg leading-8 text-[hsl(var(--muted-foreground))]">CivicPath helps you find out what support may be available, apply with confidence, and stay close to your decision.</p>
            <div className="animate-rise-in delay-3 mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link href="/login/user" className="group flex items-center gap-3 rounded-full bg-[hsl(var(--primary))] px-6 py-3.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] shadow-[0_10px_24px_hsl(var(--primary)/.2)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_30px_hsl(var(--primary)/.28)]" data-testid="link-hero-apply">Check your eligibility <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
              <a href="#how-it-works" className="flex items-center gap-2 px-3 py-3 text-sm font-semibold text-[hsl(var(--primary))]" data-testid="link-hero-learn">See how it works <ArrowDown className="size-4" /></a>
            </div>
            <div className="mt-9 flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]"><LockKeyhole className="size-4 text-[hsl(var(--chart-3))]" /> No account history? That’s okay. Start fresh in about 5 minutes.</div>
          </div>
          <div className="animate-sweep-in delay-2 relative min-h-[420px] lg:min-h-[515px]">
            <div className="paper-grid absolute inset-0 rounded-[34px] border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.52)]" />
            <div className="absolute left-[9%] top-[11%] w-[78%] rotate-[-4deg] rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_24px_48px_hsl(var(--primary)/.12)] sm:p-8">
              <div className="flex items-center justify-between"><span className="font-mono-app text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Eligibility snapshot</span><span className="size-2 rounded-full bg-[hsl(var(--chart-3))]" /></div>
              <div className="mt-9 h-3 w-2/5 rounded-full bg-[hsl(var(--primary)/.13)]" /><div className="mt-3 h-3 w-4/5 rounded-full bg-[hsl(var(--primary)/.08)]" />
              <div className="mt-8 border-t border-[hsl(var(--border))] pt-6"><div className="flex items-end justify-between"><div><p className="font-mono-app text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Your initial result</p><p className="mt-2 font-display text-4xl text-[hsl(var(--primary))]">Likely eligible</p></div><div className="grid size-14 place-items-center rounded-full border-[7px] border-[hsl(var(--accent)/.25)] border-t-[hsl(var(--accent))] font-mono-app text-xs">74</div></div></div>
              <div className="mt-7 flex items-center gap-2 rounded-xl bg-[hsl(var(--secondary)/.8)] p-3 text-xs text-[hsl(var(--muted-foreground))]"><Check className="size-4 text-[hsl(var(--chart-3))]" /> Reviewed by the support team</div>
            </div>
            <div className="absolute bottom-[8%] right-[4%] flex max-w-[210px] items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_16px_34px_hsl(var(--primary)/.12)]"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[hsl(var(--accent)/.17)] text-[hsl(var(--accent-foreground))]"><Sparkles className="size-4" /></div><p className="text-xs font-semibold leading-5">Clear answers, not complicated language.</p></div>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="border-y border-[hsl(var(--border))] bg-[hsl(var(--card)/.45)]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
          <div className="max-w-xl"><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-[hsl(var(--accent-foreground)/.65)]">A short, considered process</p><h2 className="mt-4 font-display text-4xl leading-tight tracking-[-.04em] text-[hsl(var(--primary))] lg:text-5xl">From question to next step.</h2></div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[['01', 'Tell us about your household', 'A few practical details help us understand which programs fit your situation.'], ['02', 'Get a clear first read', 'We show how your information maps to the program guidelines, in plain language.'], ['03', 'Stay in the loop', 'Your dashboard keeps your application, updates, and next steps together.']].map(([number, title, body]) => <div key={number} className="group border-t-2 border-[hsl(var(--border))] pt-5 transition-colors hover:border-[hsl(var(--accent))]"><span className="font-mono-app text-xs text-[hsl(var(--accent-foreground)/.6)]">{number}</span><h3 className="mt-12 max-w-[250px] font-display text-2xl leading-tight">{title}</h3><p className="mt-4 max-w-[270px] text-sm leading-6 text-[hsl(var(--muted-foreground))]">{body}</p></div>)}
          </div>
        </div>
      </section>
      <section id="your-data" className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-28">
        <div><div className="grid size-14 place-items-center rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><LockKeyhole className="size-6" /></div><h2 className="mt-7 font-display text-4xl leading-tight tracking-[-.04em] text-[hsl(var(--primary))]">Your story stays yours.</h2><p className="mt-5 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">CivicPath is built around respect. We ask only what helps with your application, explain why, and keep your information in one secure place.</p></div>
        <div className="rounded-[28px] bg-[hsl(var(--primary))] p-7 text-[hsl(var(--primary-foreground))] lg:p-10"><div className="flex items-center justify-between border-b border-[hsl(var(--primary-foreground)/.16)] pb-6"><span className="font-mono-app text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary-foreground)/.58)]">What to expect</span><CircleHelp className="size-5 text-[hsl(var(--accent))]" /></div><div className="grid gap-6 pt-7 sm:grid-cols-2">{['No jargon or hidden steps', 'A decision you can understand', 'Save your progress as you go', 'A real person can review your case'].map((item) => <div key={item} className="flex items-start gap-3 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-[hsl(var(--accent))]" /><span>{item}</span></div>)}</div></div>
      </section>
      <footer className="border-t border-[hsl(var(--border))]"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between lg:px-10"><Mark /><span>© 2025 CivicPath · A public service prototype</span><Link href="/login/admin" className="font-semibold text-[hsl(var(--primary))]" data-testid="link-footer-admin">Staff access</Link></div></footer>
    </div>
  );
}

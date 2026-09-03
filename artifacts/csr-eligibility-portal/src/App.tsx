import { type ReactNode, useEffect, useRef } from 'react';
import { ClerkProvider, SignIn, SignUp, useAuth, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Redirect, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import AdminDashboard from '@/pages/admin-dashboard';
import ApplyPage from '@/pages/apply';
import AuthPage from '@/pages/auth';
import Landing from '@/pages/landing';
import NotFound from '@/pages/not-found';
import ResultPage from '@/pages/result';
import UserDashboard from '@/pages/user-dashboard';

const queryClient = new QueryClient();
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function withBase(path: string): string {
  return `${basePath}${path}` || '/';
}

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in environment.');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: withBase('/'),
    logoImageUrl: `${window.location.origin}${withBase('/logo.svg')}`,
  },
  variables: {
    colorPrimary: 'hsl(224 45% 21%)',
    colorForeground: 'hsl(226 27% 16%)',
    colorMutedForeground: 'hsl(225 13% 45%)',
    colorDanger: 'hsl(2 65% 48%)',
    colorBackground: 'hsl(43 40% 99%)',
    colorInput: 'hsl(43 33% 96%)',
    colorInputForeground: 'hsl(226 27% 16%)',
    colorNeutral: 'hsl(38 20% 84%)',
    fontFamily: 'DM Sans, sans-serif',
    borderRadius: '1rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[hsl(43_40%_99%)] rounded-[24px] w-[440px] max-w-full overflow-hidden',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: '!text-[hsl(224_45%_21%)]',
    headerSubtitle: '!text-[hsl(225_13%_45%)]',
    socialButtonsBlockButtonText: '!text-[hsl(226_27%_16%)]',
    formFieldLabel: '!text-[hsl(226_27%_16%)]',
    footerActionLink: '!text-[hsl(224_45%_21%)]',
    footerActionText: '!text-[hsl(225_13%_45%)]',
    dividerText: '!text-[hsl(225_13%_45%)]',
    identityPreviewEditButton: '!text-[hsl(224_45%_21%)]',
    formFieldSuccessText: '!text-[hsl(155_40%_29%)]',
    alertText: '!text-[hsl(2_55%_38%)]',
    logoBox: 'mb-4',
    logoImage: 'max-h-10',
    socialButtonsBlockButton: '!border-[hsl(38_20%_84%)] !bg-[hsl(43_33%_96%)]',
    formButtonPrimary: '!bg-[hsl(224_45%_21%)] !text-white hover:!bg-[hsl(224_45%_27%)]',
    formFieldInput: '!border-[hsl(38_20%_78%)] !bg-[hsl(43_33%_96%)]',
    footerAction: '!border-t-[hsl(38_20%_84%)]',
    dividerLine: '!bg-[hsl(38_20%_84%)]',
    alert: '!border-[hsl(2_65%_48%)/.3] !bg-[hsl(2_65%_48%)/.06]',
    otpCodeFieldInput: '!border-[hsl(38_20%_78%)]',
    formFieldRow: 'mb-4',
    main: 'px-2',
  },
};

function FullPageLoading() {
  return (
    <div className="grid min-h-[100dvh] place-items-center bg-[hsl(var(--background))]">
      <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
        <span className="size-2 animate-pulse rounded-full bg-[hsl(var(--accent))]" />
        Loading your secure space…
      </div>
    </div>
  );
}

function UserGuard({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <FullPageLoading />;
  if (!isSignedIn) return <Redirect to="/login/user" />;
  return <>{children}</>;
}

function AdminGuard({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  if (!isLoaded || !userLoaded) return <FullPageLoading />;
  if (!isSignedIn) return <Redirect to="/login/admin" />;
  if (user?.publicMetadata.role !== 'admin') return <Redirect to="/user/dashboard" />;
  return <>{children}</>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const client = useQueryClient();
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (previousUserId.current !== undefined && previousUserId.current !== userId) {
        client.clear();
      }
      previousUserId.current = userId;
    });
    return unsubscribe;
  }, [addListener, client]);

  return null;
}

function postAuthPath(): string {
  const stored = window.sessionStorage.getItem('civicpath-auth-redirect');
  if (stored?.startsWith('/')) return withBase(stored);
  return withBase('/user/dashboard');
}

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[hsl(var(--background))] px-4 py-8">
      <SignIn
        routing="path"
        path={withBase('/sign-in')}
        signUpUrl={withBase('/sign-up')}
        forceRedirectUrl={postAuthPath()}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[hsl(var(--background))] px-4 py-8">
      <SignUp
        routing="path"
        path={withBase('/sign-up')}
        signInUrl={withBase('/sign-in')}
        forceRedirectUrl={postAuthPath()}
      />
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login/user">
          <AuthPage role="user" />
        </Route>
        <Route path="/login/admin">
          <AuthPage role="admin" />
        </Route>
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route path="/user/dashboard">
          <UserGuard><UserDashboard /></UserGuard>
        </Route>
        <Route path="/user/apply">
          <UserGuard><ApplyPage /></UserGuard>
        </Route>
        <Route path="/user/result/:id">
          <UserGuard><ResultPage /></UserGuard>
        </Route>
        <Route path="/admin/dashboard">
          <AdminGuard><AdminDashboard /></AdminGuard>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      localization={{
        signIn: {
          start: {
            title: 'Sign in to CivicPath',
            subtitle: 'Welcome back! Please sign in to continue',
          },
        },
        signUp: {
          start: {
            title: 'Create your CivicPath account',
            subtitle: 'Start with a secure account to keep your application together.',
          },
        },
      }}
      signInUrl={withBase('/sign-in')}
      signUpUrl={withBase('/sign-up')}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
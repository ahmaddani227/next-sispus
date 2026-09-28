import { LoginHeader } from "./login-header";
import { LoginCard } from "./login-card";
import { AUTH_CONFIG } from "../constants/auth.constants";

export function Login() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-background text-foreground antialiased selection:bg-accent selection:text-accent-foreground overflow-y-auto transition-colors duration-200">
      {/* Subtle decorative header glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/5 dark:to-transparent" />

      {/* Main container centered */}
      <main className="z-10 flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <LoginHeader />
          <LoginCard />
        </div>
      </main>

      {/* Outer Footer */}
      <footer className="z-10 w-full py-5 text-center text-xs text-muted-foreground">
        <p>{AUTH_CONFIG.footerText}</p>
      </footer>
    </div>
  );
}
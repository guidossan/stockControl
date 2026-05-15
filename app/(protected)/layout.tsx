import { LogOut } from "lucide-react";
import { AppSidebar } from "@/src/components/app-sidebar";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { Button } from "@/src/components/ui/button";
import { logoutAction } from "@/src/features/auth/actions";
import { requireSession } from "@/src/lib/auth/guards";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <div className="min-h-screen md:flex">
      <AppSidebar />
      <main className="flex-1 p-4 md:p-6">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              Workspace: {session.workspaceId}
            </h1>
            <p className="text-sm text-zinc-500">Role: {session.role}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form action={logoutAction}>
              <Button variant="outline" type="submit">
                <LogOut className="size-4" />
                Logout
              </Button>
            </form>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

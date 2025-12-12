import { createClient } from '@/utils/supabase/server'
// Dashboard Layout
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { 
  LogOut,
  Plus,
  Search,
  Bell,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { QuickCreate } from '@/components/quick-create'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50/50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-white md:flex">
        <div className="flex-1 overflow-auto py-4">
          <DashboardNav />
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>{user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate w-32">{user.email}</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
            <form action="/auth/signout" method="post">
               <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                  <LogOut className="h-4 w-4" />
               </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b bg-white px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="flex-1 overflow-auto py-4">
                  <DashboardNav />
                </div>
                <div className="border-t p-4">
                  <div className="flex items-center gap-3 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>{user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate w-32">{user.email}</span>
                      <span className="text-xs text-muted-foreground">Admin</span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <QuickCreate />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

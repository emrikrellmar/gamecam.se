'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Wrench,
  Camera
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DashboardNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname.startsWith(path)
  }

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Home
      </div>
      <Link
        href="/"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900",
          pathname === "/" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100"
        )}
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        href="/orders"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900",
          isActive('/orders') ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100"
        )}
      >
        <ShoppingCart className="h-4 w-4" />
        Orders
      </Link>
      <Link
        href="/inventory"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900",
          isActive('/inventory') ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100"
        )}
      >
        <Package className="h-4 w-4" />
        Inventory
      </Link>
      <Link
        href="/customers"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900",
          isActive('/customers') ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100"
        )}
      >
        <Users className="h-4 w-4" />
        Customers
      </Link>

      <Separator className="my-4" />

      <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Operations
      </div>
      <Link
        href="/routines"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900",
          isActive('/routines') && !isActive('/routines/build-camera') ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100"
        )}
      >
        <Wrench className="h-4 w-4" />
        Routines
      </Link>
      <Link
        href="/routines/build-camera"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900",
          isActive('/routines/build-camera') ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100"
        )}
      >
        <Camera className="h-4 w-4" />
        Build Camera
      </Link>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 text-gray-500 hover:bg-gray-100"
            )}
          >
            <FileText className="h-4 w-4" />
            Reports
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Coming Soon</AlertDialogTitle>
            <AlertDialogDescription>
              The Reports feature is currently under development and will be available in a future update.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Okay</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  )
}

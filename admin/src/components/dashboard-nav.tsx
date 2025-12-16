'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Camera,
  Tag
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

      <Separator className="my-4" />

      <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Sales
      </div>
      <Link
        href="/orders"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900",
          isActive('/orders') ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100"
        )}
      >
        <ShoppingCart className="h-4 w-4" />
        Orders and customers
      </Link>

      <Link
        href="/estimates"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900",
          isActive('/estimates') ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100"
        )}
      >
        <FileText className="h-4 w-4" />
        Estimates CRM
      </Link>
      
      <Link
        href="/discounts"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900",
          isActive('/discounts') ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100"
        )}
      >
        <Tag className="h-4 w-4" />
        Prices and discounts
      </Link>

      <Separator className="my-4" />

      <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Routines
      </div>
      
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
        href="/issues"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900",
          isActive('/issues') ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100"
        )}
      >
        <FileText className="h-4 w-4" />
        Issues & support
      </Link>

      <Separator className="my-4" />

      <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Analytics
      </div>
      <Link
        href="/reports"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900",
          isActive('/reports') ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100"
        )}
      >
        <FileText className="h-4 w-4" />
        Reports
      </Link>
    </nav>
  )
}

'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { LogOut, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SignOutButton({ className }: { className?: string }) {
  const { pending } = useFormStatus()

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={cn("ml-auto h-8 w-8 text-muted-foreground hover:text-red-600", className)}
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
    </Button>
  )
}

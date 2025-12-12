'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createDiscount, updateDiscount, Discount } from './actions'
import { Loader2 } from 'lucide-react'

interface DiscountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  discountToEdit?: Discount | null
}

export function DiscountDialog({ open, onOpenChange, discountToEdit }: DiscountDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Form State
  const [code, setCode] = useState('')
  const [product, setProduct] = useState('GAMETRAQ')
  const [percentage, setPercentage] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (discountToEdit) {
      setCode(discountToEdit.code)
      setProduct(discountToEdit.product)
      setPercentage(discountToEdit.percentage.toString())
      setStartDate(new Date(discountToEdit.start_date).toISOString().split('T')[0])
      setEndDate(discountToEdit.end_date ? new Date(discountToEdit.end_date).toISOString().split('T')[0] : '')
    } else {
      setCode('')
      setProduct('GAMETRAQ')
      setPercentage('')
      setStartDate(new Date().toISOString().split('T')[0])
      setEndDate('')
    }
    setError('')
  }, [discountToEdit, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('code', code)
    formData.append('product', product)
    formData.append('percentage', percentage)
    formData.append('startDate', startDate)
    if (endDate) formData.append('endDate', endDate)

    try {
      const result = discountToEdit 
        ? await updateDiscount(discountToEdit.id, formData)
        : await createDiscount(formData)

      if (!result.success) {
        setError(result.error || 'Something went wrong')
      } else {
        onOpenChange(false)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{discountToEdit ? 'Edit Discount' : 'Create Discount'}</DialogTitle>
          <DialogDescription>
            {discountToEdit ? 'Update the discount details below.' : 'Add a new discount code for your products.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="col-span-3"
                placeholder="SUMMER2025"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product" className="text-right">
                Product
              </Label>
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GAMETRAQ">GAMETRAQ</SelectItem>
                  <SelectItem value="SHOTGUN">SHOTGUN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="percentage" className="text-right">
                Percentage
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="percentage"
                  type="number"
                  min="1"
                  max="100"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="pr-8"
                  required
                />
                <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">%</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {discountToEdit ? 'Save Changes' : 'Create Discount'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

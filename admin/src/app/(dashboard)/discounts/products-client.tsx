'use client'

import { useState } from 'react'
import { Product, updateProductPrice } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ProductsClientProps {
  products: Product[]
}

export function ProductsClient({ products }: ProductsClientProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setEditPrice(product.price.toString())
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditPrice('')
  }

  const handleSave = async (id: string) => {
    setIsLoading(true)
    const price = parseFloat(editPrice)
    
    if (isNaN(price)) {
      setIsLoading(false)
      return
    }

    const result = await updateProductPrice(id, price)
    
    if (result.success) {
      setEditingId(null)
    }
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Prices</CardTitle>
        <CardDescription>Manage base prices for your products.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No products found. Please run the database migration.
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{product.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {product.type === 'subscription' ? 'Subscription' : 'One-time'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {editingId === product.id ? (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">€</span>
                        <Input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-32 pl-7"
                          disabled={isLoading}
                        />
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => handleSave(product.id)} disabled={isLoading}>
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={handleCancel} disabled={isLoading}>
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold">€{product.price.toLocaleString('en-US')}</span>
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

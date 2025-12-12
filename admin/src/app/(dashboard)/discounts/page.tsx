import { getDiscounts, getProducts } from './actions'
import { DiscountsClient } from './discounts-client'
import { ProductsClient } from './products-client'

export default async function DiscountsPage() {
  const discounts = await getDiscounts()
  const products = await getProducts()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Prices and Discounts</h2>
        <p className="text-muted-foreground">
          Manage product prices and discount codes.
        </p>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="md:col-span-2">
          <ProductsClient products={products} />
        </div>
        <div className="md:col-span-2">
          <DiscountsClient discounts={discounts} />
        </div>
      </div>
    </div>
  )
}

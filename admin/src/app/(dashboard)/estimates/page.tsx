import { getEstimates } from './actions'
import { EstimatesBoard } from './estimates-board'

export const revalidate = 0

export default async function EstimatesPage() {
  const estimates = await getEstimates()

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <EstimatesBoard initialEstimates={estimates} />
    </div>
  )
}

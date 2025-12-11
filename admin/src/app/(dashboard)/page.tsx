import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus,
  Settings
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              12.5%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,250.00</div>
            <p className="text-xs text-muted-foreground mt-2">
              Trending up this month
              <ArrowUpRight className="inline h-3 w-3 ml-1" />
            </p>
            <p className="text-xs text-muted-foreground">
              Visitors for the last 6 months
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Customers
            </CardTitle>
            <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">
              <ArrowDownRight className="mr-1 h-3 w-3" />
              20%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground mt-2">
              Down 20% this period
              <ArrowDownRight className="inline h-3 w-3 ml-1" />
            </p>
            <p className="text-xs text-muted-foreground">
              Acquisition needs attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Accounts
            </CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              12.5%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,678</div>
            <p className="text-xs text-muted-foreground mt-2">
              Strong user retention
              <ArrowUpRight className="inline h-3 w-3 ml-1" />
            </p>
            <p className="text-xs text-muted-foreground">
              Engagement exceed targets
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Growth Rate
            </CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              4.5%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5%</div>
            <p className="text-xs text-muted-foreground mt-2">
              Steady performance increase
              <ArrowUpRight className="inline h-3 w-3 ml-1" />
            </p>
            <p className="text-xs text-muted-foreground">
              Meets growth projections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="col-span-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Total Visitors</CardTitle>
            <p className="text-sm text-muted-foreground">Total for the last 3 months</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Last 3 months</Button>
            <Button variant="ghost" size="sm">Last 30 days</Button>
            <Button variant="ghost" size="sm">Last 7 days</Button>
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          {/* Placeholder for Chart */}
          <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4 pt-8 pb-4">
             {/* Simple CSS Bar/Area Chart Representation */}
             <div className="w-full h-full bg-gradient-to-t from-blue-50 to-transparent relative rounded-lg overflow-hidden border-b border-blue-100">
                <svg className="w-full h-full absolute bottom-0 left-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                   <path d="M0 100 L0 60 Q 25 30 50 60 T 100 40 L 100 100 Z" fill="url(#gradient)" opacity="0.4" />
                   <path d="M0 60 Q 25 30 50 60 T 100 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
                   <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                         <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                         <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                   </defs>
                </svg>
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                   <div className="border-t border-dashed border-gray-200 w-full h-0"></div>
                   <div className="border-t border-dashed border-gray-200 w-full h-0"></div>
                   <div className="border-t border-dashed border-gray-200 w-full h-0"></div>
                   <div className="border-t border-dashed border-gray-200 w-full h-0"></div>
                </div>
             </div>
          </div>
          <div className="flex justify-between px-4 text-xs text-muted-foreground">
             <span>Jun 24</span>
             <span>Jun 25</span>
             <span>Jun 26</span>
             <span>Jun 27</span>
             <span>Jun 28</span>
             <span>Jun 29</span>
             <span>Jun 30</span>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="flex items-center justify-between">
         <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="rounded-full">Outline</Button>
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">
               Past Performance <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">3</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">
               Key Personnel <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">2</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">Focus Documents</Button>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
               <Settings className="h-4 w-4" />
               Customize Columns
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
               <Plus className="h-4 w-4" />
               Add Section
            </Button>
         </div>
      </div>
    </div>
  )
}

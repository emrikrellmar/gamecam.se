import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, ArrowRight } from "lucide-react"

export default function RoutinesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Routines</h1>
        <p className="text-muted-foreground">Standard operating procedures and guides.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/routines/build-camera">
          <Card className="hover:bg-slate-50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Build Camera
              </CardTitle>
              <CardDescription>
                Configure SD card and install software for Jetson Nano.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-blue-600 font-medium">
                Start Guide <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

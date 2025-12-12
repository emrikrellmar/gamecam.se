import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, AlertCircle, CheckCircle2, Download, Cpu, Save } from "lucide-react"

export default function BuildCameraPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configure SD Card & Download Software</h1>
        <p className="text-muted-foreground mt-2">
          Step-by-step guide to setting up a new Gamecam Jetson Nano unit.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Step 1 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">1</div>
              <CardTitle>Download the Jetson Nano Image</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pl-16">
            <p className="mb-4">On your laptop, go to the NVIDIA developer website to download the image.</p>
            <a 
              href="https://developer.nvidia.com/jetson-nano-sd-card-image" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              <Download className="h-4 w-4" />
              Download Jetson Nano SD Card Image
            </a>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">2</div>
              <CardTitle>Flash the Image to an SD Card</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pl-16 space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Requirement</AlertTitle>
              <AlertDescription>
                Use an SD card with at least <strong>32 GB</strong> of storage.
              </AlertDescription>
            </Alert>
            
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Insert the SD card into your laptop.</li>
              <li>
                Download and open <a href="https://etcher.balena.io/" target="_blank" className="text-blue-600 hover:underline">Balena Etcher</a>.
              </li>
              <li>Select the downloaded image file.</li>
              <li>Choose the correct SD card drive.</li>
              <li>Click <strong>Flash</strong> to begin.</li>
            </ol>
            <p className="text-sm text-muted-foreground">Once the flashing process is completed, safely eject the SD card.</p>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">3</div>
              <CardTitle>First Boot and Basic Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pl-16 space-y-4">
            <p>Insert the flashed SD card into the <strong>RS PRO Jetson Nano C100</strong> and power it up.</p>
            
            <div className="bg-slate-50 p-4 rounded-md border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Cpu className="h-4 w-4" /> On-screen Setup
              </h4>
              <ul className="space-y-2 text-sm">
                <li>Follow the on-screen setup steps.</li>
                <li>
                  Create a username and password:
                  <div className="mt-2 bg-slate-900 text-slate-50 p-3 rounded font-mono text-xs">
                    Username: gamecam<br/>
                    Password: gamecam
                  </div>
                </li>
                <li>Set your timezone, language, and keyboard layout as prompted.</li>
              </ul>
            </div>
            <p>When setup is finished, the Jetson will boot to the desktop.</p>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">4</div>
              <CardTitle>Install the Gamecam Software</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pl-16 space-y-4">
            <p>Open a Terminal window on the Jetson Nano and run the following commands one by one:</p>
            
            <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm space-y-4 overflow-x-auto">
              <div>
                <span className="text-gray-500"># Switch to superuser (enter password 'gamecam' when prompted)</span><br/>
                <span className="text-green-400">sudo su</span>
              </div>
              
              <div>
                <span className="text-gray-500"># Download the install script</span><br/>
                <span className="text-green-400">wget http://padel.gamecam.se/gamecaminstall/gamecam.sh</span>
              </div>

              <div>
                <span className="text-gray-500"># Make it executable</span><br/>
                <span className="text-green-400">chmod +x gamecam.sh</span>
              </div>

              <div>
                <span className="text-gray-500"># Run the script</span><br/>
                <span className="text-green-400">./gamecam.sh</span>
              </div>

              <div>
                <span className="text-gray-500"># Run the full installation</span><br/>
                <span className="text-green-400">./full.sh</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 5 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">5</div>
              <CardTitle>Configure Camera Number</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pl-16 space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Critical Step</AlertTitle>
              <AlertDescription>
                Entering the wrong number will prevent the SD card from connecting to the server. If unsure, check with Vivek.
              </AlertDescription>
            </Alert>

            <p>When prompted, enter the correct camera number (e.g., <strong>432</strong>).</p>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Then follow these inputs exactly as shown:</p>
              <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm">
                y<br/>
                <span className="text-gray-500">[ENTER]</span><br/>
                <span className="text-gray-500">[ENTER]</span><br/>
                <span className="text-gray-500">[ENTER]</span><br/>
                yes<br/>
                <br/>
                Gamecam@6916123789456<br/>
                Gamecam@6916123789456
              </div>
            </div>

            <p className="text-sm">At this point, the terminal should show: <code className="bg-slate-100 px-1 py-0.5 rounded">root@vivek</code></p>
          </CardContent>
        </Card>

        {/* Step 6 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">6</div>
              <CardTitle>Copy SSH Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pl-16 space-y-4">
            <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm">
              <span className="text-green-400">./copyssh.sh</span>
            </div>

            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Enter the same correct camera number again (e.g., <strong>432</strong>).</li>
              <li>Follow the inputs exactly:</li>
            </ul>

            <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm">
              y<br/>
              y<br/>
              exit
            </div>

            <p className="text-sm">
              After this, the terminal should show: <code className="bg-slate-100 px-1 py-0.5 rounded">root@gamecam</code>
            </p>
            <p className="text-sm text-muted-foreground">
              The system will automatically start running several processes. Once it completes these, the Jetson Nano will reboot automatically. Wait for it to fully restart.
            </p>
          </CardContent>
        </Card>

        {/* Step 7 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">7</div>
              <CardTitle>Verify Camera Online Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pl-16 space-y-4">
            <p>After the reboot, open a web browser on your laptop and go to:</p>
            <a href="https://install.gamecam.se/" target="_blank" className="text-blue-600 hover:underline font-medium block">
              https://install.gamecam.se/
            </a>
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded border border-green-200">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Check if the configured camera number is showing as ONLINE.</span>
            </div>
          </CardContent>
        </Card>

        {/* Step 8 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">8</div>
              <CardTitle>Remove the SD Card</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pl-16 space-y-4">
            <ol className="list-decimal list-inside space-y-2">
              <li>Power off the Jetson Nano.</li>
              <li>Remove the SD card.</li>
              <li>
                <span className="font-semibold">Label the SD card clearly with its camera number (e.g., 432).</span>
              </li>
            </ol>
            <div className="flex items-center gap-2 text-muted-foreground mt-4">
              <Save className="h-4 w-4" />
              <span>Process Complete</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

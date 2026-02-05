"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowRight, Check, CheckCircle2, Package, QrCode, ScanLine, Search, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ScanPackagesPage() {
  const [scanMode, setScanMode] = useState<"barcode" | "manual">("barcode")
  const [packageId, setPackageId] = useState("")
  const [scanSuccess, setScanSuccess] = useState<boolean | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  // Mock data for recently scanned packages
  const recentScans = [
    { id: "PKG-12345", orderId: "ORD-12345", status: "Ready for Dispatch", timestamp: "10:15 AM" },
    { id: "PKG-12346", orderId: "ORD-12346", status: "Ready for Dispatch", timestamp: "10:12 AM" },
    { id: "PKG-12347", orderId: "ORD-12347", status: "Ready for Dispatch", timestamp: "10:08 AM" },
    { id: "PKG-12348", orderId: "ORD-12348", status: "Issue Detected", timestamp: "10:05 AM" },
    { id: "PKG-12349", orderId: "ORD-12349", status: "Ready for Dispatch", timestamp: "9:58 AM" },
  ]

  const handleScan = () => {
    if (packageId) {
      // Simulate scan success (would be replaced with actual scanning logic)
      const success = packageId !== "PKG-ERROR"
      setScanSuccess(success)

      if (!success) {
        setShowDialog(true)
      }

      // Reset after a delay
      setTimeout(() => {
        setScanSuccess(null)
        setPackageId("")
      }, 2000)
    }
  }

  return (
    <MainLayout userRole="warehouse" userName="Warehouse Staff">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Scan Packages</h2>
          <p className="text-muted-foreground">Scan packages to mark them ready for dispatch</p>
        </div>

        <Tabs defaultValue="scan">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">Scan Packages</TabsTrigger>
            <TabsTrigger value="history">Recent Scans</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Package Scanner</CardTitle>
                <CardDescription>Scan package barcodes or enter package IDs manually</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Scan Method</Label>
                  <div className="flex gap-4">
                    <Button
                      variant={scanMode === "barcode" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setScanMode("barcode")}
                    >
                      <ScanLine className="mr-2 h-4 w-4" />
                      Barcode Scanner
                    </Button>
                    <Button
                      variant={scanMode === "manual" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setScanMode("manual")}
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      Manual Entry
                    </Button>
                  </div>
                </div>

                {scanMode === "barcode" ? (
                  <div className="border rounded-md p-4 aspect-video flex items-center justify-center bg-muted/50">
                    <div className="text-center">
                      <ScanLine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Camera feed would appear here</p>
                      <p className="text-xs text-muted-foreground mt-2">Position the barcode or QR code in the frame</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="package-id">Package ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="package-id"
                        placeholder="Enter package ID (e.g., PKG-12345)"
                        value={packageId}
                        onChange={(e) => setPackageId(e.target.value)}
                      />
                      <Button onClick={handleScan} disabled={!packageId}>
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter the package ID exactly as it appears on the label
                    </p>
                  </div>
                )}

                {scanSuccess !== null && (
                  <div
                    className={`p-4 rounded-md ${
                      scanSuccess
                        ? "bg-green-50 border border-green-200 text-green-700"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {scanSuccess ? (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Package Scanned Successfully</p>
                            <p className="text-sm">Package marked as ready for dispatch</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Scan Error</p>
                            <p className="text-sm">Package not found or already processed</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleScan} disabled={scanMode === "manual" && !packageId}>
                  {scanMode === "barcode" ? "Start Scanning" : "Process Package"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Package Information</CardTitle>
                <CardDescription>Details about the scanned package</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Scan a package to view its details</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Package information will appear here after scanning
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>Packages scanned in the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentScans.map((scan) => (
                      <TableRow key={scan.id}>
                        <TableCell className="font-medium">{scan.id}</TableCell>
                        <TableCell>{scan.orderId}</TableCell>
                        <TableCell>
                          <Badge variant={scan.status === "Ready for Dispatch" ? "outline" : "destructive"}>
                            {scan.status === "Ready for Dispatch" ? (
                              <Check className="mr-1 h-3 w-3" />
                            ) : (
                              <X className="mr-1 h-3 w-3" />
                            )}
                            {scan.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{scan.timestamp}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Details
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previous</Button>
                <Button variant="outline">Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Package Error</DialogTitle>
              <DialogDescription>There was an issue with the package you scanned.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Package Not Found</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>The package ID you entered was not found in the system. Please check the ID and try again.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Try Again
              </Button>
              <Button onClick={() => setShowDialog(false)}>Report Issue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}

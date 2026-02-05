"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Check, ImageIcon, Upload, X } from "lucide-react"

export default function ProofOfDeliveryPage() {
  const [captureMode, setCaptureMode] = useState<"camera" | "upload">("camera")
  const [signature, setSignature] = useState<boolean>(false)

  return (
    <MainLayout userRole="driver" userName="Michael Johnson">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Proof of Delivery</h2>
          <p className="text-muted-foreground">Capture photos or signatures to confirm delivery</p>
        </div>

        <Tabs defaultValue="capture">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="capture">Capture New</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="capture" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Capture Proof of Delivery</CardTitle>
                <CardDescription>Select an order and capture a photo or signature</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="order-id">Order ID</Label>
                  <Input id="order-id" placeholder="Enter or scan order ID" />
                </div>

                <div className="space-y-2">
                  <Label>Capture Type</Label>
                  <div className="flex gap-4">
                    <Button
                      variant={signature ? "outline" : "default"}
                      className="flex-1"
                      onClick={() => setSignature(false)}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Photo
                    </Button>
                    <Button
                      variant={signature ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setSignature(true)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Signature
                    </Button>
                  </div>
                </div>

                {!signature && (
                  <div className="space-y-2">
                    <Label>Capture Method</Label>
                    <div className="flex gap-4">
                      <Button
                        variant={captureMode === "camera" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setCaptureMode("camera")}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Camera
                      </Button>
                      <Button
                        variant={captureMode === "upload" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setCaptureMode("upload")}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  {signature ? (
                    <div className="border rounded-md p-4 h-64 flex items-center justify-center bg-muted/50">
                      <div className="text-center">
                        <p className="text-muted-foreground">Signature capture area would appear here</p>
                        <p className="text-xs text-muted-foreground mt-2">Ask customer to sign within this area</p>
                      </div>
                    </div>
                  ) : captureMode === "camera" ? (
                    <div className="border rounded-md p-4 aspect-video flex items-center justify-center bg-muted/50">
                      <div className="text-center">
                        <p className="text-muted-foreground">Camera feed would appear here</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Position the package or delivery location in frame
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-md border-dashed p-4 aspect-video flex flex-col items-center justify-center bg-muted/50">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Drag and drop or click to upload</p>
                      <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG, HEIC</p>
                      <Button variant="outline" className="mt-4">
                        Select File
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {signature ? "Save Signature" : captureMode === "camera" ? "Capture Photo" : "Upload Photo"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Captures</h3>
              <div className="flex items-center gap-2">
                <Input placeholder="Search by order ID" className="w-[200px]" />
                <Button variant="outline" size="sm">
                  Today
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">ORD-1234{item}</CardTitle>
                    <CardDescription>May 11, 2025 • 10:3{item} AM</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-muted-foreground">{item % 3 === 0 ? "Signature" : "Photo"}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-4">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      <X className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}

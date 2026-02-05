"use client"

import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, CheckCircle2, Clock, MapPin, Package, Phone, User } from "lucide-react"
import Link from "next/link"

export default function DriverDashboard() {
  // Mock data for driver assignments
  const assignments = [
    {
      id: "ORD-12345",
      customer: "John Smith",
      address: "123 Main St, Anytown, CA 12345",
      phone: "+1 (555) 123-4567",
      items: 3,
      status: "Ready for Pickup",
      eta: "9:00 AM - 10:00 AM",
    },
    {
      id: "ORD-12346",
      customer: "Sarah Williams",
      address: "456 Oak Ave, Somewhere, CA 12345",
      phone: "+1 (555) 987-6543",
      items: 2,
      status: "In Transit",
      eta: "10:30 AM - 11:30 AM",
    },
    {
      id: "ORD-12347",
      customer: "Robert Brown",
      address: "789 Pine Rd, Nowhere, CA 12345",
      phone: "+1 (555) 456-7890",
      items: 1,
      status: "Scheduled",
      eta: "1:00 PM - 2:00 PM",
    },
    {
      id: "ORD-12348",
      customer: "Emily Davis",
      address: "101 Elm St, Anywhere, CA 12345",
      phone: "+1 (555) 234-5678",
      items: 4,
      status: "Scheduled",
      eta: "2:30 PM - 3:30 PM",
    },
  ]

  return (
    <MainLayout userRole="driver" userName="Michael Johnson">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Today's Assignments</h2>
          <p className="text-muted-foreground">May 11, 2025 • 4 deliveries scheduled</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Route</CardTitle>
            <CardDescription>Your optimized delivery route for today</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Interactive map would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pickup">Ready for Pickup</TabsTrigger>
              <TabsTrigger value="in-transit">In Transit</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-4 space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{assignment.id}</CardTitle>
                    <Badge
                      variant={
                        assignment.status === "Ready for Pickup"
                          ? "outline"
                          : assignment.status === "In Transit"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      ETA: {assignment.eta}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.customer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>{assignment.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {assignment.items} {assignment.items === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full gap-2">
                    {assignment.status === "Ready for Pickup" && (
                      <Button className="w-full" asChild>
                        <Link href={`/driver/pickup/${assignment.id}`}>
                          Pick Up
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {assignment.status === "In Transit" && (
                      <Button className="w-full" asChild>
                        <Link href={`/driver/delivery/${assignment.id}`}>
                          Mark Delivered
                          <CheckCircle2 className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {assignment.status === "Scheduled" && (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/driver/details/${assignment.id}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pickup" className="mt-4 space-y-4">
            {assignments
              .filter((a) => a.status === "Ready for Pickup")
              .map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{assignment.id}</CardTitle>
                      <Badge variant="outline">{assignment.status}</Badge>
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ETA: {assignment.eta}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{assignment.customer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{assignment.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{assignment.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {assignment.items} {assignment.items === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/driver/pickup/${assignment.id}`}>
                        Pick Up
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="in-transit" className="mt-4 space-y-4">
            {assignments
              .filter((a) => a.status === "In Transit")
              .map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{assignment.id}</CardTitle>
                      <Badge variant="secondary">{assignment.status}</Badge>
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ETA: {assignment.eta}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{assignment.customer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{assignment.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{assignment.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {assignment.items} {assignment.items === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/driver/delivery/${assignment.id}`}>
                        Mark Delivered
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="scheduled" className="mt-4 space-y-4">
            {assignments
              .filter((a) => a.status === "Scheduled")
              .map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{assignment.id}</CardTitle>
                      <Badge>{assignment.status}</Badge>
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ETA: {assignment.eta}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{assignment.customer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{assignment.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{assignment.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {assignment.items} {assignment.items === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/driver/details/${assignment.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>Your delivery schedule for the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{day}</p>
                      <p className="text-sm text-muted-foreground">May {11 + index}, 2025</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {index === 0 ? "4 Deliveries" : index === 4 ? "Off Day" : `${5 - index} Deliveries`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {index === 0 ? "9:00 AM - 4:00 PM" : index === 4 ? "Not Scheduled" : "9:00 AM - 5:00 PM"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

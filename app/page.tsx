"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LandingPage() {
  const [trackingId, setTrackingId] = useState("")
  const [adminUsername, setAdminUsername] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (adminUsername === "Admin" && adminPassword === "Admin12345") {
      window.location.href = "/admin"
    } else {
      setLoginError("Invalid username or password")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex h-20 items-center border-b px-4 md:px-6 bg-white border-orange-600">
        <div className="flex items-center gap-3">
          <Image src="/msm-courier-logo.jpg" alt="MSM Courier Logo" width={60} height={60} className="object-contain" />
          <div>
            <span className="text-sm font-semibold text-gray-700">MSM</span>
            <span className="text-lg font-bold text-orange-600">COURIER</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-cover bg-center relative"
          style={{
            backgroundImage: "url('/msm-background.jpg')",
          }}
        >
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black/40" />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white drop-shadow-lg">
                  TRACK PARCEL
                </h1>
                <p className="text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed drop-shadow">
                  Track your shipments in real-time with MSM COURIER. Enter your tracking ID to monitor your delivery
                  every step of the way.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <Tabs defaultValue="track" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white">
                    <TabsTrigger
                      value="track"
                      className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                    >
                      Track Parcel
                    </TabsTrigger>
                    <TabsTrigger
                      value="admin"
                      className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                    >
                      Admin
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="track">
                    <Card className="bg-white shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-orange-600">Track Your Parcel</CardTitle>
                        <CardDescription>Enter your tracking ID to track your delivery.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="tracking-id">Tracking ID</Label>
                          <Input
                            id="tracking-id"
                            placeholder="e.g., MSM123456"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            className="border-orange-200 focus:border-orange-600"
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                          disabled={!trackingId}
                          asChild
                        >
                          <Link href={`/track/${trackingId}`}>
                            Track Order
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="admin">
                    <Card className="bg-white shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-orange-600">Admin Login</CardTitle>
                        <CardDescription>Login to access the admin dashboard.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <form onSubmit={handleAdminLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="admin-username">Username</Label>
                            <Input
                              id="admin-username"
                              placeholder="Enter username"
                              value={adminUsername}
                              onChange={(e) => setAdminUsername(e.target.value)}
                              className="border-orange-200 focus:border-orange-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="admin-password">Password</Label>
                            <Input
                              id="admin-password"
                              type="password"
                              placeholder="Enter password"
                              value={adminPassword}
                              onChange={(e) => setAdminPassword(e.target.value)}
                              className="border-orange-200 focus:border-orange-600"
                            />
                          </div>
                          {loginError && <p className="text-sm text-red-500">{loginError}</p>}
                          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                            Login
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="space-y-12">
              {/* Section Header */}
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                  Our Services & Customer Testimonies
                </h2>
                <p className="mx-auto max-w-2xl text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Trusted by customers worldwide for reliable, fast, and professional logistics solutions
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-600">Fast Delivery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Express shipping options available for urgent deliveries across multiple regions.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-600">Real-Time Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Track your shipments in real-time with our advanced GPS tracking system.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-600">Secure Handling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Your packages are handled with care using modern security and protection measures.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-600">24/7 Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Our customer support team is available round the clock to assist you.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Testimonials Section */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-center text-gray-900">What Our Customers Say</h3>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {/* Testimonial 1 - USA */}
                  <Card className="border-l-4 border-l-orange-600 bg-gray-50">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-orange-600 text-lg">
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          "MSM Courier has been absolutely fantastic! Their tracking system is seamless and the delivery
                          was faster than expected. I've shipped multiple packages and every single one arrived in
                          perfect condition. Highly recommended!"
                        </p>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="font-semibold text-gray-900">Sarah Johnson</p>
                          <p className="text-sm text-gray-600">New York, United States</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Testimonial 2 - Australia */}
                  <Card className="border-l-4 border-l-orange-600 bg-gray-50">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-orange-600 text-lg">
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          "Outstanding service! I was skeptical about international shipping, but MSM Courier made the
                          entire process smooth and stress-free. My package arrived on schedule from Australia to my
                          business location."
                        </p>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="font-semibold text-gray-900">Michael Chen</p>
                          <p className="text-sm text-gray-600">Sydney, Australia</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Testimonial 3 - China */}
                  <Card className="border-l-4 border-l-orange-600 bg-gray-50">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-orange-600 text-lg">
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          "As an exporter based in Shanghai, I trust MSM Courier with all our international shipments.
                          Their handling of delicate goods is exceptional, and their customs clearance process is
                          incredibly efficient."
                        </p>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="font-semibold text-gray-900">Liu Wei</p>
                          <p className="text-sm text-gray-600">Shanghai, China</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Testimonial 4 - Spain */}
                  <Card className="border-l-4 border-l-orange-600 bg-gray-50">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-orange-600 text-lg">
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          "Excelente servicio! We've partnered with MSM Courier for our European distribution center.
                          Their reliability and professionalism have made them our preferred logistics partner. Highly
                          trustworthy!"
                        </p>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="font-semibold text-gray-900">Carlos Rodríguez</p>
                          <p className="text-sm text-gray-600">Madrid, Spain</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-orange-200 py-6 md:py-8 bg-gray-50">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/msm-courier-logo.jpg"
              alt="MSM Courier Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <p className="text-sm text-gray-600">© 2025 MSM COURIER. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-orange-600 hover:underline font-medium">
              Terms
            </Link>
            <Link href="#" className="text-sm text-orange-600 hover:underline font-medium">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-orange-600 hover:underline font-medium">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

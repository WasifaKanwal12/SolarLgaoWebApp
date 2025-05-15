"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/config"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

export default function CustomerDashboard() {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin")
        return
      }

      const userDoc = await getDoc(doc(db, "Users", user.uid))
      if (!userDoc.exists() || userDoc.data().role !== "customer") {
        router.push("/unauthorized")
        return
      }
    })

    return () => unsubscribe()
  }, [router])

  const providers = [
    {
      id: 1,
      name: "GreenSun Solar",
      image: "/provider.png",
      rating: 4.8,
      reviews: 24,
      location: "Attock",
      services: ["Solar Panel Installation", "Maintenance", "Consultation"],
    },
    {
      id: 2,
      name: "SolarTech Solutions",
      image: "/provider.png",
      rating: 4.5,
      reviews: 18,
      location: "Islamabad",
      services: ["Solar Panel Installation", "Solar Water Heater", "Energy Audit"],
    },
    {
      id: 3,
      name: "EcoSolar ",
      image: "/provider.png",
      rating: 4.7,
      reviews: 32,
      location: "Rawalpindi",
      services: ["Solar Panel Installation", "Battery Storage", "Commercial Solutions"],
    },
  ]

  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProviders, setFilteredProviders] = useState(providers)

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query) {
      const filtered = providers.filter(
        (provider) =>
          provider.name.toLowerCase().includes(query) ||
          provider.location.toLowerCase().includes(query) ||
          provider.services.some((service) => service.toLowerCase().includes(query)),
      )
      setFilteredProviders(filtered)
    } else {
      setFilteredProviders(providers)
    }
  }

  const handleGetRecommendation = () => {
    router.push("/recommendation")
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-8">Find Your Solar Solution</h1>

          {/* Get Recommendation Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleGetRecommendation}
              className="px-6 py-3 text-white font-semibold rounded-md bg-primary-green animate-pulse hover:animate-none transition-all duration-300"
            >
              🌞 Get Your Solar Recommendation
            </button>
          </div>

          {/* Provider Search */}
          <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Find Service Providers</h2>

            <div className="mb-6">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search by name, location, or service
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green"
                placeholder="e.g., Solar Panel Installation, Attock, GreenSun"
              />
            </div>

            <div className="space-y-6">
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4"
                  >
                    <div className="w-full md:w-32 h-32 relative">
                      <Image
                        src={provider.image || "/placeholder.svg"}
                        alt={provider.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{provider.name}</h3>
                          <p className="text-gray-600">{provider.location}</p>
                        </div>

                        <div className="flex items-center mt-2 md:mt-0">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${i < Math.floor(provider.rating) ? "text-yellow-400" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-gray-600">
                            {provider.rating} ({provider.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Services:</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {provider.services.map((service, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        <Link href={`/provider/${provider.id}`} className="btn-primary text-center">
                          View Profile
                        </Link>
                        <button className="btn-secondary">Request Quote</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No providers found matching your search criteria.</p>
                </div>
              )}
            </div>
          </section>

          {/* Financing Options */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Financing Options</h2>
            <p className="text-gray-600 mb-6">
              Explore various financing options to make your solar installation more affordable.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">Solar Loan</h3>
                <p className="text-gray-600 mb-4">
                  Low-interest loans specifically designed for solar installations with flexible repayment terms.
                </p>
                <button className="text-primary-green font-medium hover:underline">Learn More</button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">Solar Lease</h3>
                <p className="text-gray-600 mb-4">
                  Install solar with no upfront cost and make fixed monthly payments for the system.
                </p>
                <button className="text-primary-green font-medium hover:underline">Learn More</button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">Government Subsidies</h3>
                <p className="text-gray-600 mb-4">
                  Take advantage of government incentives and tax benefits for solar installations.
                </p>
                <button className="text-primary-green font-medium hover:underline">Learn More</button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}

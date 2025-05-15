"use client"

import { useState ,useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function ProviderDashboard() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin");
        return;
      }

      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "provider" || userDoc.data().status !== "approved") {
        router.push("/provider/pending"); // Or an unauthorized page
        return;
      }
    });

    return () => unsubscribe();
  }, [router]);
  // Sample data for dashboard
  const stats = [
    {
      label: "Total Sales",
      value: "$12,500",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Installations",
      value: "24",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "Customers",
      value: "32",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      label: "Rating",
      value: "4.8/5",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
  ]

  // Sample orders data
  const orders = [
    {
      id: 1,
      customer: "Rahul Sharma",
      service: "Solar Panel Installation",
      amount: "$2,500",
      status: "Completed",
      date: "2023-04-15",
    },
    {
      id: 2,
      customer: "Priya Patel",
      service: "Solar Water Heater",
      amount: "$1,200",
      status: "In Progress",
      date: "2023-04-18",
    },
    {
      id: 3,
      customer: "Amit Singh",
      service: "Maintenance",
      amount: "$350",
      status: "Pending",
      date: "2023-04-20",
    },
  ]

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      customer: "Rahul Sharma",
      rating: 5,
      comment: "Excellent service and installation. Very professional team.",
      date: "2023-04-15",
    },
    {
      id: 2,
      customer: "Priya Patel",
      rating: 4,
      comment: "Good service but took longer than expected for installation.",
      date: "2023-04-10",
    },
  ]

  // Sidebar links for provider
  const sidebarLinks = [
    {
      label: "Dashboard",
      href: "/provider",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: "Services",
      href: "/provider/services",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "Orders",
      href: "/provider/orders",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      label: "Payments",
      href: "/provider/payments",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      label: "Reviews",
      href: "/provider/reviews",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      label: "Profile",
      href: "/provider/profile",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ]

  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="Service Provider" links={sidebarLinks} />

      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-sm">
          <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Provider Dashboard</h1>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">greensun@example.com</span>
              <div className="h-8 w-8 rounded-full bg-primary-green flex items-center justify-center text-white">G</div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4 flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-primary-green mr-4">{stat.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "overview"
                        ? "border-primary-green text-primary-green"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "orders"
                        ? "border-primary-green text-primary-green"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("orders")}
                  >
                    Orders
                  </button>
                  <button
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "reviews"
                        ? "border-primary-green text-primary-green"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("reviews")}
                  >
                    Reviews
                  </button>
                </nav>
              </div>

              <div className="p-4">
                {activeTab === "overview" && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Monthly Sales Overview</h3>
                    <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-gray-500">Sales Chart Placeholder</p>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button className="bg-primary-green text-white p-4 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Add New Service
                        </button>
                        <button className="bg-secondary-blue text-white p-4 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                          </svg>
                          View Orders
                        </button>
                        <button className="bg-gray-700 text-white p-4 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          Withdraw Funds
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "orders" && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Order ID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Customer
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Service
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Amount
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{order.customer}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{order.service}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{order.amount}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === "Completed"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "In Progress"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{order.date}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-primary-green hover:text-green-700">View</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{review.customer}</p>
                              <div className="flex mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                          <p className="mt-2 text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


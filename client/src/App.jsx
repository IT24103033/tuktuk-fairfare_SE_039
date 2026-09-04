import { useState, useEffect } from 'react'
import { Shield, MapPin, Info, Star, Search, RefreshCw, Wifi, WifiOff, PlusCircle } from 'lucide-react'
import FareCalculator from './FareCalculator'
import RouteCard from './RouteCard'
import BenchmarkModal from './BenchmarkModal'
import { API_BASE_URL } from './apiConfig'
import './index.css'

// Default fallback benchmark routes in Sri Lanka
const DEFAULT_BENCHMARK_ROUTES = [
  {
    id: 1,
    route: 'Colombo Airport (BIA) to Colombo Fort',
    origin: 'Colombo Airport (BIA)',
    destination: 'Colombo Fort',
    distanceKm: 32,
    estimatedDayFareLkr: 2500,
    scamAlert:
      'Watch out for flat rates over LKR 4000. Insist on the meter or pre-negotiate.',
  },
  {
    id: 2,
    route: 'Kandy Railway Station to Temple of the Tooth',
    origin: 'Kandy Railway Station',
    destination: 'Temple of the Tooth',
    distanceKm: 1.5,
    estimatedDayFareLkr: 155,
    scamAlert:
      'Extremely short distance. Walkable, but if riding, do not pay over LKR 250.',
  },
  {
    id: 3,
    route: 'Galle Fort to Unawatuna Beach',
    origin: 'Galle Fort',
    destination: 'Unawatuna Beach',
    distanceKm: 6.0,
    estimatedDayFareLkr: 560,
    scamAlert:
      'Common tourist route. Drivers often ask for LKR 1000+. Show them the standard rate.',
  },
]

export default function App() {
  const [routes, setRoutes] = useState(DEFAULT_BENCHMARK_ROUTES)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isBackendConnected, setIsBackendConnected] = useState(false)

  // Modal State for CRUD operations
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState(null)
  const [isSubmittingModal, setIsSubmittingModal] = useState(false)
  const [serverErrors, setServerErrors] = useState(null)

  // Fetch benchmark routes from backend API with fallback
  const fetchBenchmarks = async (search = '') => {
    setIsLoading(true)
    try {
      const url = search.trim()
        ? `${API_BASE_URL}/api/benchmarks?search=${encodeURIComponent(search.trim())}`
        : `${API_BASE_URL}/api/benchmarks`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          const normalized = data.map((item) => {
            let origin = ''
            let destination = ''
            if (item.route && item.route.includes(' to ')) {
              const parts = item.route.split(' to ')
              origin = parts[0].trim()
              destination = parts.slice(1).join(' to ').trim()
            } else {
              origin = item.route || item.origin || 'Route'
              destination = item.destination || ''
            }
            return {
              id: item.id || item._id || `route-${Math.random()}`,
              origin,
              destination,
              route: item.route,
              distanceKm: item.distanceKm,
              estimatedDayFareLkr: item.estimatedFare || item.estimatedDayFareLkr || 0,
              scamAlert: item.scamAlert,
              comments: item.comments || [],
            }
          })
          setRoutes(normalized)
          setIsBackendConnected(true)
          setIsLoading(false)
          return
        }
      }
    } catch {
      // Offline fallback
    }

    // Client-side fallback filter
    setIsBackendConnected(false)
    if (search.trim()) {
      const q = search.toLowerCase()
      const filtered = DEFAULT_BENCHMARK_ROUTES.filter(
        (r) =>
          r.origin.toLowerCase().includes(q) ||
          r.destination.toLowerCase().includes(q) ||
          (r.route && r.route.toLowerCase().includes(q))
      )
      setRoutes(filtered)
    } else {
      setRoutes(DEFAULT_BENCHMARK_ROUTES)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchBenchmarks()
  }, [])

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    fetchBenchmarks(query)
  }

  // Open modal to Create a new route
  const handleOpenCreateModal = () => {
    setEditingRoute(null)
    setServerErrors(null)
    setIsModalOpen(true)
  }

  // Open modal to Edit an existing route
  const handleOpenEditModal = (route) => {
    setEditingRoute(route)
    setServerErrors(null)
    setIsModalOpen(true)
  }

  // Save (Create or Update) a benchmark route via API
  const handleSaveRoute = async (formData) => {
    setIsSubmittingModal(true)
    setServerErrors(null)

    try {
      let response
      if (editingRoute) {
        // PUT /api/benchmarks/:id
        response = await fetch(`${API_BASE_URL}/api/benchmarks/${editingRoute.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      } else {
        // POST /api/benchmarks
        const newId = Math.floor(1000 + Math.random() * 9000)
        response = await fetch(`${API_BASE_URL}/api/benchmarks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: newId }),
        })
      }

      if (response.ok) {
        setIsSubmittingModal(false)
        setIsModalOpen(false)
        fetchBenchmarks(searchQuery)
        return
      } else {
        const errorData = await response.json()
        setServerErrors(errorData.details || errorData.error || 'Failed to save route benchmark.')
      }
    } catch (err) {
      setServerErrors('Network error connecting to backend API.')
    }
    setIsSubmittingModal(false)
  }

  // Delete a benchmark route via API
  const handleDeleteRoute = async (route) => {
    if (!window.confirm(`Are you sure you want to delete "${route.route || route.origin}"?`)) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/benchmarks/${route.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchBenchmarks(searchQuery)
      } else {
        alert('Failed to delete route benchmark.')
      }
    } catch {
      alert('Network error deleting route benchmark.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/70 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Soft, gentle ambient background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200/35 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-cyan-200/25 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-indigo-100/35 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">

        {/* ── HEADER BANNER ─────────────────────────────────────────── */}
        <header className="mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            {/* Regulatory Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200/80 rounded-full shadow-xs">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-semibold text-blue-800 tracking-wide">
                Official Rate Guide · Sri Lanka
              </span>
            </div>

            {/* Backend Connectivity Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-xs transition-colors ${
                isBackendConnected
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {isBackendConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Live API Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Offline Ready</span>
                </>
              )}
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4 tracking-tight">
            <span className="text-slate-950">TukTuk</span>{' '}
            <span className="gradient-text">FairFare</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-6 font-normal">
            Sri Lanka's three-wheelers (tuk-tuks) are <strong className="text-slate-900 font-semibold">unmetered</strong>, 
            and tourists are routinely overcharged — sometimes paying{' '}
            <strong className="text-red-600 font-bold">3 to 5 times</strong> the standard local rate.
            Fares are set informally, and without a benchmark, travellers have no way to negotiate fairly.
          </p>

          {/* Stats row with subtle pop hover */}
          <div className="flex flex-wrap gap-3.5 mt-6">
            {[
              { icon: Shield, label: 'Official Rates', value: 'LKR 110 base / +90 per km', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: MapPin, label: 'Benchmark Routes', value: `${routes.length} Available`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Star, label: 'Night Surcharge', value: '+ 15% (10 PM – 5 AM)', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div
                key={label}
                className="btn-pop flex items-center gap-3 px-4 py-3 bg-white border border-slate-200/90 rounded-2xl shadow-xs cursor-default"
              >
                <div className={`p-2 rounded-xl ${bg} ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-bold text-slate-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Info callout */}
          <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50/80 border border-blue-200/80 rounded-2xl max-w-2xl shadow-xs">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-950 font-medium leading-relaxed">
              These rates reflect regulated legal guidance for three-wheeler fares.
              Always agree on a price <em>before</em> getting in. When negotiating, present these benchmark rates calmly.
            </p>
          </div>
        </header>

        {/* ── FARE CALCULATOR ───────────────────────────────────────── */}
        <section aria-labelledby="calc-heading" className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 id="calc-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Calculate Your Fare
            </h2>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <div className="max-w-lg">
            <FareCalculator />
          </div>
        </section>

        {/* ── BENCHMARK ROUTES GRID ─────────────────────────────────── */}
        <section aria-labelledby="routes-heading">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 id="routes-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Common Tourist Routes
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verified fair price bands for popular routes. Night rates include 15% surcharge.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Add New Route Button */}
              <button
                onClick={handleOpenCreateModal}
                className="btn-pop px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm cursor-pointer border border-blue-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                Add Route
              </button>

              {/* Live Search Input connected to GET /api/benchmarks?search= */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search routes (e.g. Galle, Fort)..."
                  className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-xs font-medium"
                />
                {isLoading && (
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600 absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin" />
                )}
              </div>
            </div>
          </div>

          {routes.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-600 font-medium">No benchmark routes match "{searchQuery}".</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  fetchBenchmarks('')
                }}
                className="btn-pop mt-3.5 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200 hover:bg-blue-100 cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {routes.map((route) => (
                <RouteCard
                  key={route.id}
                  id={route.id}
                  origin={route.origin}
                  destination={route.destination}
                  route={route.route}
                  distanceKm={route.distanceKm}
                  estimatedDayFareLkr={route.estimatedDayFareLkr}
                  scamAlert={route.scamAlert}
                  comments={route.comments || []}
                  onEdit={() => handleOpenEditModal(route)}
                  onDelete={() => handleDeleteRoute(route)}
                  onCommentAdded={(routeId, updatedComments) => {
                    setRoutes((prev) =>
                      prev.map((r) => (r.id === routeId ? { ...r, comments: updatedComments } : r))
                    )
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Modal Dialog for Creating / Editing Benchmark Routes */}
        <BenchmarkModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveRoute}
          initialData={editingRoute}
          isSubmitting={isSubmittingModal}
          serverErrors={serverErrors}
        />

        {/* ── FOOTER ────────────────────────────────────────────────── */}
        <footer className="mt-16 pt-8 border-t border-slate-200/80 text-center">
          <p className="text-xs text-slate-500 font-medium">
            TukTuk FairFare · Empowering tourists with transparent pricing in Sri Lanka.
            Fare rates are guidelines only and may vary slightly by region.
          </p>
        </footer>
      </div>
    </div>
  )
}

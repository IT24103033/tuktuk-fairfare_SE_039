import { useState, useEffect } from 'react'
import {
  Shield,
  MapPin,
  Info,
  Star,
  Search,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  DollarSign,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  X,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import FareCalculator from './FareCalculator'
import RouteCard from './RouteCard'
import './index.css'

// 12 Comprehensive Benchmark Routes across Sri Lanka
const DEFAULT_BENCHMARK_ROUTES = [
  {
    id: 1,
    route: 'Colombo Airport (BIA) to Colombo Fort',
    origin: 'Colombo Airport (BIA)',
    destination: 'Colombo Fort',
    region: 'Colombo',
    distanceKm: 32,
    estimatedDayFareLkr: 2900,
    travelTimeMin: 45,
    scamAlert: 'Watch out for flat rates over LKR 4,500. Insist on meter or negotiate before entering.',
    sinhalaTip: 'Meter eka danna puluwanda? (Can you put the meter?)',
  },
  {
    id: 2,
    route: 'Colombo Fort to Galle Face Green',
    origin: 'Colombo Fort',
    destination: 'Galle Face Green',
    region: 'Colombo',
    distanceKm: 2.5,
    estimatedDayFareLkr: 245,
    travelTimeMin: 10,
    scamAlert: 'Heavy tourist spot. Drivers often ask LKR 700+. Walkable or maximum LKR 300.',
    sinhalaTip: 'Galle Face ekata LKR 250k dhennam (I will pay LKR 250 for Galle Face)',
  },
  {
    id: 3,
    route: 'Colombo Fort to Pettah Floating Market',
    origin: 'Colombo Fort',
    destination: 'Pettah Floating Market',
    region: 'Colombo',
    distanceKm: 1.2,
    estimatedDayFareLkr: 128,
    travelTimeMin: 5,
    scamAlert: 'Extremely short ride. Refuse quotes above LKR 200.',
    sinhalaTip: 'Pettah ekata meter ekata yamu (Let us go to Pettah on meter)',
  },
  {
    id: 4,
    route: 'Negombo Beach Road to Bandaranaike Airport (BIA)',
    origin: 'Negombo Beach Road',
    destination: 'Bandaranaike Airport (BIA)',
    region: 'Colombo',
    distanceKm: 11.0,
    estimatedDayFareLkr: 1010,
    travelTimeMin: 25,
    scamAlert: 'Airport departure rush scam. High demand so pre-arrange or settle near LKR 1,100.',
    sinhalaTip: 'Airport ekata kelinma yanna (Go straight to the Airport)',
  },
  {
    id: 5,
    route: 'Kandy Railway Station to Temple of the Tooth',
    origin: 'Kandy Railway Station',
    destination: 'Temple of the Tooth',
    region: 'Kandy & Hills',
    distanceKm: 1.5,
    estimatedDayFareLkr: 155,
    travelTimeMin: 7,
    scamAlert: 'Walkable route. If riding, do not pay over LKR 200–250.',
    sinhalaTip: 'Dalada Maligawata LKR 200k hari (LKR 200 to Temple is fair)',
  },
  {
    id: 6,
    route: 'Kandy City Centre to Peradeniya Botanical Gardens',
    origin: 'Kandy City Centre',
    destination: 'Peradeniya Botanical Gardens',
    region: 'Kandy & Hills',
    distanceKm: 6.0,
    estimatedDayFareLkr: 560,
    travelTimeMin: 20,
    scamAlert: 'Popular tourist trip. Do not fall for drivers offering detour spice gardens.',
    sinhalaTip: 'Peradeniya mal wattata kelinma yanna (Go directly to Peradeniya Gardens)',
  },
  {
    id: 7,
    route: 'Ella Town to Nine Arch Bridge',
    origin: 'Ella Town',
    destination: 'Nine Arch Bridge',
    region: 'Kandy & Hills',
    distanceKm: 2.5,
    estimatedDayFareLkr: 245,
    travelTimeMin: 12,
    scamAlert: 'Station drivers quote LKR 800–1000. Agree strictly around LKR 300–400 for hilly terrain.',
    sinhalaTip: 'Nine Arch Bridge ekata gaana keeyada? (How much to Nine Arch Bridge?)',
  },
  {
    id: 8,
    route: 'Ella Town to Little Adam\'s Peak',
    origin: 'Ella Town',
    destination: 'Little Adam\'s Peak',
    region: 'Kandy & Hills',
    distanceKm: 3.0,
    estimatedDayFareLkr: 290,
    travelTimeMin: 15,
    scamAlert: 'Often inflated for foreign backpackers. Fair price is under LKR 350.',
    sinhalaTip: 'Little Adam\'s Peak ekata LKR 300k dhennam',
  },
  {
    id: 9,
    route: 'Galle Fort to Unawatuna Beach',
    origin: 'Galle Fort',
    destination: 'Unawatuna Beach',
    region: 'Down South',
    distanceKm: 6.0,
    estimatedDayFareLkr: 560,
    travelTimeMin: 18,
    scamAlert: 'Famous route. Drivers regularly quote LKR 1200+. State LKR 600 confidently.',
    sinhalaTip: 'Unawatunata LKR 600k athi (LKR 600 is enough for Unawatuna)',
  },
  {
    id: 10,
    route: 'Mirissa Beach to Weligama Bay',
    origin: 'Mirissa Beach',
    destination: 'Weligama Bay',
    region: 'Down South',
    distanceKm: 4.5,
    estimatedDayFareLkr: 425,
    travelTimeMin: 15,
    scamAlert: 'Popular surfer corridor. Avoid night-time double charging beyond the 15% rate.',
    sinhalaTip: 'Weligamata LKR 450k hari neda? (LKR 450 to Weligama, right?)',
  },
  {
    id: 11,
    route: 'Galle Bus Stand to Galle Dutch Fort',
    origin: 'Galle Bus Stand',
    destination: 'Galle Dutch Fort',
    region: 'Down South',
    distanceKm: 1.0,
    estimatedDayFareLkr: 110,
    travelTimeMin: 4,
    scamAlert: 'Literally around the corner. Maximum fare is LKR 150.',
    sinhalaTip: 'Kotuwa athulatama yanna (Go inside the Fort)',
  },
  {
    id: 12,
    route: 'Sigiriya Rock to Dambulla Cave Temple',
    origin: 'Sigiriya Rock',
    destination: 'Dambulla Cave Temple',
    region: 'Cultural Triangle',
    distanceKm: 17.0,
    estimatedDayFareLkr: 1550,
    travelTimeMin: 30,
    scamAlert: 'Cross-town tourist journey. Drivers may quote LKR 3,500+. Fair range is LKR 1,600–1,900.',
    sinhalaTip: 'Dambulla pahanata LKR 1700k dhennam',
  },
]

const REGIONS = ['All', 'Colombo', 'Kandy & Hills', 'Down South', 'Cultural Triangle']

export default function App() {
  const [routes, setRoutes] = useState(DEFAULT_BENCHMARK_ROUTES)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [isLoading, setIsLoading] = useState(false)
  const [isBackendConnected, setIsBackendConnected] = useState(false)

  // Interactive Route Modal & Calculator Autofill state
  const [activeModalRoute, setActiveModalRoute] = useState(null)
  const [calculatorSelectedRoute, setCalculatorSelectedRoute] = useState(null)
  const [copiedTip, setCopiedTip] = useState(false)

  // Fetch benchmark routes from backend API with fallback
  const fetchBenchmarks = async (search = '') => {
    setIsLoading(true)
    try {
      const url = search.trim()
        ? `/api/benchmarks?search=${encodeURIComponent(search.trim())}`
        : '/api/benchmarks'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
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
              id: item.id || `route-${Math.random()}`,
              origin,
              destination,
              route: item.route,
              region: item.region || 'Sri Lanka',
              distanceKm: item.distanceKm,
              travelTimeMin: item.travelTimeMin || Math.round(item.distanceKm * 2.5),
              estimatedDayFareLkr: item.estimatedDayFareLkr || item.estimatedFare || 0,
              scamAlert: item.scamAlert,
              sinhalaTip: item.sinhalaTip,
            }
          })
          setRoutes(normalized)
          setIsBackendConnected(true)
          setIsLoading(false)
          return
        }
      }
    } catch {
      // Backend unavailable, fallback
    }

    // Client-side fallback filter
    setIsBackendConnected(false)
    if (search.trim()) {
      const q = search.toLowerCase()
      const filtered = DEFAULT_BENCHMARK_ROUTES.filter(
        (r) =>
          r.origin.toLowerCase().includes(q) ||
          r.destination.toLowerCase().includes(q) ||
          (r.route && r.route.toLowerCase().includes(q)) ||
          (r.region && r.region.toLowerCase().includes(q))
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

  // Filter routes by region tab
  const displayedRoutes = routes.filter((r) => {
    if (selectedRegion === 'All') return true
    return r.region === selectedRegion
  })

  // When a route card is clicked, show its interactive detail modal
  const handleRouteClick = (routeData) => {
    setActiveModalRoute(routeData)
  }

  // Use selected route in Fare Calculator and scroll smoothly
  const handleUseInCalculator = (routeData) => {
    setCalculatorSelectedRoute(routeData)
    setActiveModalRoute(null)
    const calcSection = document.getElementById('calc-heading')
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleCopyPhrase = (phrase) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(phrase)
      setCopiedTip(true)
      setTimeout(() => setCopiedTip(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ebf3fc] via-[#f1f6fd] to-[#e6effb] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Subtle gentle blue ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300/25 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-sky-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-indigo-200/25 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">

        {/* ── HEADER BANNER ─────────────────────────────────────────── */}
        <header className="mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            {/* Regulatory Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200/90 rounded-full shadow-xs">
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
                  : 'bg-white border-slate-200 text-slate-600'
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
            Click any benchmark route below to see driver negotiation phrases or calculate custom fares instantly.
          </p>

          {/* Stats row with subtle pop hover */}
          <div className="flex flex-wrap gap-3.5 mt-6">
            {[
              { icon: Shield, label: 'Official Rates', value: 'LKR 110 base / +90 per km', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: MapPin, label: 'Verified Routes', value: `${routes.length} Available`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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
          <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50/90 border border-blue-200 rounded-2xl max-w-2xl shadow-xs">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-950 font-medium leading-relaxed">
              These rates reflect regulated legal guidance for three-wheeler fares.
              Always agree on a price <em>before</em> entering. Click any route below to view local scam tips & negotiation scripts.
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
            <FareCalculator
              selectedRoute={calculatorSelectedRoute}
              onClearSelectedRoute={() => setCalculatorSelectedRoute(null)}
            />
          </div>
        </section>

        {/* ── BENCHMARK ROUTES DIRECTORY ────────────────────────────── */}
        <section aria-labelledby="routes-heading">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 id="routes-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Popular Tourist Routes
                </h2>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  {displayedRoutes.length} Routes
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Click any route card to view local scam warnings, driver phrases, or autofill into the calculator.
              </p>
            </div>

            {/* Live Search Input connected to GET /api/benchmarks?search= */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search any destination (e.g. Fort, Beach, Sigiriya)..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-xs font-medium"
              />
              {isLoading && (
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin" />
              )}
            </div>
          </div>

          {/* Region Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`btn-pop px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  selectedRegion === region
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 border-slate-200/90 hover:border-blue-300 hover:text-blue-700'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {displayedRoutes.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-600 font-medium">No benchmark routes match "{searchQuery}".</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedRegion('All')
                  fetchBenchmarks('')
                }}
                className="btn-pop mt-3.5 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200 hover:bg-blue-100 cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  origin={route.origin}
                  destination={route.destination}
                  route={route.route}
                  region={route.region}
                  distanceKm={route.distanceKm}
                  travelTimeMin={route.travelTimeMin}
                  estimatedDayFareLkr={route.estimatedDayFareLkr}
                  scamAlert={route.scamAlert}
                  sinhalaTip={route.sinhalaTip}
                  onClick={handleRouteClick}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────── */}
        <footer className="mt-16 pt-8 border-t border-slate-200/80 text-center">
          <p className="text-xs text-slate-500 font-medium">
            TukTuk FairFare · Empowering tourists with transparent pricing in Sri Lanka.
            Fare rates are guidelines only and may vary slightly by region.
          </p>
        </footer>
      </div>

      {/* ── INTERACTIVE ROUTE DETAIL MODAL (Opens on Card Click) ── */}
      {activeModalRoute && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveModalRoute(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setActiveModalRoute(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Region badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>{activeModalRoute.region || 'Sri Lanka'}</span>
            </div>

            {/* Route title */}
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              {activeModalRoute.route || `${activeModalRoute.origin} to ${activeModalRoute.destination}`}
            </h3>

            {/* Meta row */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-5">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                {activeModalRoute.distanceKm} km distance
              </span>
              {activeModalRoute.travelTimeMin && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  ~{activeModalRoute.travelTimeMin} minutes ride
                </span>
              )}
            </div>

            {/* Price breakdown cards */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 mb-1">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-600">Day Rate (Regulated)</span>
                </div>
                <p className="text-2xl font-black text-slate-900">
                  LKR {activeModalRoute.dayFare?.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">5:00 AM – 10:00 PM</p>
              </div>

              <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-700">Night Rate (+15%)</span>
                </div>
                <p className="text-2xl font-black text-indigo-950">
                  LKR {activeModalRoute.nightFare?.toLocaleString()}
                </p>
                <p className="text-[11px] text-indigo-400 mt-0.5">10:00 PM – 5:00 AM</p>
              </div>
            </div>

            {/* Scam Alert warning */}
            {activeModalRoute.scamAlert && (
              <div className="p-4 bg-amber-50/90 border border-amber-200/90 rounded-2xl mb-4">
                <div className="flex items-center gap-2 mb-1.5 text-amber-900 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Local Scam Warning:</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  {activeModalRoute.scamAlert}
                </p>
              </div>
            )}

            {/* Sinhala Negotiation Phrase */}
            {activeModalRoute.sinhalaTip && (
              <div className="p-4 bg-blue-50/80 border border-blue-200/80 rounded-2xl mb-6">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-blue-900">Driver Negotiation Phrase (Sinhala):</span>
                  <button
                    type="button"
                    onClick={() => handleCopyPhrase(activeModalRoute.sinhalaTip)}
                    className="btn-pop inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-700 text-[11px] font-bold rounded-lg border border-blue-200 shadow-xs cursor-pointer hover:bg-blue-50"
                  >
                    {copiedTip ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Phrase
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs font-semibold text-blue-950 italic">
                  "{activeModalRoute.sinhalaTip}"
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleUseInCalculator(activeModalRoute)}
                className="btn-pop flex-1 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Autofill in Fare Calculator
              </button>
              <button
                type="button"
                onClick={() => setActiveModalRoute(null)}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

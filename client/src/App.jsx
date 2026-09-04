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
  ShieldAlert,
  HelpCircle,
  Car,
  CheckCircle2,
  Navigation2,
  Compass,
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

const TUKTUK_RULES = [
  {
    title: 'Ask for the Meter First',
    desc: 'In Colombo & Kandy, look for "METERED TAXI" roofs. Politely ask "Meter daanawada?" before sitting.',
    badge: 'Best Practice',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Pre-agree on Unmetered Rides',
    desc: 'In down south beaches and hill country, tuk-tuks rarely have meters. Always state your FairFare rate before boarding.',
    badge: 'Essential',
    icon: DollarSign,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Decline "Closed Today" Detours',
    desc: 'Never accept claims that your temple or attraction is closed. It is a common trick to steer you to commission shops.',
    badge: 'Scam Alert',
    icon: ShieldAlert,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

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
    const calcSection = document.getElementById('calc-section')
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
    <div className="min-h-screen bg-gradient-to-b from-[#ebf3fc] via-[#f2f7fd] to-[#e7effb] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Subtle gentle blue ambient blooms */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-sky-300/25 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
      </div>

      {/* ── TOP PROFESSIONAL NAVIGATION BAR ───────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Navigation2 className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">TukTuk</span>
                <span className="text-base sm:text-lg font-black gradient-text">FairFare</span>
                <span className="text-xs">🇱🇰</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:block">Sri Lanka Tourist Rate Verifier</p>
            </div>
          </div>

          {/* Quick Nav Anchors */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#calc-section" className="hover:text-blue-600 transition">Fare Estimator</a>
            <a href="#routes-section" className="hover:text-blue-600 transition">Benchmark Routes ({routes.length})</a>
            <a href="#rules-section" className="hover:text-blue-600 transition">Tourist Safety Guide</a>
          </div>

          {/* Connectivity & Tariff Badge */}
          <div className="flex items-center gap-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs transition-colors ${
                isBackendConnected
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {isBackendConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Live API</span>
                  <span className="sm:hidden">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Offline</span>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT CONTAINER ─────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* ── HERO & CALCULATOR SPLIT SECTION ───────────────────────── */}
        <section id="calc-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          
          {/* Left Column: Problem & Guidance */}
          <div className="lg:col-span-6 space-y-6 pt-2">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200/90 rounded-full shadow-xs">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold text-blue-800 tracking-wide uppercase">
                Official Gazette Tariff · 2024–2026
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Know the <span className="gradient-text">Fair Tuk-Tuk Price</span> Before You Ride.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Most three-wheelers in Sri Lanka do not use digital meters. Foreign travellers are routinely quoted{' '}
              <strong className="text-red-600 font-bold">2x to 5x the legal local rate</strong> in busy hubs like Colombo, Kandy, Galle, and Ella.
            </p>

            {/* How it Works 3-Step Pill Flow (Modern UX) */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2.5">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                How to avoid getting overcharged:
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-base font-black text-blue-600">1</span>
                  <p className="text-[11px] font-bold text-slate-800 mt-0.5 leading-tight">Pick Distance</p>
                  <p className="text-[10px] text-slate-400">or click a route</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-base font-black text-blue-600">2</span>
                  <p className="text-[11px] font-bold text-slate-800 mt-0.5 leading-tight">Get Legal Rate</p>
                  <p className="text-[10px] text-slate-400">LKR 110 + 90/km</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-base font-black text-blue-600">3</span>
                  <p className="text-[11px] font-bold text-slate-800 mt-0.5 leading-tight">Show Driver</p>
                  <p className="text-[10px] text-slate-400">or use Sinhala tip</p>
                </div>
              </div>
            </div>

            {/* Official Rates Summary Strip */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Day Rate Tariff</span>
                </div>
                <p className="text-base font-black text-slate-900">LKR 110 + 90/km</p>
                <p className="text-[11px] text-slate-400">5:00 AM – 10:00 PM</p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 mb-1">
                  <Star className="w-4 h-4 text-indigo-600" />
                  <span>Night Tariff</span>
                </div>
                <p className="text-base font-black text-indigo-950">+15% Surcharge</p>
                <p className="text-[11px] text-slate-400">10:00 PM – 5:00 AM</p>
              </div>
            </div>
          </div>

          {/* Right Column: Fare Calculator Widget */}
          <div className="lg:col-span-6">
            <FareCalculator
              selectedRoute={calculatorSelectedRoute}
              onClearSelectedRoute={() => setCalculatorSelectedRoute(null)}
            />
          </div>
        </section>

        {/* ── 3 GOLDEN RULES FOR TUK-TUKS SECTION ───────────────────── */}
        <section id="rules-section" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              3 Golden Rules for Riding Tuk-Tuks
            </h2>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TUKTUK_RULES.map((rule) => {
              const Icon = rule.icon
              return (
                <div
                  key={rule.title}
                  className="card-pop bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl ${rule.bg} ${rule.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {rule.badge}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                      {rule.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {rule.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── POPULAR BENCHMARK ROUTES DIRECTORY ────────────────────── */}
        <section id="routes-section" className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Popular Tourist Routes Directory
                </h2>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  {displayedRoutes.length} of {routes.length}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verified travel price bands. Click any route card to see Sinhala negotiation phrases or autofill the calculator.
              </p>
            </div>

            {/* Live Search Input connected to GET /api/benchmarks?search= */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search destination (Fort, Beach, Ella)..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-xs font-semibold"
              />
              {isLoading && (
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin" />
              )}
            </div>
          </div>

          {/* Region Filter Buttons */}
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
                Reset Search
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
        <footer className="pt-8 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700">
            TukTuk FairFare · Sri Lanka Tourist Fare Verifier & Protection Guide
          </p>
          <p>
            Based on provincial regulatory gazette guidelines (LKR 110 base / +90 per km). 
            Always confirm destination and meter availability before starting your trip.
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
              <Compass className="w-3.5 h-3.5 text-blue-600" />
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

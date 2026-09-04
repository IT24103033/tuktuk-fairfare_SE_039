import { useState, useEffect } from 'react'
import {
  MapPin,
  AlertTriangle,
  Navigation,
  TrendingUp,
  Clock,
  Sparkles,
  X,
  Plus,
  Minus,
  Copy,
  Check,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react'

// Fare calculation logic
const calculateFare = (distanceKm, isNight) => {
  if (!distanceKm || distanceKm <= 0) return null
  let fare = 110 // First 1 km base rate
  if (distanceKm > 1) {
    fare += (distanceKm - 1) * 90
  }
  if (isNight) {
    fare = fare * 1.15 // 15% night surcharge
  }
  return Math.ceil(fare)
}

// Popular distance quick-presets for quick exploration
const DISTANCE_PRESETS = [
  { label: '1 km', desc: 'Short Hop', value: 1.0 },
  { label: '2.5 km', desc: 'City Center', value: 2.5 },
  { label: '5 km', desc: 'Cross Town', value: 5.0 },
  { label: '10 km', desc: 'Suburban', value: 10.0 },
  { label: '32 km', desc: 'Airport', value: 32.0 },
]

export default function FareCalculator({ selectedRoute, onClearSelectedRoute }) {
  const [distance, setDistance] = useState('3.5')
  const [isNight, setIsNight] = useState(false)
  const [error, setError] = useState('')
  const [fare, setFare] = useState(335)
  const [hasCalculated, setHasCalculated] = useState(true)
  const [activeRouteName, setActiveRouteName] = useState('')
  const [copiedFare, setCopiedFare] = useState(false)

  // When an external route card is selected, populate and auto-calculate
  useEffect(() => {
    if (selectedRoute && selectedRoute.distanceKm) {
      const dist = selectedRoute.distanceKm.toString()
      setDistance(dist)
      setActiveRouteName(selectedRoute.route || `${selectedRoute.origin} to ${selectedRoute.destination}`)
      setError('')
      const result = calculateFare(parseFloat(dist), isNight)
      setFare(result)
      setHasCalculated(true)
    }
  }, [selectedRoute, isNight])

  const validate = (value) => {
    if (value === '' || value === null) {
      setError('Please enter a distance to calculate your fare.')
      return false
    }
    const num = parseFloat(value)
    if (isNaN(num)) {
      setError('Please enter a valid numeric distance.')
      return false
    }
    if (num < 0) {
      setError('Distance cannot be negative — enter a positive value.')
      return false
    }
    if (num < 0.1) {
      setError('Minimum distance is 0.1 km. Please enter a larger value.')
      return false
    }
    if (num > 500) {
      setError('Distance too high! Please enter a trip distance under 500 km.')
      return false
    }
    setError('')
    return true
  }

  const handleDistanceChange = (e) => {
    const val = e.target.value
    if (val.includes('-')) return
    setDistance(val)
    if (val !== '') {
      if (validate(val)) {
        const result = calculateFare(parseFloat(val), isNight)
        setFare(result)
        setHasCalculated(true)
      }
    } else {
      setError('')
      setFare(null)
      setHasCalculated(false)
    }
  }

  const handlePresetClick = (presetVal) => {
    const strVal = presetVal.toString()
    setDistance(strVal)
    setError('')
    setActiveRouteName('')
    if (onClearSelectedRoute) onClearSelectedRoute()
    const result = calculateFare(presetVal, isNight)
    setFare(result)
    setHasCalculated(true)
  }

  const handleStepDistance = (delta) => {
    const current = parseFloat(distance) || 0
    const updated = Math.max(0.5, Math.round((current + delta) * 10) / 10)
    setDistance(updated.toString())
    setError('')
    const result = calculateFare(updated, isNight)
    setFare(result)
    setHasCalculated(true)
  }

  const handleCalculate = async () => {
    if (!validate(distance)) return
    const numDistance = parseFloat(distance)
    const result = calculateFare(numDistance, isNight)
    setFare(result)
    setHasCalculated(true)

    // Optional backend sync
    try {
      await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          distanceKm: numDistance,
          isNightTime: isNight,
        }),
      })
    } catch {
      // Offline fallback
    }
  }

  const handleCopyFareForDriver = () => {
    if (fare && distance) {
      const text = `TukTuk FairFare Rate: LKR ${fare.toLocaleString()} (${distance} km, ${isNight ? 'Night Rate' : 'Standard Meter'})`
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text)
        setCopiedFare(true)
        setTimeout(() => setCopiedFare(false), 2000)
      }
    }
  }

  const parsedDist = parseFloat(distance)
  const isValidNum = !isNaN(parsedDist) && parsedDist >= 0.1
  const baseDayFare = isValidNum ? calculateFare(parsedDist, false) : null
  const extraKm = isValidNum && parsedDist > 1 ? (parsedDist - 1).toFixed(1) : 0
  const extraKmCost = isValidNum && parsedDist > 1 ? Math.round((parsedDist - 1) * 90) : 0
  const nightSurchargeAmount = fare && isNight ? Math.ceil(fare - (fare / 1.15)) : 0

  return (
    <div className="relative">
      {/* Crisp, clean elevated white card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-blue-900/5 p-6 sm:p-8 transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">Fare Estimator</h2>
              <p className="text-xs text-slate-500">Government Gazetted Formula</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Regulated</span>
          </div>
        </div>

        <div className="space-y-5">
          {/* Active Selected Route Banner */}
          {activeRouteName && (
            <div className="flex items-center justify-between gap-2 p-3 bg-blue-50/90 border border-blue-200/80 rounded-2xl animate-fade-in shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Selected Route Autofilled</p>
                  <p className="text-xs font-bold text-blue-950 truncate">{activeRouteName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveRouteName('')
                  if (onClearSelectedRoute) onClearSelectedRoute()
                }}
                className="p-1.5 text-blue-400 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                title="Clear selected route"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Distance Input with Quick Stepper Controls */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="distance-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Trip Distance
              </label>
              <span className="text-xs font-medium text-slate-400">Min 0.1 km</span>
            </div>

            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <input
                id="distance-input"
                type="number"
                min="0.1"
                step="0.1"
                value={distance}
                onChange={handleDistanceChange}
                placeholder="e.g. 3.5"
                className={`
                  w-full pl-10 pr-24 py-3.5 rounded-2xl text-slate-900 placeholder-slate-400 text-base font-bold
                  bg-slate-50/80 border transition-all duration-200 outline-none
                  ${error
                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/30'
                    : 'border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100'
                  }
                `}
              />
              {/* Stepper Buttons for convenient tapping */}
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleStepDistance(-0.5)}
                  className="w-7 h-7 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg flex items-center justify-center text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                  title="Decrease 0.5 km"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleStepDistance(0.5)}
                  className="w-7 h-7 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg flex items-center justify-center text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                  title="Increase 0.5 km"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-slate-400 font-bold ml-1 mr-1.5 uppercase">km</span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2.5 mt-2.5 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700 font-medium leading-relaxed">{error}</p>
              </div>
            )}

            {/* Quick Distance Presets Chips (Like modern travel apps) */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick pick:</span>
              {DISTANCE_PRESETS.map((p) => {
                const isActive = distance === p.value.toString()
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handlePresetClick(p.value)}
                    className={`btn-pop px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:border-blue-300 hover:text-blue-700'
                    }`}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Night Journey Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl transition ${isNight ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'}`}>
                {isNight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Night Tariff (10 PM – 5 AM)</p>
                <p className="text-xs text-slate-500 mt-0.5">Applies gazetted +15% night surcharge</p>
              </div>
            </div>
            <label className="toggle-switch flex-shrink-0 cursor-pointer" htmlFor="night-toggle">
              <input
                id="night-toggle"
                type="checkbox"
                checked={isNight}
                onChange={(e) => {
                  const val = e.target.checked
                  setIsNight(val)
                  if (isValidNum) {
                    setFare(calculateFare(parsedDist, val))
                  }
                }}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Calculate Button with pop hover effect */}
          <button
            id="calculate-fare-btn"
            type="button"
            onClick={handleCalculate}
            className="
              btn-pop w-full py-4 px-6 rounded-2xl font-bold text-sm text-white
              bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700
              hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600
              shadow-lg shadow-blue-500/25
              cursor-pointer flex items-center justify-center gap-2
              border border-blue-500/20
            "
          >
            <TrendingUp className="w-4 h-4" />
            Update Calculation
          </button>

          {/* Professional Result & Receipt Breakdown Card */}
          {hasCalculated && fare && !error && (
            <div className="animate-fade-in relative overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-emerald-50/30 p-5 sm:p-6 shadow-md shadow-blue-900/5">
              <div className="relative">
                {/* Result header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest">
                    Recommended Legal Fare
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyFareForDriver}
                    className="btn-pop inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-xs cursor-pointer hover:bg-blue-50"
                    title="Copy fare statement to show to tuk-tuk driver"
                  >
                    {copiedFare ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy for Driver
                      </>
                    )}
                  </button>
                </div>

                {/* Primary Price Display */}
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    LKR {fare.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    ({parsedDist.toFixed(1)} km)
                  </span>
                </div>

                {/* Itemized Calculation Breakdown (receipt style) */}
                <div className="mt-4 pt-3.5 border-t border-blue-200/70 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>First 1.0 km (Gazetted base rate)</span>
                    <span className="font-bold text-slate-900">LKR 110</span>
                  </div>
                  {parsedDist > 1 && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Additional distance ({extraKm} km × LKR 90)</span>
                      <span className="font-bold text-slate-900">+ LKR {extraKmCost.toLocaleString()}</span>
                    </div>
                  )}
                  {isNight && (
                    <div className="flex items-center justify-between text-indigo-700 font-semibold">
                      <span>Night surcharge (+15% tariff)</span>
                      <span>+ LKR {nightSurchargeAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Tourist Advice Pill */}
                <div className="mt-4 flex items-start gap-2.5 p-3 bg-white/90 border border-emerald-200 rounded-xl shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    This is the regulated benchmark. If a driver demands 2x or 3x this amount, politely refuse or show them this screen.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import {
  MapPin,
  AlertTriangle,
  Navigation,
  TrendingUp,
  Clock,
  Sparkles,
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

export default function FareCalculator() {
  const [distance, setDistance] = useState('')
  const [isNight, setIsNight] = useState(false)
  const [error, setError] = useState('')
  const [fare, setFare] = useState(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  const validate = (value) => {
    if (value === '' || value === null) {
      setError('Please enter a distance to calculate your fare.')
      return false
    }
    const num = parseFloat(value)
    if (isNaN(num)) {
      setError('Oops! That doesn\'t look like a valid number.')
      return false
    }
    if (num < 0) {
      setError('Distance can\'t be negative — try a positive number!')
      return false
    }
    if (num < 0.1) {
      setError('Minimum distance is 0.1 km. Please enter a larger value.')
      return false
    }
    if (num > 500) {
      setError('That\'s quite far! Please enter a distance under 500 km.')
      return false
    }
    setError('')
    return true
  }

  const handleDistanceChange = (e) => {
    const val = e.target.value
    // Block negative sign directly from input
    if (val.includes('-')) return
    setDistance(val)
    setHasCalculated(false)
    setFare(null)
    if (val !== '') validate(val)
    else setError('')
  }

  const handleCalculate = async () => {
    if (!validate(distance)) return
    const numDistance = parseFloat(distance)
    const result = calculateFare(numDistance, isNight)
    setFare(result)
    setHasCalculated(true)

    // Also communicate with backend API (/api/calculate) when reachable
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
      // Silent fallback: client-side calculation remains active
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCalculate()
    // Block minus sign via keyboard
    if (e.key === '-') e.preventDefault()
  }

  const baseFare = distance && parseFloat(distance) >= 0.1
    ? calculateFare(parseFloat(distance), false)
    : null
  const nightSurcharge = fare && isNight ? Math.ceil(fare - (fare / 1.15)) : null

  return (
    <div className="relative">
      {/* Crisp, clean elevated white card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 transition-all">
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 flex items-center justify-center shadow-sm">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Fare Calculator</h2>
            <p className="text-xs text-slate-500 mt-0.5">Instant legal rate estimation</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Distance Input */}
          <div>
            <label
              htmlFor="distance-input"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Distance (km)
            </label>
            <div className="relative">
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
                onKeyDown={handleKeyDown}
                placeholder="e.g. 3.5"
                className={`
                  w-full pl-10 pr-14 py-3.5 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium
                  bg-slate-50/80 border transition-all duration-200 outline-none
                  ${error
                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/30'
                    : 'border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100'
                  }
                `}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-xs text-slate-400 font-semibold uppercase">km</span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2.5 mt-2.5 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700 font-medium leading-relaxed">{error}</p>
              </div>
            )}
          </div>

          {/* Night Journey Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100/80 text-indigo-700 rounded-xl">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Night Journey</p>
                <p className="text-xs text-slate-500 mt-0.5">10 PM – 5 AM · +15% surcharge</p>
              </div>
            </div>
            <label className="toggle-switch flex-shrink-0 cursor-pointer" htmlFor="night-toggle">
              <input
                id="night-toggle"
                type="checkbox"
                checked={isNight}
                onChange={(e) => {
                  setIsNight(e.target.checked)
                  setHasCalculated(false)
                  setFare(null)
                }}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Fare Breakdown Mini-Cards */}
          {baseFare && !error && distance && (
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                <p className="text-xs text-slate-500 font-medium mb-1">Base Rate</p>
                <p className="text-base font-bold text-slate-900">LKR 110</p>
                <p className="text-[11px] text-slate-400">First 1 km</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                <p className="text-xs text-slate-500 font-medium mb-1">Per Extra km</p>
                <p className="text-base font-bold text-slate-900">LKR 90</p>
                <p className="text-[11px] text-slate-400">Additional km</p>
              </div>
            </div>
          )}

          {/* Calculate Button with POP hover effect */}
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
            Calculate Fair Fare
          </button>

          {/* Result Card */}
          {hasCalculated && fare && !error && (
            <div className="animate-soft-pulse relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-emerald-50/30 p-6 shadow-md shadow-blue-100/40">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                    Estimated Fair Fare
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" /> Standard Rate
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-slate-900">
                    LKR {fare.toLocaleString()}
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-blue-200/60 pt-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Distance</span>
                    <span className="text-slate-800 font-bold">{parseFloat(distance).toFixed(1)} km</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Day fare</span>
                    <span className="text-slate-800 font-bold">LKR {baseFare?.toLocaleString()}</span>
                  </div>
                  {isNight && nightSurcharge && (
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-indigo-700">Night surcharge (+15%)</span>
                      <span className="text-indigo-700">+ LKR {nightSurcharge.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-start gap-2.5 p-3 bg-white/80 border border-emerald-200/80 rounded-xl shadow-xs">
                  <AlertTriangle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                    If a driver quotes significantly more than this, you are likely being overcharged.
                    Politely negotiate or find another tuk-tuk.
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

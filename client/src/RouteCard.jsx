import { MapPin, ArrowRight, AlertTriangle, Clock, DollarSign, ChevronRight, Compass } from 'lucide-react'

export default function RouteCard({
  origin,
  destination,
  route,
  distanceKm,
  estimatedDayFareLkr,
  estimatedFare,
  scamAlert,
  region,
  travelTimeMin,
  sinhalaTip,
  onClick,
}) {
  let displayOrigin = origin
  let displayDestination = destination

  if (!displayOrigin && route) {
    if (route.includes(' to ')) {
      const parts = route.split(' to ')
      displayOrigin = parts[0].trim()
      displayDestination = parts.slice(1).join(' to ').trim()
    } else {
      displayOrigin = route
      displayDestination = ''
    }
  }

  const dayFare = estimatedDayFareLkr ?? estimatedFare ?? 0
  const nightFare = Math.ceil(dayFare * 1.15)

  const handleCardClick = () => {
    if (onClick) {
      onClick({
        origin: displayOrigin,
        destination: displayDestination,
        route: route || `${displayOrigin} to ${displayDestination}`,
        distanceKm,
        dayFare,
        nightFare,
        scamAlert,
        region,
        travelTimeMin,
        sinhalaTip,
      })
    }
  }

  return (
    <article
      onClick={handleCardClick}
      className="card-pop relative h-full flex flex-col bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      {/* Top accent line with animated gradient shine */}
      <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 group-hover:h-2 transition-all duration-200" />

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Region & Time Badge row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100/80">
            <Compass className="w-3 h-3 text-blue-600" />
            {region || 'Sri Lanka'}
          </span>
          <div className="flex items-center gap-2">
            {travelTimeMin && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Clock className="w-3 h-3 text-slate-400" /> ~{travelTimeMin} min
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200">
              {distanceKm} km
            </span>
          </div>
        </div>

        {/* Transit Timeline View (Clean modern travel app style) */}
        <div className="relative pl-6 space-y-3 mb-5">
          {/* Connecting vertical line */}
          <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-dashed border-l-2 border-dashed border-slate-200" />

          {/* Departure Stop */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup</p>
            <p className="text-sm font-bold text-slate-900 leading-tight truncate">{displayOrigin}</p>
          </div>

          {/* Arrival Stop */}
          {displayDestination && (
            <div className="relative">
              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-100" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drop-off</p>
              <p className="text-sm font-bold text-slate-900 leading-tight truncate">{displayDestination}</p>
            </div>
          )}
        </div>

        {/* Pricing Banner */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 group-hover:bg-blue-50/30 group-hover:border-blue-200 transition mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Regulated Fair Fare</p>
            <p className="text-xl font-black text-slate-900 leading-tight">
              LKR {dayFare.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              Night +15%
            </span>
            <p className="text-xs font-bold text-slate-700 mt-0.5">
              LKR {nightFare.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Scam alert warning preview */}
        {scamAlert && (
          <div className="mt-auto mb-4 flex items-start gap-2 p-2.5 bg-amber-50/90 border border-amber-200/90 rounded-xl">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-amber-900 font-medium leading-tight line-clamp-2">{scamAlert}</p>
          </div>
        )}

        {/* Interactive Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
          <span>View Sinhala Guide & Calculate</span>
          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  )
}

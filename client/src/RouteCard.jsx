import { MapPin, ArrowRight, AlertTriangle, Clock, DollarSign, ChevronRight } from 'lucide-react'

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
      displayOrigin = parts[0]
      displayDestination = parts.slice(1).join(' to ')
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
      className="card-pop relative h-full flex flex-col bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 group-hover:h-1.5 transition-all duration-200" />

      <div className="flex flex-col flex-1 p-5">
        {/* Region & Time Badge row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
              {region || 'Sri Lanka'}
            </span>
            {travelTimeMin && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                <Clock className="w-3 h-3 text-slate-400" /> ~{travelTimeMin} mins
              </span>
            )}
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 border border-slate-200/80 rounded-full text-[11px] font-bold text-slate-700">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            {distanceKm} km
          </div>
        </div>

        {/* Route header */}
        <div className="flex items-center gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="text-sm font-bold text-slate-900 truncate">{displayOrigin}</span>
          </div>
          {displayDestination && (
            <>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-sm font-bold text-slate-900 truncate">{displayDestination}</span>
              </div>
            </>
          )}
        </div>

        {/* Fare grid */}
        <div className="grid grid-cols-2 gap-3 mb-3.5">
          {/* Day fare */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 group-hover:bg-blue-50/40 transition">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-slate-500">Day Rate</span>
            </div>
            <p className="text-base font-extrabold text-slate-900 leading-none">
              LKR {dayFare.toLocaleString()}
            </p>
          </div>

          {/* Night fare */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 group-hover:bg-indigo-50 transition">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-700">Night</span>
            </div>
            <p className="text-base font-extrabold text-indigo-950 leading-none">
              LKR {nightFare.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Scam alert preview */}
        {scamAlert && (
          <div className="mt-auto mb-3 flex items-start gap-2 p-2.5 bg-amber-50/90 border border-amber-200 rounded-xl">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-amber-900 font-medium leading-tight line-clamp-2">{scamAlert}</p>
          </div>
        )}

        {/* Interactive Click Prompt Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
          <span>View tips & calculate</span>
          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  )
}

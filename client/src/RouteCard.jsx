import { MapPin, ArrowRight, AlertTriangle, Clock, DollarSign, Edit3, Trash2 } from 'lucide-react'
import CommentSection from './CommentSection'

export default function RouteCard({
  id,
  origin,
  destination,
  route,
  distanceKm,
  estimatedDayFareLkr,
  estimatedFare,
  scamAlert,
  comments = [],
  onEdit,
  onDelete,
  onCommentAdded,
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

  return (
    <article className="card-pop relative h-full flex flex-col bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 group-hover:h-1.5 transition-all duration-200" />

      <div className="flex flex-col flex-1 p-5">
        {/* Route header with Edit and Delete buttons */}
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
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

          {/* Action buttons */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={onEdit}
                  title="Edit route"
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  title="Delete route"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Distance badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100/90 border border-slate-200/80 rounded-full w-fit mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span className="text-xs font-semibold text-slate-700">{distanceKm} km</span>
        </div>

        {/* Fare grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Day fare */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-slate-500">Day</span>
            </div>
            <p className="text-base font-extrabold text-slate-900 leading-none">
              LKR {dayFare.toLocaleString()}
            </p>
          </div>

          {/* Night fare */}
          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-700">Night</span>
            </div>
            <p className="text-base font-extrabold text-indigo-950 leading-none">
              LKR {nightFare.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Scam alert warning */}
        {scamAlert && (
          <div className="mt-auto flex items-start gap-2.5 p-3 bg-amber-50/90 border border-amber-200 rounded-xl shadow-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-900/95 font-medium leading-relaxed">{scamAlert}</p>
          </div>
        )}

        {/* Community Reports & Comments Section */}
        <CommentSection
          routeId={id}
          comments={comments}
          onCommentAdded={(updatedComments) => {
            if (onCommentAdded) onCommentAdded(id, updatedComments)
          }}
        />
      </div>
    </article>
  )
}


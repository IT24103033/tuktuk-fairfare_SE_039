import { useState, useEffect } from 'react'
import { X, PlusCircle, Edit3, AlertTriangle, RefreshCw } from 'lucide-react'

export default function BenchmarkModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
  serverErrors = null,
}) {
  const [formData, setFormData] = useState({
    route: '',
    distanceKm: '',
    estimatedFare: '',
    scamAlert: '',
  })
  const [clientErrors, setClientErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        route: initialData.route || `${initialData.origin || ''} to ${initialData.destination || ''}`.trim(),
        distanceKm: initialData.distanceKm !== undefined ? String(initialData.distanceKm) : '',
        estimatedFare: initialData.estimatedDayFareLkr !== undefined ? String(initialData.estimatedDayFareLkr) : '',
        scamAlert: initialData.scamAlert || '',
      })
    } else {
      setFormData({
        route: '',
        distanceKm: '',
        estimatedFare: '',
        scamAlert: '',
      })
    }
    setClientErrors({})
  }, [initialData, isOpen])

  if (!isOpen) return null

  const validate = () => {
    const errs = {}
    if (!formData.route.trim() || formData.route.trim().length < 3) {
      errs.route = 'Route name is required (min 3 chars, e.g. "Colombo Fort to Pettah")'
    }
    const distanceNum = parseFloat(formData.distanceKm)
    if (isNaN(distanceNum) || distanceNum <= 0) {
      errs.distanceKm = 'Distance must be a positive number greater than 0'
    }
    const fareNum = parseFloat(formData.estimatedFare)
    if (isNaN(fareNum) || fareNum < 0) {
      errs.estimatedFare = 'Estimated fare must be 0 or a positive number'
    }
    if (!formData.scamAlert.trim() || formData.scamAlert.trim().length < 5) {
      errs.scamAlert = 'Scam alert information is required (min 5 chars)'
    }
    setClientErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      route: formData.route.trim(),
      distanceKm: parseFloat(formData.distanceKm),
      estimatedFare: parseFloat(formData.estimatedFare),
      scamAlert: formData.scamAlert.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              {initialData ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {initialData ? 'Edit Benchmark Route' : 'Add New Benchmark Route'}
              </h3>
              <p className="text-xs text-slate-500">
                {initialData ? 'Update route fare and scam alert info' : 'Create a new verified tourist route benchmark'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server errors banner */}
        {serverErrors && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-700 font-medium leading-relaxed">
              {Array.isArray(serverErrors) ? (
                <ul className="list-disc pl-4 space-y-0.5">
                  {serverErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              ) : (
                <p>{serverErrors}</p>
              )}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Route Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Route Name (Origin to Destination)
            </label>
            <input
              type="text"
              value={formData.route}
              onChange={(e) => setFormData({ ...formData, route: e.target.value })}
              placeholder="e.g. Colombo Fort to Pettah Market"
              className={`w-full px-4 py-3 bg-slate-50 border ${
                clientErrors.route ? 'border-red-400 focus:ring-red-100 bg-red-50/20' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
              } rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:ring-4 transition`}
            />
            {clientErrors.route && <p className="text-xs text-red-600 mt-1 font-medium">{clientErrors.route}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Distance (km) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.distanceKm}
                onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
                placeholder="e.g. 3.2"
                className={`w-full px-4 py-3 bg-slate-50 border ${
                  clientErrors.distanceKm ? 'border-red-400 focus:ring-red-100 bg-red-50/20' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                } rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:ring-4 transition`}
              />
              {clientErrors.distanceKm && <p className="text-xs text-red-600 mt-1 font-medium">{clientErrors.distanceKm}</p>}
            </div>

            {/* Estimated Fare (LKR) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Est. Fare (LKR)
              </label>
              <input
                type="number"
                min="0"
                value={formData.estimatedFare}
                onChange={(e) => setFormData({ ...formData, estimatedFare: e.target.value })}
                placeholder="e.g. 350"
                className={`w-full px-4 py-3 bg-slate-50 border ${
                  clientErrors.estimatedFare ? 'border-red-400 focus:ring-red-100 bg-red-50/20' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                } rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:ring-4 transition`}
              />
              {clientErrors.estimatedFare && <p className="text-xs text-red-600 mt-1 font-medium">{clientErrors.estimatedFare}</p>}
            </div>
          </div>

          {/* Scam Alert */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Scam Alert & Negotiation Tip
            </label>
            <textarea
              rows="3"
              value={formData.scamAlert}
              onChange={(e) => setFormData({ ...formData, scamAlert: e.target.value })}
              placeholder="e.g. Drivers ask for LKR 800+. Insist on standard meter rate LKR 350."
              className={`w-full px-4 py-3 bg-slate-50 border ${
                clientErrors.scamAlert ? 'border-red-400 focus:ring-red-100 bg-red-50/20' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
              } rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:ring-4 transition resize-none`}
            />
            {clientErrors.scamAlert && <p className="text-xs text-red-600 mt-1 font-medium">{clientErrors.scamAlert}</p>}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2 disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{initialData ? 'Update Route' : 'Create Route'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

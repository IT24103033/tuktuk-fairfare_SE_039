import { useState } from 'react'
import { MessageSquare, Send, AlertTriangle, CheckCircle, Lightbulb, User, Clock, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { API_BASE_URL } from './apiConfig'

export default function CommentSection({ routeId, comments = [], onCommentAdded }) {
  const [isOpen, setIsOpen] = useState(false)
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [tag, setTag] = useState('scam')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!author.trim()) {
      setError('Please enter your name or nickname.')
      return
    }
    if (!text.trim() || text.trim().length < 3) {
      setError('Comment must be at least 3 characters long.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/benchmarks/${routeId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: author.trim(),
          text: text.trim(),
          tag,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setText('')
        setIsSubmitting(false)
        if (onCommentAdded && data.comments) {
          onCommentAdded(data.comments)
        }
        return
      } else {
        const errData = await response.json()
        setError(errData.error || 'Failed to submit report/comment.')
      }
    } catch {
      setError('Network error posting comment to backend API.')
    }
    setIsSubmitting(false)
  }

  const getTagBadge = (type) => {
    switch (type) {
      case 'scam':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            Scam Alert
          </span>
        )
      case 'fair':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Fair Price
          </span>
        )
      case 'tip':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Lightbulb className="w-3 h-3 text-blue-600" />
            Tip / Advice
          </span>
        )
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Just now'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    } catch {
      return 'Recently'
    }
  }

  return (
    <div className="mt-4 pt-3 border-t border-slate-100">
      {/* Toggle Drawer Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          <span>Community Reports & Tips</span>
          <span className="ml-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-extrabold text-[11px]">
            {comments.length}
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {/* Expanded Drawer Content */}
      {isOpen && (
        <div className="mt-3 space-y-4 animate-fade-in">
          {/* List of comments */}
          {comments.length === 0 ? (
            <div className="p-3.5 text-center bg-slate-50 rounded-xl border border-slate-200/60">
              <p className="text-xs text-slate-500 font-medium">
                No scam reports or comments yet. Be the first to share your experience!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {comments.map((c, i) => (
                <div
                  key={c._id || i}
                  className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/70 text-xs leading-relaxed"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{c.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTagBadge(c.tag)}
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {formatDate(c.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium">{c.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* New Comment Submission Form */}
          <form onSubmit={handleSubmit} className="p-3 bg-blue-50/40 rounded-2xl border border-blue-100 space-y-3">
            <p className="text-xs font-bold text-slate-800">Post a Report or Tip</p>

            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name / traveler type..."
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />

              {/* Tag selector */}
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition cursor-pointer"
              >
                <option value="scam">🚨 Scam Alert</option>
                <option value="fair">✅ Fair Price Paid</option>
                <option value="tip">💡 Helpful Tip</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Driver asked LKR 1000, paid LKR 400 on meter..."
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-pop px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1 flex-shrink-0 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3 h-3" /> Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

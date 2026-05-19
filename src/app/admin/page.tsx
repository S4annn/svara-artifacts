'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, MapPin, ScrollText, Trophy, HelpCircle } from 'lucide-react'

type Tab = 'rooms' | 'artifacts' | 'quizzes' | 'quests' | 'badges'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('artifacts')
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ users: 0, chats: 0, artifacts: 0 })
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAdmin()
    loadStats()
  }, [])

  useEffect(() => {
    loadTab()
  }, [tab])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') { router.push('/play'); return }
  }

  async function loadStats() {
    const [{ count: users }, { count: chats }, { count: artifacts }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('chats').select('*', { count: 'exact', head: true }),
      supabase.from('artifacts').select('*', { count: 'exact', head: true }),
    ])
    setStats({ users: users || 0, chats: chats || 0, artifacts: artifacts || 0 })
  }

  async function loadTab() {
    setLoading(true)
    const { data } = await supabase.from(tab === 'rooms' ? 'museum_rooms' : tab).select('*').order('order_index', { ascending: true })
    setItems((data as Record<string, unknown>[]) || [])
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus item ini?')) return
    const table = tab === 'rooms' ? 'museum_rooms' : tab
    await supabase.from(table).delete().eq('id', id)
    loadTab()
  }

  const tabs: { key: Tab; label: string; icon: typeof MapPin }[] = [
    { key: 'rooms', label: 'Rooms', icon: MapPin },
    { key: 'artifacts', label: 'Artifacts', icon: ScrollText },
    { key: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { key: 'quests', label: 'Quests', icon: Trophy },
    { key: 'badges', label: 'Badges', icon: Trophy },
  ]

  return (
    <div className="min-h-screen bg-[#071510] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#D4AF37]">Admin Panel</h1>
          <button onClick={() => router.push('/play')} className="text-sm text-[#B8AFA3] hover:text-[#D4AF37]">
            Kembali ke Game
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0D1F18] border border-[#D4AF37]/10 rounded-lg p-4">
            <p className="text-xs text-[#B8AFA3]">Total Users</p>
            <p className="text-2xl font-bold text-[#F8F1E7]">{stats.users}</p>
          </div>
          <div className="bg-[#0D1F18] border border-[#D4AF37]/10 rounded-lg p-4">
            <p className="text-xs text-[#B8AFA3]">Total Chats</p>
            <p className="text-2xl font-bold text-[#F8F1E7]">{stats.chats}</p>
          </div>
          <div className="bg-[#0D1F18] border border-[#D4AF37]/10 rounded-lg p-4">
            <p className="text-xs text-[#B8AFA3]">Total Artifacts</p>
            <p className="text-2xl font-bold text-[#F8F1E7]">{stats.artifacts}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                tab === t.key
                  ? 'bg-[#D4AF37] text-[#071510]'
                  : 'bg-[#0D1F18] text-[#B8AFA3] hover:text-[#F8F1E7]'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-[#0D1F18] border border-[#D4AF37]/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#F8F1E7] capitalize">{tab}</h2>
            <button className="flex items-center gap-1 bg-[#D4AF37] text-[#071510] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#e6c44a]">
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>

          {loading ? (
            <p className="text-[#B8AFA3] text-sm animate-pulse">Memuat...</p>
          ) : items.length === 0 ? (
            <p className="text-[#B8AFA3] text-sm">Belum ada data. Jalankan seed SQL terlebih dahulu.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id as string}
                  className="flex items-center justify-between bg-[#071510] border border-[#D4AF37]/5 rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[#F8F1E7]">
                      {String(item.name || item.title || item.question || 'Untitled')}
                    </p>
                    {'slug' in item && item.slug ? <p className="text-xs text-[#B8AFA3]">{String(item.slug)}</p> : null}
                    {'category' in item && item.category ? <p className="text-xs text-[#B8AFA3]">{String(item.category)}</p> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#D4AF37]/10">
                      <Edit className="w-3.5 h-3.5 text-[#B8AFA3]" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id as string)}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#6B1F1F]/20"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[#6B1F1F]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

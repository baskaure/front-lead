import { useEffect, useState } from 'react'
import api from '../api/client'
import { Users, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    smsSent: 0,
    whatsappSent: 0,
    avgQuality: 0,
    recentAlerts: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [leadsRes, reportsRes] = await Promise.all([
        api.get('/leads/stats/summary'),
        api.get('/reports?limit=5')
      ])
      
      setStats({
        totalLeads: leadsRes.data.total,
        smsSent: leadsRes.data.sms_sent,
        whatsappSent: leadsRes.data.whatsapp_sent,
        avgQuality: leadsRes.data.average_quality,
        recentAlerts: reportsRes.data.flatMap(r => r.alerts || [])
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalLeads}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">SMS Envoyés</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.smsSent}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">WhatsApp Envoyés</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.whatsappSent}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Qualité Moyenne</dt>
                  <dd className="text-lg font-medium text-gray-900">{(stats.avgQuality * 100).toFixed(1)}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {stats.recentAlerts.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Alertes récentes</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside">
                  {stats.recentAlerts.map((alert, idx) => (
                    <li key={idx}>{alert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


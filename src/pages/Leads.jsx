import { useEffect, useState } from 'react'
import api from '../api/client'
import { format } from 'date-fns'

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await api.get('/leads')
      setLeads(response.data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {leads.map((lead) => (
            <li key={lead.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {lead.name || 'Sans nom'}
                      </p>
                      <p className="text-sm text-gray-500">{lead.phone}</p>
                      {lead.email && (
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {lead.sms_sent && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        SMS
                      </span>
                    )}
                    {lead.whatsapp_sent && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        WhatsApp
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {format(new Date(lead.created_at), 'dd MMM yyyy HH:mm')}
                    </span>
                  </div>
                </div>
                {lead.message && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{lead.message}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


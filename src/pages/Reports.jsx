import { useEffect, useState } from 'react'
import api from '../api/client'
import { format } from 'date-fns'
import { AlertCircle } from 'lucide-react'

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports')
      setReports(response.data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateWeeklyReport = async () => {
    try {
      await api.post('/reports/weekly/all')
      alert('Génération des rapports hebdomadaires lancée')
      setTimeout(fetchReports, 2000)
    } catch (error) {
      console.error('Error generating reports:', error)
      alert('Erreur lors de la génération des rapports')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Rapports</h2>
        <button
          onClick={generateWeeklyReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Générer rapports hebdomadaires
        </button>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Rapport #{report.id}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(report.period_start), 'dd MMM yyyy')} -{' '}
                  {format(new Date(report.period_end), 'dd MMM yyyy')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{report.total_leads}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Budget Total</p>
                <p className="text-2xl font-bold text-gray-900">{report.total_budget.toFixed(2)} €</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Qualité Moyenne</p>
                <p className="text-2xl font-bold text-gray-900">{(report.average_quality * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Coût par Lead</p>
                <p className="text-2xl font-bold text-gray-900">{report.cost_per_lead.toFixed(2)} €</p>
              </div>
            </div>

            {report.alerts && report.alerts.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Alertes</h4>
                    <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                      {report.alerts.map((alert, idx) => (
                        <li key={idx}>{alert}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


import { useEffect, useState } from 'react'
import api from '../api/client'
import { format } from 'date-fns'

export default function Visuals() {
  const [visuals, setVisuals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', subtitle: '', description: '' })

  useEffect(() => {
    fetchVisuals()
  }, [])

  const fetchVisuals = async () => {
    try {
      const response = await api.get('/visuals')
      setVisuals(response.data)
    } catch (error) {
      console.error('Error fetching visuals:', error)
    } finally {
      setLoading(false)
    }
  }

  const createVisual = async (e) => {
    e.preventDefault()
    try {
      await api.post('/visuals', formData)
      setFormData({ title: '', subtitle: '', description: '' })
      setShowForm(false)
      fetchVisuals()
    } catch (error) {
      console.error('Error creating visual:', error)
      alert('Erreur lors de la création du visuel')
    }
  }

  const approveVisual = async (id) => {
    try {
      await api.post(`/visuals/${id}/approve`)
      fetchVisuals()
    } catch (error) {
      console.error('Error approving visual:', error)
    }
  }

  const generateVisual = async (id) => {
    try {
      await api.post(`/visuals/${id}/generate`)
      alert('Génération du visuel en cours...')
      fetchVisuals()
    } catch (error) {
      console.error('Error generating visual:', error)
      alert('Erreur lors de la génération du visuel')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Générateur de Visuels</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Annuler' : 'Nouveau Visuel'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <form onSubmit={createVisual}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sous-titre
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Créer le visuel
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visuals.map((visual) => (
          <div key={visual.id} className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{visual.title}</h3>
              {visual.subtitle && (
                <p className="text-sm text-gray-600 mt-1">{visual.subtitle}</p>
              )}
              {visual.description && (
                <p className="text-sm text-gray-500 mt-2">{visual.description}</p>
              )}
            </div>

            <div className="mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                visual.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                visual.status === 'approved' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {visual.status === 'draft' ? 'Brouillon' :
                 visual.status === 'approved' ? 'Approuvé' : 'Généré'}
              </span>
            </div>

            {visual.image_path && (
              <div className="mb-4">
                <img src={`/api${visual.image_path}`} alt={visual.title} className="w-full rounded" />
              </div>
            )}

            <div className="flex space-x-2">
              {visual.status === 'draft' && (
                <button
                  onClick={() => approveVisual(visual.id)}
                  className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 text-sm"
                >
                  Approuver
                </button>
              )}
              {visual.status === 'approved' && (
                <button
                  onClick={() => generateVisual(visual.id)}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 text-sm"
                >
                  Générer
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-4">
              {format(new Date(visual.created_at), 'dd MMM yyyy')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}


import { useEffect, useState } from 'react'
import api from '../api/client'
import { Plus, Trash2 } from 'lucide-react'

export default function Boussole() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    color: '#3B82F6'
  })
  const [draggedItem, setDraggedItem] = useState(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await api.get('/boussole')
      setItems(response.data)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const createItem = async (e) => {
    e.preventDefault()
    try {
      const newItem = {
        ...formData,
        position_x: Math.random() * 600 + 50,
        position_y: Math.random() * 400 + 50
      }
      await api.post('/boussole', newItem)
      setFormData({ title: '', description: '', category: '', color: '#3B82F6' })
      setShowForm(false)
      fetchItems()
    } catch (error) {
      console.error('Error creating item:', error)
      alert('Erreur lors de la création de l\'élément')
    }
  }

  const deleteItem = async (id) => {
    if (!confirm('Supprimer cet élément ?')) return
    try {
      await api.delete(`/boussole/${id}`)
      fetchItems()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const updatePosition = async (id, x, y) => {
    try {
      await api.patch(`/boussole/${id}`, { position_x: x, position_y: y })
    } catch (error) {
      console.error('Error updating position:', error)
    }
  }

  const handleDragStart = (e, item) => {
    setDraggedItem(item)
  }

  const handleDragEnd = (e, item) => {
    const rect = e.currentTarget.parentElement.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    updatePosition(item.id, x, y)
    setDraggedItem(null)
    fetchItems()
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Boussole</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Annuler' : 'Nouvel Élément'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <form onSubmit={createItem}>
            <div className="grid grid-cols-2 gap-4">
              <div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-4">
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
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="h-10 w-20 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Créer
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="relative h-[600px] border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          {items.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={(e) => handleDragEnd(e, item)}
              style={{
                position: 'absolute',
                left: `${item.position_x}px`,
                top: `${item.position_y}px`,
                backgroundColor: item.color,
                width: `${item.size}px`,
                height: `${item.size}px`,
                borderRadius: '8px',
                padding: '12px',
                cursor: 'move',
                color: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
              className="flex flex-col justify-between"
            >
              <div>
                <h4 className="font-semibold text-sm">{item.title}</h4>
                {item.description && (
                  <p className="text-xs mt-1 opacity-90">{item.description}</p>
                )}
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="mt-2 text-white hover:text-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


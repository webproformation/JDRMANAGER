import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Search, Award } from 'lucide-react';

export default function FeatsPage() {
  const [feats, setFeats] = useState([]);
  const [worlds, setWorlds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFeat, setEditingFeat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    world_id: '',
    description: '',
    prerequisite: '',
    benefits: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featsData, worldsData] = await Promise.all([
        supabase.from('feats').select(`
          *,
          worlds ( name )
        `).order('name'),
        supabase.from('worlds').select('id, name').order('name')
      ]);

      if (featsData.error) throw featsData.error;
      if (worldsData.error) throw worldsData.error;

      setFeats(featsData.data || []);
      setWorlds(worldsData.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (feat = null) => {
    if (feat) {
      setEditingFeat(feat);
      setFormData({
        name: feat.name || '',
        world_id: feat.world_id || '',
        description: feat.description || '',
        prerequisite: feat.prerequisite || '',
        benefits: feat.benefits || '',
        notes: feat.notes || ''
      });
    } else {
      setEditingFeat(null);
      setFormData({
        name: '',
        world_id: worlds.length > 0 ? worlds[0].id : '',
        description: '',
        prerequisite: '',
        benefits: '',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFeat(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      const payload = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      if (editingFeat) {
        const { error } = await supabase
          .from('feats')
          .update(payload)
          .eq('id', editingFeat.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('feats')
          .insert([{ 
            ...payload, 
            created_by: user?.id,
            created_at: new Date().toISOString()
          }]);
        if (error) throw error;
      }

      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Une erreur est survenue lors de la sauvegarde.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce don ?')) {
      try {
        const { error } = await supabase
          .from('feats')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        await fetchData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Une erreur est survenue lors de la suppression.');
      }
    }
  };

  const filteredFeats = feats.filter(feat =>
    feat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (feat.description && feat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-cyan-light mb-2 flex items-center gap-3">
            <Award size={40} />
            Dons (Feats)
          </h1>
          <p className="text-silver">Gérez les dons et capacités spéciales de votre univers</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-cyan-light text-night px-6 py-3 rounded-lg font-bold hover:bg-soft-white transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Nouveau Don
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver" size={20} />
        <input
          type="text"
          placeholder="Rechercher un don..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-night bg-opacity-50 border border-arcane border-opacity-50 text-soft-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-light"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-light"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeats.map((feat) => (
            <div key={feat.id} className="bg-night bg-opacity-50 border border-arcane border-opacity-50 p-6 rounded-xl hover:border-cyan-light hover:border-opacity-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-soft-white">{feat.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(feat)} className="text-silver hover:text-cyan-light transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(feat.id)} className="text-silver hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-silver mb-2">
                <span className="font-semibold text-cyan-light">Monde:</span> {feat.worlds?.name || 'Générique'}
              </p>
              {feat.prerequisite && (
                <p className="text-sm text-silver mb-2">
                  <span className="font-semibold text-cyan-light">Prérequis:</span> {feat.prerequisite}
                </p>
              )}
              <p className="text-silver text-sm line-clamp-3 mb-4">{feat.description}</p>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-night border border-arcane rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-cyan-light mb-6">
              {editingFeat ? 'Modifier le Don' : 'Nouveau Don'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-silver mb-2">Nom du don</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-night border border-arcane rounded-lg px-4 py-2 text-soft-white focus:border-cyan-light focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-silver mb-2">Monde</label>
                  <select
                    required
                    value={formData.world_id}
                    onChange={(e) => setFormData({...formData, world_id: e.target.value})}
                    className="w-full bg-night border border-arcane rounded-lg px-4 py-2 text-soft-white focus:border-cyan-light focus:outline-none"
                  >
                    <option value="">Sélectionnez un monde</option>
                    {worlds.map(world => (
                      <option key={world.id} value={world.id}>{world.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-silver mb-2">Prérequis</label>
                <input
                  type="text"
                  placeholder="ex: Force 13, ou Maîtrise des armures lourdes"
                  value={formData.prerequisite}
                  onChange={(e) => setFormData({...formData, prerequisite: e.target.value})}
                  className="w-full bg-night border border-arcane rounded-lg px-4 py-2 text-soft-white focus:border-cyan-light focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-silver mb-2">Description</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-night border border-arcane rounded-lg px-4 py-2 text-soft-white focus:border-cyan-light focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-silver mb-2">Bénéfices (Règles)</label>
                <textarea
                  rows="4"
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  className="w-full bg-night border border-arcane rounded-lg px-4 py-2 text-soft-white focus:border-cyan-light focus:outline-none"
                  placeholder="Décrivez ici les mécaniques de jeu (ex: +1 en Force, avantage sur les jets de sauvegarde...)"
                />
              </div>

              <div>
                <label className="block text-silver mb-2">Notes pour le MJ</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-night border border-arcane rounded-lg px-4 py-2 text-soft-white focus:border-cyan-light focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-arcane text-silver rounded-lg hover:text-soft-white hover:border-soft-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-light text-night font-bold rounded-lg hover:bg-soft-white transition-colors"
                >
                  {editingFeat ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
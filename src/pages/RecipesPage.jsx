import { useState, useEffect } from 'react';
import { 
  BookOpen, Info, Hammer, ImageIcon, Shield, Zap, 
  Target, Clock, Sparkles, XCircle, CheckCircle, List, Scroll, Lock, Eye, EyeOff
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import CraftingEngineEditor from '../components/CraftingEngineEditor';
import VTTDialog from '../components/VTTDialog';
import { supabase } from '../lib/supabase';

const recipesConfig = {
  entityName: 'la recette',
  tableName: 'recipes',
  title: 'Recettes & Artisanat',
  getHeaderIcon: () => BookOpen,
  getHeaderColor: () => 'from-orange-600/30 via-amber-500/20 to-yellow-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Général',
      icon: Info,
      fields: [
        { name: 'name', label: 'Nom de la recette', type: 'text', required: true },
        { 
          name: 'subtitle', 
          label: 'Discipline', 
          type: 'select', 
          options: [
            { value: 'Alchimie', label: '🧪 Alchimie' },
            { value: 'Cuisine', label: '🍳 Cuisine' },
            { value: 'Forge', label: '⚒️ Forge' },
            { value: 'Enchantement', label: '✨ Enchantement' },
            { value: 'Autre', label: '📜 Autre' }
          ]
        },
        { name: 'world_id', label: 'Monde lié', type: 'relation', table: 'worlds' },
        { name: 'description', label: 'Description courte', type: 'textarea', rows: 3 },
        { name: 'image_url', label: 'Image principale', type: 'image' },
        { 
          name: 'rarity', 
          label: 'Rareté', 
          type: 'select', 
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' },
            { value: 'very_rare', label: 'Très rare' },
            { value: 'legendary', label: 'Légendaire' }
          ]
        },
        { name: 'skill_required', label: 'Compétence requise', type: 'text' },
        { name: 'value', label: 'Prix de vente estimé', type: 'text', placeholder: 'Ex: 150 po' },
        { 
          name: 'character_recipes', 
          label: 'Personnages connaissant ce secret', 
          type: 'relation-list', 
          table: 'characters' 
        }
      ]
    },
    {
      id: 'crafting',
      label: 'Fabrication',
      icon: Hammer,
      fields: [
        { 
          name: 'data', 
          label: 'Moteur de Fabrication', 
          type: 'custom', 
          component: CraftingEngineEditor,
          render: (val, item) => {
            const c = item.data?.crafting || {};
            const ingredients = Array.isArray(c.ingredients) ? c.ingredients : [];
            const steps = Array.isArray(c.steps) ? c.steps : [];
            const learnedByCount = item.character_recipes?.length || 0;
            const [showSecret, setShowSecret] = useState(false);

            return (
              <div className="relative">
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={() => setShowSecret(!showSecret)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-silver transition-all border border-white/5"
                  >
                    {showSecret ? <><EyeOff size={14}/> Mode Joueur</> : <><Eye size={14}/> Mode Maître de Jeu</>}
                  </button>
                </div>

                {!showSecret && learnedByCount === 0 && (
                  <div className="absolute inset-0 z-10 backdrop-blur-xl bg-[#0f111a]/80 rounded-[2rem] flex flex-col items-center justify-center border border-white/5 p-12 text-center animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-6 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                      <Lock size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">Savoir Perdu</h4>
                    <p className="text-silver/60 text-sm max-w-md leading-relaxed">
                      Aucun personnage de votre groupe ne semble avoir déchiffré cette recette. 
                      Apprenez-la via un grimoire ou un maître pour révéler ses secrets.
                    </p>
                  </div>
                )}

                <div className={`space-y-8 animate-in fade-in duration-500 ${(!showSecret && learnedByCount === 0) ? 'opacity-10 blur-sm pointer-events-none' : ''}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 flex items-center gap-4 shadow-lg">
                      <Target className="text-amber-400" size={24} />
                      <div>
                        <div className="text-[10px] font-black uppercase text-amber-400/60 tracking-widest">Difficulté</div>
                        <div className="text-lg font-black text-white">DD {c.base_dc || 10}</div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 flex items-center gap-4 shadow-lg">
                      <Scroll className="text-purple-400" size={24} />
                      <div>
                        <div className="text-[10px] font-black uppercase text-purple-400/60 tracking-widest">Compétence</div>
                        <div className="text-sm font-bold text-white truncate">{item.skill_required || 'Standard'}</div>
                      </div>
                    </div>

                    <div className="bg-teal-500/10 p-4 rounded-2xl border border-teal-500/20 flex items-center gap-4 shadow-lg">
                      <Hammer className="text-teal-400" size={24} />
                      <div>
                        <div className="text-[10px] font-black uppercase text-teal-400/60 tracking-widest">Outils</div>
                        <div className="text-sm font-bold text-white truncate">{c.tools || 'Basiques'}</div>
                      </div>
                    </div>
                  </div>

                  {ingredients.length > 0 && (
                    <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5 shadow-inner">
                      <div className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <List size={12}/> Ingrédients nécessaires
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ingredients.map((ing, i) => (
                          <div key={i} className="bg-[#151725] p-3 rounded-xl border border-white/5 flex items-center gap-3 group hover:border-amber-500/30 transition-colors">
                            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-amber-400 border border-white/10 group-hover:bg-amber-500/20">
                              {ing.quantity}x
                            </span>
                            <span className="text-sm text-silver font-bold group-hover:text-white transition-colors">{ing.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {steps.length > 0 && (
                    <div className="space-y-4">
                      <div className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-2">Processus de création</div>
                      <div className="space-y-3">
                        {steps.map((s, i) => (
                          <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex gap-5 hover:bg-white/[0.08] transition-all">
                             <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 text-sm font-black shrink-0 shadow-lg">
                               {i + 1}
                             </div>
                             <div className="flex-1 space-y-2">
                               <div className="text-white text-sm font-medium leading-relaxed">{s.description}</div>
                               <div className="flex gap-4">
                                 {s.duration && <span className="text-[9px] text-silver/40 flex items-center gap-1 uppercase font-black tracking-widest"><Clock size={12}/> {s.duration}</span>}
                                 {s.dc_modifier && <span className="text-[9px] text-amber-400/40 flex items-center gap-1 uppercase font-black tracking-widest"><Target size={12}/> Mod: {s.dc_modifier}</span>}
                               </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(c.critical_success || c.critical_failure) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-6">
                      {c.critical_success && (
                        <div className="bg-green-500/5 border border-green-500/10 p-5 rounded-[2rem] relative overflow-hidden group shadow-lg">
                          <CheckCircle size={60} className="absolute -right-4 -bottom-4 text-green-500/5 rotate-12 group-hover:scale-110 transition-transform" />
                          <div className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Sparkles size={14}/> Réussite Critique</div>
                          <p className="text-xs text-silver leading-relaxed italic">"{c.critical_success}"</p>
                        </div>
                      )}
                      {c.critical_failure && (
                        <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-[2rem] relative overflow-hidden group shadow-lg">
                          <XCircle size={60} className="absolute -right-4 -bottom-4 text-red-500/5 rotate-12 group-hover:scale-110 transition-transform" />
                          <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2"><XCircle size={14}/> Échec Critique</div>
                          <p className="text-xs text-silver leading-relaxed italic">"{c.critical_failure}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          }
        },
        { name: 'instructions', label: 'Instructions narratives (MJ)', type: 'textarea', rows: 4 }
      ]
    },
    {
      id: 'gallery',
      label: 'Galerie',
      icon: ImageIcon,
      fields: [
        { 
          name: 'recipe_images', 
          label: 'Images de la recette', 
          type: 'images', 
          bucket: 'images',
          categories: [
            { id: 'ingredients', label: 'Ingrédients' },
            { id: 'process', label: 'Processus' },
            { id: 'result', label: 'Résultat' }
          ]
        }
      ]
    },
    {
      id: 'gm',
      label: 'Zone MJ',
      icon: Shield,
      fields: [
        { name: 'notes', label: 'Notes secrètes du MJ', type: 'textarea', rows: 5 }
      ]
    }
  ]
};

export default function RecipesPage({ activeWorldId }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  const cleanURL = () => {
    const url = new URL(window.location);
    url.searchParams.delete('view'); 
    url.searchParams.delete('edit');
    window.history.replaceState({}, document.title, url.pathname);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewId = params.get('view');
    const editId = params.get('edit');

    if (viewId || editId) {
      const id = viewId || editId;
      const fetchInitialItem = async () => {
        const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single();
        if (data && !error) {
          if (viewId) setSelectedItem(data);
          else { setEditingItem(data); setShowForm(true); }
          cleanURL();
        }
      };
      fetchInitialItem();
    }
  }, []);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingItem(null);
    setSelectedItem(null);
    cleanURL();
  };

  const handleCreate = () => {
    // MÉMOIRE PRESTIGE V4.3 : Injection automatique du focus
    setEditingItem({ 
      world_id: activeWorldId !== 'all' ? activeWorldId : null
    });
    setShowForm(true);
  };

  const executeDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      await supabase.from('recipes').delete().eq('id', deleteConfirm.item.id);
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
      cleanURL();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <div className="pb-24 md:pb-0 h-full">
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Oublier la Recette"
        message={`Voulez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} des chroniques artisanales ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList 
        key={refreshKey} 
        tableName="recipes" 
        title="Recettes" 
        icon={BookOpen}
        onView={setSelectedItem} 
        onEdit={(i) => { setEditingItem(i); setShowForm(true); }}
        onCreate={handleCreate}
        onDelete={(item) => setDeleteConfirm({ isOpen: true, item })}
      />

      <EnhancedEntityDetail 
        isOpen={!!selectedItem} 
        onClose={() => { setSelectedItem(null); cleanURL(); }} 
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={() => setDeleteConfirm({ isOpen: true, item: selectedItem })}
        item={selectedItem} 
        config={recipesConfig}
      />

      <EnhancedEntityForm 
        isOpen={showForm} 
        onClose={() => { setShowForm(false); setEditingItem(null); cleanURL(); }} 
        onSuccess={handleSuccess} 
        item={editingItem} 
        config={recipesConfig}
      />
    </div>
  );
}
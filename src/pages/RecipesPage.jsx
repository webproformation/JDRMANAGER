import { useState } from 'react';
import { 
  BookOpen, Info, Hammer, ImageIcon, Shield, Zap, 
  Target, Clock, Sparkles, XCircle, CheckCircle, List, Scroll, Lock, Eye, EyeOff
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import CraftingEngineEditor from '../components/CraftingEngineEditor';
import { supabase } from '../lib/supabase';

const recipesConfig = {
  entityName: 'la recette',
  tableName: 'recipes',
  title: 'Recettes',
  getHeaderIcon: () => BookOpen,
  getHeaderColor: () => 'from-orange-600/30 via-amber-500/20 to-yellow-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Général',
      icon: Info,
      columns: 3,
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
        
        { name: 'description', label: 'Description courte', type: 'textarea', rows: 3, fullWidth: true },
        
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

        { name: 'value', label: 'Prix de vente', type: 'text', placeholder: 'Ex: 150 po' },
        // NOUVEAU : On gère qui connaît la recette via une relation-list
        { 
          name: 'character_recipes', 
          label: 'Apprise par les personnages', 
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
          label: 'Recette de Fabrication', 
          type: 'custom', 
          component: CraftingEngineEditor,
          render: (val, item) => {
            const c = item.data?.crafting || {};
            const ingredients = Array.isArray(c.ingredients) ? c.ingredients : [];
            const steps = Array.isArray(c.steps) ? c.steps : [];
            
            // LOGIQUE DE CONNAISSANCE : 
            // En mode MJ (détail complet), on peut voir. Sinon, on vérifie si des personnages la connaissent.
            const learnedByCount = item.character_recipes?.length || 0;
            const [showSecret, setShowSecret] = useState(false);

            return (
              <div className="relative">
                {/* Sélecteur de visibilité pour simuler le mode MJ ou Joueur */}
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={() => setShowSecret(!showSecret)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-silver transition-all border border-white/5"
                  >
                    {showSecret ? <><EyeOff size={14}/> Mode Joueur</> : <><Eye size={14}/> Mode Maître de Jeu</>}
                  </button>
                </div>

                {/* Voile de brouillard si personne ne connaît la recette et qu'on est pas en mode MJ */}
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
                  {/* DÉTAILS TECHNIQUES */}
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

                  {/* INGRÉDIENTS */}
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

                  {/* ÉTAPES */}
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

                  {/* CRITIQUES */}
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
        { name: 'instructions', label: 'Instructions narratives (MJ)', type: 'textarea', rows: 4, fullWidth: true }
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

export default function RecipesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList 
        key={refreshKey} 
        tableName="recipes" 
        title="Recettes" 
        onView={setSelectedItem} 
        onEdit={(i) => { setEditingItem(i); setShowForm(true); }}
        onCreate={() => { setEditingItem(null); setShowForm(true); }}
      />
      <EnhancedEntityDetail 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={async () => {
          if (!window.confirm('Supprimer cette recette ?')) return;
          await supabase.from('recipes').delete().eq('id', selectedItem.id);
          setSelectedItem(null); 
          setRefreshKey(p => p + 1);
        }}
        item={selectedItem} 
        config={recipesConfig}
      />
      <EnhancedEntityForm 
        isOpen={showForm} 
        onClose={() => { setShowForm(false); setEditingItem(null); }}
        onSuccess={() => { setRefreshKey(p => p + 1); setShowForm(false); }}
        item={editingItem} 
        config={recipesConfig}
      />
    </>
  );
}
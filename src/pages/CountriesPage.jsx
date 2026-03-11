import { useState, useEffect } from 'react';
import { Flag, Info, Map, Scale, DollarSign, Palette, BookOpen, ImageIcon, Shield, Landmark, Waves, Trash, ExternalLink } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import MultiRelationSelector from '../components/MultiRelationSelector';
import EntityChildCards from '../components/EntityChildCards';
import LanguageCheckboxSelector from '../components/LanguageCheckboxSelector'; 
import VTTDialog from '../components/VTTDialog'; // Import du dialogue Prestige
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

import CountryLayout from '../components/EnhancedEntityDetail/layouts/CountryLayout';
import CountryForm from '../components/EnhancedEntityForm/layouts/CountryForm';

// ============================================================================
// COMPOSANT OCÉANS : CARTES CLIQUABLES (Style "Villes & Lieux")
// ============================================================================
const OceanCardManager = ({ value, onChange, readOnly }) => {
  const [allOceans, setAllOceans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('oceans').select('id, name, type, image_url').then(({ data }) => {
      if (data) setAllOceans(data);
      setLoading(false);
    });
  }, []);

  const selectedIds = typeof value === 'string' ? value.split(',').filter(Boolean) : [];
  const selectedOceans = allOceans.filter(o => selectedIds.includes(o.id));

  if (loading) return <div className="text-cyan-500/50 text-[10px] uppercase animate-pulse">Chargement des cartes marines...</div>;

  return (
    <div className="space-y-6">
      {!readOnly && (
        <div className="bg-[#151725]/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
          <div className="flex-1">
            <select 
              className="w-full bg-[#1c1f33] border border-cyan-500/20 hover:border-cyan-500/50 rounded-xl p-3 text-white text-sm focus:border-cyan-400 outline-none transition-all"
              onChange={(e) => {
                const newId = e.target.value;
                if (newId && !selectedIds.includes(newId)) {
                  onChange([...selectedIds, newId].join(','));
                }
              }}
              value=""
            >
              <option value="">+ Lier un océan existant à ce pays...</option>
              {allOceans.filter(o => !selectedIds.includes(o.id)).map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {selectedOceans.map(ocean => (
          <div 
            key={ocean.id} 
            className="group relative bg-[#151725] border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer aspect-video flex flex-col justify-end shadow-xl"
            onClick={() => window.location.href = `/oceans?view=${ocean.id}`}
          >
            <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {!readOnly && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selectedIds.filter(id => id !== ocean.id).join(','));
                  }}
                  className="w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
                  title="Délier cet océan du pays"
                >
                  <Trash size={12} />
                </button>
              )}
              <div className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm" title="Ouvrir la fiche de l'Océan">
                <ExternalLink size={12} />
              </div>
            </div>

            {ocean.image_url ? (
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80" style={{ backgroundImage: `url(${ocean.image_url})`}} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1c1f33]">
                <span className="text-[9px] font-black tracking-[0.3em] text-white/10">SANS IMAGE</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-[#0f111a]/40 to-transparent" />
            
            <div className="relative p-4 z-10">
              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-0.5 shadow-black drop-shadow-lg">{ocean.name}</h4>
              <p className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.15em]">{ocean.type || 'Étendue maritime'}</p>
            </div>
          </div>
        ))}

        {selectedOceans.length === 0 && readOnly && (
          <div className="col-span-full border border-dashed border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-white/10">
            <Waves size={32} className="mb-2 opacity-50" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Aucun océan frontalier</span>
          </div>
        )}
      </div>
    </div>
  );
};

const countriesConfig = {
  entityName: 'le pays',
  tableName: 'countries',
  title: 'Pays',
  getHeaderIcon: () => Flag,
  getHeaderColor: () => 'from-red-500/30 via-blue-500/20 to-green-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', 
          label: 'Système de Règles local',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
        },
        {
          name: 'dynamic_nation', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: (props) => {
            const data = props.formData || props.item;
            if (!data) return null; 
            return (
              <RulesetDynamicFields 
                key={data.ruleset_id || 'nation-init'}
                rulesetId={data.ruleset_id} 
                entityType="nation" 
                formData={data} 
                setFormData={props.setFormData}
                onChange={props.onChange} 
                readOnly={props.readOnly}
              />
            );
          }
        },
        { name: 'name', label: 'Nom du pays', type: 'text', required: true, placeholder: 'Ex: Abanasinia, Solamnie...' },
        { name: 'subtitle', label: 'Devise ou surnom', type: 'text', placeholder: 'Ex: Cœur de l\'Empire, Terre des braves...' },
        { name: 'world_id', label: 'Monde', type: 'relation', table: 'worlds', placeholder: 'Sélectionner un monde' },
        { name: 'continent_id', label: 'Continent', type: 'relation', table: 'continents', filterBy: 'world_id', filterValue: 'world_id', placeholder: 'Sélectionner un continent' },
        { name: 'ocean_id', label: 'Océan/Mer (Principal)', type: 'relation', table: 'oceans', filterBy: 'world_id', filterValue: 'world_id', placeholder: 'Sélectionner un océan' },
        { name: 'image_url', label: 'Image principale', type: 'image', description: 'Drapeau ou paysage emblématique' },
        { name: 'description', label: 'Description générale', type: 'textarea', rows: 6, placeholder: 'Description complète du pays...' }
      ]
    },
    {
      id: 'geography',
      label: 'Géographie & Territoire',
      icon: Map,
      fields: [
        { name: 'area', label: 'Superficie', type: 'text', placeholder: 'Ex: 1 200 000 km²' },
        { name: 'capital', label: 'Capitale', type: 'text', placeholder: 'Nom de la capitale' },
        { name: 'population', label: 'Population', type: 'text', placeholder: 'Ex: 4 millions d\'habitants' },
        {
          name: 'terrain',
          label: 'Terrain principal',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Plaines', 'Montagneux', 'Forêts denses', 'Littoral', 'Marais', 'Archipel', 'Vallées encaissées', 'Déserts de sable', 'Steppes glacées', 'Jungles tropicales', 'Plateaux arides', 'Collines verdoyantes']} 
            />
          )
        },
        {
          name: 'climate_description',
          label: 'Climat principal',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Tropical humide', 'Tempéré continental', 'Arctique extrême', 'Désertique chaud', 'Méditerranéen', 'Océanique doux', 'Équatorial', 'Subarctique', 'Magique instable']} 
            />
          )
        }
      ]
    },
    {
      id: 'politics',
      label: 'Politique & Gouvernement',
      icon: Scale,
      fields: [
        {
          name: 'government_type',
          label: 'Type de gouvernement',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Monarchie absolue', 'République fédérale', 'Théocratie', 'Empire expansionniste', 'Démocratie directe', 'Oligarchie marchande', 'Tribal', 'Dictature militaire', 'Anarchie organisée', 'Magocratie']} 
            />
          )
        },
        {
          name: 'government_structure',
          label: 'Structure gouvernementale',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Centralisée', 'Fédérale', 'Confédération lâche', 'Féodale', 'Conseil d\'Anciens', 'Caste Militaire', 'Bureaucratie Royale', 'Sénat Élu', 'Héréditaire']} 
            />
          )
        },
        {
          name: 'ruler',
          label: 'Dirigeant actuel',
          type: 'custom',
          component: (props) => (
            <div className="flex flex-col gap-2">
              <MultiRelationSelector {...props} table="characters" placeholder="Chercher parmi les PNJs..." readOnly={props.readOnly} />
              {!props.readOnly && (
                <button type="button" onClick={() => { const n = window.prompt("Nom du dirigeant :"); if (n) props.onChange(n); }} className="text-[10px] font-bold text-teal-400 uppercase self-end mr-2 hover:text-white transition-colors">Saisir un nom (Autre)</button>
              )}
            </div>
          )
        },
        {
          name: 'laws',
          label: 'Lois importantes',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Code civil strict', 'Loi martiale permanente', 'Lois religieuses (Dogme)', 'Liberté totale', 'Coutumes ancestrales', 'Interdiction de la magie', 'Égalité absolue', 'Droit de cuissage', 'Esclavage légal']} 
            />
          )
        },
        {
          name: 'military_strength',
          label: 'Force militaire',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Puissance mondiale', 'Moyenne', 'Faible/Défensive', 'Inexistante', 'Milices désorganisées', 'En pleine expansion', 'Redoutée (Élite)', 'Symbolique']} 
            />
          )
        },
        {
          name: 'military_structure',
          label: 'Structure militaire',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Armée régulière', 'Mercenaires uniquement', 'Milices villageoises', 'Garde d\'élite restreinte', 'Ordre de chevalerie', 'Légions magiques', 'Marine prédominante', 'Guerilla']} 
            />
          )
        },
        {
          name: 'alliances',
          label: 'Alliances',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Traités commerciaux', 'Pacte de défense mutuelle', 'Alliance secrète', 'Neutralité absolue', 'Membre d\'une coalition', 'Vassal d\'un empire', 'Protectorat']} 
            />
          )
        },
        {
          name: 'enemies',
          label: 'Ennemis',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Nations rivales', 'Groupes rebelles internes', 'Hordes barbares frontalières', 'Cultes interdits', 'Monstres errants', 'Anciens colons', 'Pirates']} 
            />
          )
        }
      ]
    },
    {
      id: 'economy',
      label: 'Économie & Commerce',
      icon: DollarSign,
      fields: [
        {
          name: 'economy',
          label: 'Économie générale',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Marchande maritime', 'Agraire', 'Industrielle naissante', 'Protectionniste', 'Libérale', 'Féodale (Taxes)', 'Subsistance', 'Basée sur le pillage', 'Économie magique']} 
            />
          )
        },
        {
          name: 'currency',
          label: 'Monnaie',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Pièces d\'or (Couronnes)', 'Crédits magiques', 'Troc uniquement', 'Gemmes précieuses', 'Lingots d\'acier', 'Monnaie de papier', 'Coquillages/Ressources']} 
            />
          )
        },
        {
          name: 'trade_goods',
          label: 'Biens commerciaux',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Épices rares', 'Métaux précieux', 'Tissus & Soies', 'Artefacts magiques', 'Bétail', 'Armement forgé', 'Nourriture de base', 'Bois précieux', 'Vin & Alcool']} 
            />
          )
        },
        {
          name: 'imports',
          label: 'Importations majeures',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Magie & Cristaux', 'Main d\'œuvre', 'Matières premières', 'Produits de luxe', 'Chevaux de guerre', 'Technologie étrangère', 'Eau potable']} 
            />
          )
        },
        {
          name: 'exports',
          label: 'Exportations majeures',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Minerais bruts', 'Savon & Huiles', 'Artisanat d\'art', 'Services mercenaires', 'Céréales', 'Produits de la mer', 'Savoir académique']} 
            />
          )
        }
      ]
    },
    {
      id: 'culture',
      label: 'Culture & Société',
      icon: Palette,
      fields: [
        {
          name: 'language',
          label: 'Langues parlées',
          type: 'custom',
          component: (props) => <MultiRelationSelector {...props} table="languages" readOnly={props.readOnly} />
        },
        {
          name: 'cultural_practices',
          label: 'Pratiques culturelles',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Hospitalité sacrée', 'Duels d\'honneur', 'Prière quotidienne', 'Rite de passage (16 ans)', 'Tatouages rituels', 'Culte des ancêtres', 'Nomadisme saisonnier', 'Matriarcat']} 
            />
          )
        },
        {
          name: 'festivals',
          label: 'Festivals & Célébrations',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Solstice d\'été', 'Fête de la moisson', 'Jour de l\'Indépendance', 'Fête des Morts', 'Sacre du Souverain', 'Carnaval des masques', 'Loterie nationale', 'Tournoi de joutes']} 
            />
          )
        },
        {
          name: 'cuisine',
          label: 'Cuisine typique',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Grillades de bête', 'Soupes & Ragoûts', 'Cuisine très épicée', 'Fruits de mer', 'Végétarien ritualisé', 'Aliments crus & Fermentés', 'Pâtisseries au miel']} 
            />
          )
        },
        {
          name: 'art_style',
          label: 'Style artistique',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Gothique flamboyant', 'Baroque chargé', 'Tribal ancestral', 'Minimaliste moderne', 'Magique & Luminescent', 'Renaissance classique', 'Brutalist', 'Enluminures']} 
            />
          )
        },
        {
          name: 'education_system',
          label: 'Système éducatif',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Académies de magie', 'Écoles militaires de prestige', 'Apprentissage direct (Guildes)', 'Université publique', 'Éducation religieuse obligatiore', 'Autodidacte valorisé']} 
            />
          )
        }
      ]
    },
    {
      id: 'locations',
      label: 'Villes & Lieux',
      icon: Landmark,
      fields: [
        { 
          name: 'country_locations', 
          label: 'Tous les établissements', 
          type: 'custom', 
          isVirtual: true, 
          component: (props) => {
            const currentId = props.formData?.id || props.item?.id;
            if (!currentId) return null;
            return (
              <div className="space-y-12">
                <div>
                  <h3 className="text-teal-400 font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                    <div className="w-8 h-[1px] bg-teal-500/30"></div> Villes Principales
                  </h3>
                  <EntityChildCards parentId={currentId} childTable="cities" parentKey="country_id" childRoute="cities" readOnly={props.readOnly} />
                </div>
                <div>
                  <h3 className="text-emerald-400 font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                    <div className="w-8 h-[1px] bg-emerald-500/30"></div> Villages & Bourgs
                  </h3>
                  <EntityChildCards parentId={currentId} childTable="villages" parentKey="country_id" childRoute="villages" readOnly={props.readOnly} />
                </div>
                <div>
                  <h3 className="text-orange-400 font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                    <div className="w-8 h-[1px] bg-orange-500/30"></div> Sites Remarquables & Ruines
                  </h3>
                  <EntityChildCards parentId={currentId} childTable="locations" parentKey="country_id" childRoute="locations" readOnly={props.readOnly} />
                </div>
              </div>
            );
          }
        }
      ]
    },
    {
      id: 'oceans',
      label: 'Océans & mers',
      icon: Waves,
      fields: [
        {
          name: 'country_oceans',
          label: 'Mers frontalières',
          type: 'custom',
          component: (props) => (
            <OceanCardManager 
              value={props.formData?.country_oceans || props.item?.country_oceans} 
              onChange={props.onChange} 
              readOnly={props.readOnly} 
            />
          )
        }
      ]
    },
    {
      id: 'history',
      label: 'Histoire',
      icon: BookOpen,
      fields: [
        { name: 'founding_date', label: 'Date de fondation', type: 'text', placeholder: 'Ex: An 1245' },
        { name: 'history', label: 'Histoire du pays', type: 'textarea', rows: 8, placeholder: 'Origines, évolution, grandes ères...' },
        { name: 'major_wars', label: 'Guerres majeures', type: 'textarea', rows: 4, placeholder: 'Conflits marquants...' },
        { name: 'historical_figures', label: 'Figures historiques', type: 'textarea', rows: 3, placeholder: 'Héros, rois disparus...' },
        { name: 'relations', label: 'Relations diplomatiques actuelles', type: 'textarea', rows: 3, placeholder: 'État actuel avec les voisins...' }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        { 
          name: 'country_images', 
          label: 'Images', 
          type: 'images', 
          bucket: 'images', 
          categories: [
            { id: 'flag', label: 'Drapeau' }, 
            { id: 'cities', label: 'Villes' }, 
            { id: 'landscapes', label: 'Paysages' },
            { id: 'culture', label: 'Culture & Vie' }
          ] 
        }
      ]
    },
    {
      id: 'gm', 
      label: 'Notes MJ (Secret)',
      icon: Shield,
      fields: [
        { name: 'gm_secrets_country', label: 'Secrets du pays', type: 'textarea', rows: 5, placeholder: 'Complots, vérités cachées...' },
        { name: 'notes', label: 'Notes diverses', type: 'textarea', rows: 4, placeholder: 'Notes privées pour le MJ...' }
      ]
    }
  ]
};

const listFilters = [
  { key: 'world_id', label: 'Monde', type: 'relation', relationTable: 'worlds' },
  { key: 'continent_id', label: 'Continent', type: 'relation', relationTable: 'continents' },
  { key: 'ocean_id', label: 'Océan/Mer', type: 'relation', relationTable: 'oceans' }
];

export default function CountriesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // État pour le dialogue de suppression personnalisé
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewId = urlParams.get('view');
    const editId = urlParams.get('edit');
    if (viewId || editId) {
      const targetId = viewId || editId;
      const fetchItem = async () => {
        const { data } = await supabase.from('countries').select('*').eq('id', targetId).single();
        if (data) { 
          if (editId) { setEditingItem(data); setShowForm(true); } 
          else { setSelectedItem(data); }
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };
      fetchItem();
    }
  }, []);

  const handleSuccess = () => { 
    setRefreshKey(p => p + 1); 
    setShowForm(false); 
    setEditingItem(null); 
    setSelectedItem(null); 
  };

  // Logique de suppression Prestige
  const openDeleteDialog = (item) => {
    setDeleteConfirm({ isOpen: true, item });
  };

  const executeDelete = async () => {
    const item = deleteConfirm.item;
    if (!item) return;

    try {
      await supabase.from('countries').delete().eq('id', item.id);
      setSelectedItem(null);
      setRefreshKey(p => p + 1);
    } catch (err) {
      console.error("Erreur de suppression:", err);
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <>
      {/* DIALOGUE DE SUPPRESSION PERSONNALISÉ */}
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Démanteler la Nation"
        message={`Souhaitez-vous vraiment rayer ${deleteConfirm.item?.name} de la carte ? Ses villes et son histoire s'effaceront de la mémoire du monde.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList 
        key={refreshKey} 
        tableName="countries" 
        title="Pays" 
        onView={setSelectedItem} 
        onEdit={(i) => { setEditingItem(i); setShowForm(true); }} 
        onCreate={() => { setEditingItem(null); setShowForm(true); }} 
        onDelete={openDeleteDialog}
        filters={listFilters} 
      />
      
      <EnhancedEntityDetail 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }} 
        onDelete={() => openDeleteDialog(selectedItem)} 
        item={selectedItem} 
        config={countriesConfig} 
        customLayout={CountryLayout} 
      />

      <EnhancedEntityForm 
        isOpen={showForm} 
        onClose={() => { setShowForm(false); setEditingItem(null); }} 
        onSuccess={handleSuccess} 
        item={editingItem} 
        config={countriesConfig} 
        customForm={CountryForm} 
      />
    </>
  );
}
// src/pages/CharactersPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Sword, Scroll, Crown, Skull, Zap, Backpack, 
  Sparkles, BookOpen, Compass, Clock, Star, Moon, Sun, Calendar,
  ArrowUpCircle, ArrowRight, Heart, CheckCircle 
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields';
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/rulesets';
import DynamicStatsEditor from '../components/DynamicStatsEditor';
import ArsenalEditor from '../components/ArsenalEditor'; 
import CharacterSpellbook from '../components/CharacterSpellbook';
import InventoryEditor from '../components/InventoryEditor';
import { calculateCombatStats, getLevelUpBenefits } from '../utils/rulesEngine';

// --- LE WIZARD DE MONTÉE DE NIVEAU ---
const LevelUpWizard = ({ character, onClose, onSuccess }) => {
  const [saving, setSaving] = useState(false);
  const newLevel = (character.level || 1) + 1;
  const hpRoll = Math.floor(Math.random() * 8) + 1; 
  const conMod = Math.floor(((character.data?.con || 10) - 10) / 2);
  const newHpMax = (character.data?.hp_max || character.data?.hp || 10) + hpRoll + conMod;

  const className = character.class_id ? character.class_id : 'Guerrier'; 
  const benefits = getLevelUpBenefits(className, newLevel);

  const confirmLevelUp = async () => {
    setSaving(true);
    const updatedData = { ...character.data, hp: newHpMax, hp_max: newHpMax };
    
    await supabase.from('characters').update({ 
      level: newLevel, 
      data: updatedData 
    }).eq('id', character.id);
    
    setSaving(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
      <div className="relative bg-[#0f111a] border border-amber-500/30 rounded-[2.5rem] w-full max-w-2xl shadow-[0_0_100px_rgba(245,158,11,0.2)] animate-in zoom-in-95 overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/20 to-transparent" />
        <div className="absolute -top-24 -right-24 text-amber-500/10 rotate-12"><Star size={250} /></div>

        <div className="relative p-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-400 mb-6 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
             <ArrowUpCircle size={40} />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">ASCENSION</h2>
          <p className="text-amber-500 font-bold uppercase tracking-[0.3em] mb-10 text-xs">
            {character.name} atteint le Niveau {newLevel}
          </p>

          <div className="w-full bg-[#151725] border border-white/5 rounded-[2rem] p-8 text-left space-y-6 shadow-inner">
             <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl"><Heart size={24}/></div>
                <div>
                   <h4 className="text-xs font-black uppercase text-silver/60 tracking-widest">Points de Vie Maximum</h4>
                   <div className="text-2xl font-black text-white flex items-center gap-3 mt-1">
                      Anciens: <span className="text-silver">{character.data?.hp || 10}</span> 
                      <ArrowRight size={16} className="text-amber-500" /> 
                      Nouveaux: <span className="text-green-400">{newHpMax}</span>
                   </div>
                   <p className="text-[10px] text-silver/40 mt-1">Jet de dés ({hpRoll}) + Mod. Constitution ({conMod >= 0 ? '+'+conMod : conMod})</p>
                </div>
             </div>

             <div>
               <h4 className="text-xs font-black uppercase text-silver/60 tracking-widest mb-4">Nouvelles Capacités Acquises</h4>
               <ul className="space-y-3">
                 {benefits.map((ben, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-silver font-medium bg-black/40 p-3 rounded-xl border border-white/5">
                     <CheckCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                     {ben}
                   </li>
                 ))}
               </ul>
             </div>
          </div>

          <div className="flex gap-4 mt-10 w-full">
            <button onClick={onClose} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-silver rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
              Remettre à plus tard
            </button>
            <button disabled={saving} onClick={confirmLevelUp} className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? 'Incantation...' : 'Confirmer l\'Ascension'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MOTEUR DE CARTOGRAPHIE PDF D&D 2024 ---
const generatePDF = async (character) => {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    // Fonction magique pour charger les images en Promesse
    const loadImage = (src) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Impossible de charger ${src}`));
      img.src = src;
    });

    // On attend que les deux pages de background soient chargées depuis le dossier /public
    const [imgPage1, imgPage2] = await Promise.all([
      loadImage('/sheet_page1.jpg'),
      loadImage('/sheet_page2.jpg')
    ]);
    
    // Raccourcis pour les données
    const d = character.data || {};
    const derived = calculateCombatStats(character.ruleset_id || 'dnd5', d, character.level);
    
    const getMod = (score) => {
      const m = Math.floor(((parseInt(score) || 10) - 10) / 2);
      return m >= 0 ? `+${m}` : `${m}`;
    };

    // Configuration de la police
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30); // Noir/Gris très foncé

    // ==========================================
    // PAGE 1 : IDENTITÉ, STATS ET COMBAT
    // ==========================================
    doc.addImage(imgPage1, 'JPEG', 0, 0, 210, 297);
    
    doc.setFontSize(11);
    // Identité (En Haut)
    doc.text(character.name || 'Héros Inconnu', 25, 20); // Nom
    doc.text('Aventurier', 90, 20); // Classe (Ajustez selon vos data)
    doc.text('Aventure', 40, 27); // Historique
    doc.text(character.race_id || 'Humain', 25, 34); // Race
    
    doc.setFontSize(14);
    doc.text(String(character.level || 1), 133, 26); // Niveau (Dans le cercle)

    doc.setFontSize(12);
    // Caractéristiques Gauche (Val = Valeur, Mod = Modificateur)
    doc.text(String(d.str || 10), 24, 88, { align: "center" }); // FOR Val
    doc.text(getMod(d.str), 24, 102, { align: "center" });      // FOR Mod
    
    doc.text(String(d.dex || 10), 24, 131, { align: "center" }); // DEX Val
    doc.text(getMod(d.dex), 24, 145, { align: "center" });       // DEX Mod
    
    doc.text(String(d.con || 10), 24, 175, { align: "center" }); // CON Val
    doc.text(getMod(d.con), 24, 189, { align: "center" });       // CON Mod

    // Caractéristiques Centre
    doc.text(String(d.int || 10), 56, 73, { align: "center" }); // INT Val
    doc.text(getMod(d.int), 56, 88, { align: "center" });       // INT Mod
    
    doc.text(String(d.wis || 10), 56, 128, { align: "center" }); // SAG Val
    doc.text(getMod(d.wis), 56, 143, { align: "center" });       // SAG Mod
    
    doc.text(String(d.cha || 10), 56, 185, { align: "center" }); // CHA Val
    doc.text(getMod(d.cha), 56, 200, { align: "center" });       // CHA Mod

    doc.setFontSize(16);
    doc.text(derived.prof || '+2', 34, 52, { align: "center" }); // Bonus Maîtrise
    doc.text(String(derived.ac || 10), 108, 30, { align: "center" }); // Classe d'Armure
    
    doc.setFontSize(12);
    doc.text(String(derived.hp || 10), 165, 33, { align: "center" }); // Points de Vie Max
    doc.text(String(derived.hp || 10), 140, 33, { align: "center" }); // Points de Vie Actuels
    doc.text(derived.init || '+0', 104, 55, { align: "center" }); // Initiative
    doc.text((d.speed_m || '9') + 'm', 132, 55, { align: "center" }); // Vitesse

    // Arsenal / Armes (Impression d'une liste de 4 armes max)
    if (d.arsenal && d.arsenal.length > 0) {
      doc.setFontSize(9);
      let startY = 83;
      d.arsenal.slice(0, 4).forEach((arme) => {
         doc.text(arme.name.substring(0, 20), 95, startY);
         doc.text(arme.stats?.atk || '+0', 135, startY, { align: "center" });
         doc.text(arme.stats?.dmg || '1d4', 155, startY, { align: "center" });
         startY += 9; // Écart entre chaque ligne d'arme
      });
    }

    // ==========================================
    // PAGE 2 : MAGIE, INVENTAIRE ET BIO
    // ==========================================
    doc.addPage();
    doc.addImage(imgPage2, 'JPEG', 0, 0, 210, 297);
    
    doc.setFontSize(9);
    
    // Remplissage de l'Inventaire (Sac à dos)
    if (d.inventory && d.inventory.length > 0) {
      let invY = 165;
      d.inventory.slice(0, 15).forEach((item) => {
         const qty = item.quantity > 1 ? ` (x${item.quantity})` : '';
         doc.text(`- ${item.name}${qty}`, 135, invY);
         invY += 5.5;
      });
    }

    // Monnaie
    doc.setFontSize(11);
    doc.text(String(d.money_pc || 0), 145, 275, { align: "center" });
    doc.text(String(d.money_pa || 0), 160, 275, { align: "center" });
    doc.text(String(d.money_po || 0), 185, 275, { align: "center" });

    // Biographie (Apparence & Histoire)
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    
    if (character.description) {
      const splitDesc = doc.splitTextToSize(character.description, 60);
      doc.text(splitDesc, 135, 25);
    }
    if (character.backstory) {
      const splitStory = doc.splitTextToSize(character.backstory, 60);
      doc.text(splitStory, 135, 75);
    }

    doc.save(`${character.name}_Feuille_de_Perso.pdf`);
    
  } catch (e) {
    console.error(e);
    alert("Erreur de génération. Vérifiez que 'sheet_page1.jpg' et 'sheet_page2.jpg' sont bien dans le dossier /public !");
  }
};


// --- COMPOSANT : CALCULATEUR D'INFLUENCES ASTRALES SYNCHRONISÉES ---
const CosmicInfluenceStatus = ({ character }) => {
  const [influences, setInfluences] = useState([]);
  const [worldInfo, setWorldInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCosmicData() {
      if (!character?.world_id) return;
      
      const { data: world } = await supabase
        .from('worlds')
        .select('*')
        .eq('id', character.world_id)
        .single();
      setWorldInfo(world);

      const { data: allHoroscopes } = await supabase
        .from('horoscopes')
        .select('*, celestial_bodies(name)')
        .eq('world_id', character.world_id);
      
      if (allHoroscopes && world) {
        const months = world.calendar_config?.months || [];

        const active = allHoroscopes.filter(h => {
          if (h.scale === 'natal' && character.birth_date) {
            return character.birth_date.includes(h.start_date) || character.data?.zodiac === h.name;
          }
          if (h.scale === 'year' && h.start_date === String(world.current_year)) return true;
          if (h.scale === 'month') {
            const currentMonthName = months[world.current_month - 1]?.name;
            return h.name === currentMonthName || h.start_date === String(world.current_month);
          }
          if (h.scale === 'day' && h.start_date === String(world.current_day)) return true;
          if (h.scale === 'hour' && h.start_date === String(world.current_hour)) return true;
          return false;
        });

        setInfluences(active);
      }
      setLoading(false);
    }
    fetchCosmicData();
  }, [character]);

  const totalMod = influences.reduce((acc, curr) => acc + (curr.data?.celestial_configs?.global_modifier || 0), 0);

  if (loading) return <div className="p-8 text-center text-silver/20 animate-pulse uppercase tracking-widest text-xs">Consultation des Astres...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bg-[#0f111a] rounded-[2rem] p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 text-purple-500">
          <Compass size={140} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-2">
                {character?.ruleset_id === 'starfinder' || character?.ruleset_id === 'cyberpunk' ? 'Résonance Énergétique' : 'Thème Astral'}
              </h3>
              <div className="flex flex-wrap gap-3">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Star size={12}/> Né le {character?.birth_date || 'Inconnu'} à {character?.birth_hour || '??'}h
                </span>
                {worldInfo && (
                  <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12}/> Temps du Monde : J{worldInfo.current_day} / M{worldInfo.current_month} / A{worldInfo.current_year}
                  </span>
                )}
              </div>
            </div>
            
            <div className="bg-black/60 px-6 py-4 rounded-3xl border border-white/5 flex flex-col items-center shadow-inner">
              <span className="text-[10px] font-black text-silver/40 uppercase mb-1">Modificateur Global</span>
              <span className={`text-4xl font-black ${totalMod >= 0 ? 'text-green-400' : 'text-red-400'} drop-shadow-md`}>
                {totalMod > 0 ? `+${totalMod}` : totalMod}%
              </span>
            </div>
          </div>

          <p className="text-[10px] text-silver/40 font-bold uppercase tracking-widest border-t border-white/5 pt-4">
            Influences cumulées sur l'ensemble des compétences et jets de dés.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {influences.map((inf, idx) => (
          <div key={idx} className="bg-[#151725] p-5 rounded-2xl border border-white/5 flex items-center gap-5 transition-all hover:bg-white/5 group">
            <div className={`p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110 ${inf.scale === 'natal' ? 'bg-amber-500/20 text-amber-400 shadow-amber-500/5' : 'bg-purple-500/20 text-purple-400 shadow-purple-500/5'}`}>
              {inf.scale === 'natal' ? <Star size={24}/> : <Moon size={24}/>}
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">{inf.name}</h4>
              <p className="text-[10px] text-silver/50 font-bold uppercase flex items-center gap-2">
                <span className="text-teal-500/70">{inf.scale}</span> • {inf.celestial_bodies?.name || 'Astre dominant'}
              </p>
            </div>
            <div className={`ml-auto text-sm font-black ${inf.data?.celestial_configs?.global_modifier >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
              {inf.data?.celestial_configs?.global_modifier > 0 ? '+' : ''}{inf.data?.celestial_configs?.global_modifier}%
            </div>
          </div>
        ))}
        {influences.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
            <Sparkles size={32} className="mx-auto text-silver/10 mb-4" />
            <p className="text-[10px] text-silver/30 font-black uppercase tracking-widest">Le ciel est muet pour ce héros aujourd'hui</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ConnectedStatsEditor = ({ value, onChange, formData }) => {
  const currentRulesetId = formData?.ruleset_id || 'dnd5';
  const currentRuleset = DEFAULT_RULESETS[currentRulesetId] || DEFAULT_RULESETS['dnd5'];
  
  const handleStatsChange = (newStats) => {
    const derived = calculateCombatStats(currentRulesetId, newStats, formData.level);
    onChange({ ...newStats, ...derived });
  };
  return <DynamicStatsEditor ruleset={currentRuleset} data={value} onChange={handleStatsChange} />;
};

const charactersConfig = {
  entityName: 'le personnage',
  tableName: 'characters',
  title: 'Forge des Héros',
  getHeaderIcon: (it) => (!it ? User : it.character_type === 'PJ' ? Crown : User),
  getHeaderColor: (it) => (it?.character_type === 'PJ' ? 'from-amber-600/40 via-yellow-500/20 to-orange-500/30' : 'from-slate-700/40 via-blue-900/30 to-slate-800/50'),

  tabs: [
    {
      id: 'identity',
      label: 'Système & Identité',
      icon: User,
      fields: [
        { name: 'ruleset_id', label: 'Système de Règles', type: 'select', required: true, options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name })) },
        { 
          name: 'dynamic_character_fields', 
          isVirtual: true,
          label: 'Détails Système',
          type: 'custom',
          component: ({ formData, onFullChange }) => (
            <RulesetDynamicFields rulesetId={formData.ruleset_id} entityType="race" formData={formData} onChange={onFullChange} />
          )
        },
        { name: 'name', label: 'Nom du Héros', type: 'text', required: true, placeholder: 'Nom...' },
        { name: 'world_id', label: 'Monde d\'Origine', type: 'relation', table: 'worlds', required: true },
        { name: 'character_type', label: 'Type', type: 'select', options: [{ value: 'PJ', label: 'PJ' }, { value: 'PNJ', label: 'PNJ' }] },
        { name: 'sex', label: 'Sexe / Genre', type: 'select', options: [{value:'M', label:'Masculin'}, {value:'F', label:'Féminin'}, {value:'X', label:'Autre'}] },
        { name: 'birth_date', label: 'Date de Naissance', type: 'text', placeholder: 'Ex: 14-03-1284' },
        { name: 'birth_hour', label: 'Heure de Naissance', type: 'number', placeholder: '0-23' },
        { name: 'race_id', label: 'Race / Origine', type: 'relation', table: 'races', required: true },
        { name: 'class_id', label: 'Classe / Vocation', type: 'relation', table: 'character_classes', required: true },
        { name: 'subclass_id', label: 'Archétype (Sous-Classe)', type: 'relation', table: 'subclasses', filterBy: 'class_id', filterValue: 'class_id' },
        { name: 'level', label: 'Niveau', type: 'number', required: true },
        { name: 'image_url', label: 'Portrait', type: 'image' }
      ]
    },
    {
      id: 'cosmic',
      label: 'Destin & Astres',
      icon: Sparkles,
      fields: [
        { 
          name: 'cosmic_status', 
          isVirtual: true,
          label: 'Influence des Astres en Temps Réel', 
          type: 'custom', 
          component: ({ formData }) => <CosmicInfluenceStatus character={formData} /> 
        }
      ]
    },
    {
      id: 'stats',
      label: 'Caractéristiques & Compétences',
      icon: Shield,
      fields: [{ name: 'data', label: 'Fiche Technique Interactive', type: 'custom', component: ConnectedStatsEditor }]
    },
    {
      id: 'combat',
      label: 'Combat & Arsenal',
      icon: Sword,
      fields: [
        { 
          name: 'arsenal_data', 
          isVirtual: true,
          label: 'Arsenal & Équipement', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <ArsenalEditor 
              value={formData.data?.arsenal || []} 
              onChange={(newArsenal) => onFullChange({ ...formData, data: { ...formData.data, arsenal: newArsenal } })} 
              formData={formData} 
            />
          )
        },
        { name: 'abilities', label: 'Capacités Spéciales', type: 'textarea', placeholder: 'Talents, traits de combat...' }
      ]
    },
    {
      id: 'magic',
      label: 'Grimoire Arcanique',
      icon: Sparkles,
      fields: [
        { 
          name: 'magic_editor', 
          isVirtual: true,
          label: 'Maîtrise des Arcanes', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <CharacterSpellbook character={formData} onChange={(newData) => onFullChange({ ...formData, data: newData })} />
          )
        }
      ]
    },
    {
      id: 'bio',
      label: 'Biographie & Histoire',
      icon: Scroll,
      fields: [
        { name: 'backstory', label: 'Histoire & Origines', type: 'textarea', rows: 6, placeholder: 'Récit de vie...' },
        { name: 'personality', label: 'Traits de Personnalité', type: 'textarea', rows: 3, placeholder: 'Caractère...' },
        { name: 'description', label: 'Apparence Physique', type: 'textarea', rows: 3, placeholder: 'Traits distinctifs...' }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventaire',
      icon: Backpack,
      fields: [
        {
          name: 'money_custom',
          isVirtual: true,
          label: 'Bourse & Richesses',
          type: 'custom',
          component: ({ formData, onFullChange }) => (
            <div className="grid grid-cols-4 gap-4 mb-8 bg-[#0f111a] p-6 rounded-[2rem] border border-white/5">
              {['pp', 'po', 'pa', 'pc'].map(coin => {
                const colors = { pp: 'text-slate-200 border-slate-500/30', po: 'text-yellow-400 border-yellow-500/30', pa: 'text-zinc-400 border-zinc-400/30', pc: 'text-orange-400 border-orange-500/30' };
                const labels = { pp: 'Platine', po: 'Or', pa: 'Argent', pc: 'Cuivre' };
                return (
                  <div key={coin} className={`bg-black/40 p-4 rounded-2xl border ${colors[coin]} text-center`}>
                    <span className="text-[10px] font-black uppercase mb-2 block text-silver/60">{labels[coin]}</span>
                    <input 
                      type="number" 
                      value={formData.data?.[`money_${coin}`] || 0} 
                      onChange={(e) => onFullChange({...formData, data: {...formData.data, [`money_${coin}`]: parseInt(e.target.value)||0}})} 
                      className={`w-full bg-transparent text-center text-xl font-black outline-none [&::-webkit-inner-spin-button]:appearance-none ${colors[coin].split(' ')[0]}`} 
                    />
                  </div>
                );
              })}
            </div>
          )
        },
        { 
          name: 'inventory_data', 
          isVirtual: true,
          label: 'Sac à dos (Équipement BD)', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <InventoryEditor 
              value={formData.data?.inventory || []} 
              onChange={(newInv) => onFullChange({ ...formData, data: { ...formData.data, inventory: newInv } })} 
              formData={formData}
            />
          ) 
        }
      ]
    },
    {
      id: 'gm',
      label: 'MJ (Secret)',
      icon: Skull,
      fields: [
        { name: 'gm_notes', label: 'Notes MJ', type: 'textarea', rows: 6, placeholder: 'Secrets sur le personnage...' }
      ]
    }
  ]
};

export default function CharactersPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // États pour l'assistant Level Up
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpChar, setLevelUpChar] = useState(null);

  const getAugmentedItem = (item) => {
    if (!item) return null;
    const auto = calculateCombatStats(item.ruleset_id, item.data || {}, item.level);
    return { ...item, ...auto };
  };

  const handleLevelUpClick = (char) => {
    setLevelUpChar(char);
    setShowLevelUp(true);
  };

  return (
    <>
      <EntityList 
        key={refreshKey} 
        tableName="characters" 
        title="Forge des Personnages" 
        icon={User} 
        onView={(it) => setSelectedItem(it)} 
        onEdit={(it) => { setEditingItem(it); setIsCreating(true); }}
        onCreate={() => { setEditingItem(null); setIsCreating(true); }}
        onDelete={async (it) => { 
          if (confirm(`Supprimer ${it.name}?`)) { 
            await supabase.from('characters').delete().eq('id', it.id); 
            setRefreshKey(k => k + 1); 
          }
        }} 
      />
      
      <EnhancedEntityDetail 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={getAugmentedItem(selectedItem)} 
        config={charactersConfig} 
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setIsCreating(true); }} 
        onLevelUp={() => handleLevelUpClick(selectedItem)}
        onExportPDF={() => generatePDF(selectedItem)}
      />
      
      <EnhancedEntityForm 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)} 
        item={editingItem} 
        config={charactersConfig} 
        onSuccess={() => setRefreshKey(k => k + 1)} 
      />

      {/* OVERLAY MAGIQUE DU LEVEL UP */}
      {showLevelUp && levelUpChar && (
        <LevelUpWizard 
          character={levelUpChar}
          onClose={() => setShowLevelUp(false)}
          onSuccess={() => {
            setShowLevelUp(false);
            setRefreshKey(k => k + 1);
            setSelectedItem(null); 
          }}
        />
      )}
    </>
  );
}
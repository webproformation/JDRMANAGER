import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Sparkles, ChevronRight, ChevronLeft, Check, Dices } from 'lucide-react';

export default function LevelUpWizard({ character, classData, subclassData, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableFeats, setAvailableFeats] = useState([]);
  
  // États pour les choix de montée de niveau
  const newLevel = (character.level || 1) + 1;
  const isAsiLevel = [4, 8, 12, 16, 19].includes(newLevel); // Niveaux standards d'ASI (D&D 5e)
  
  const [hpIncreaseType, setHpIncreaseType] = useState('fixed'); // 'fixed' ou 'roll'
  const [hpRoll, setHpRoll] = useState('');
  
  const [asiType, setAsiType] = useState('asi'); // 'asi' ou 'feat'
  const [abilityScoreIncreases, setAbilityScoreIncreases] = useState({
    strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0
  });
  const [selectedFeatId, setSelectedFeatId] = useState('');

  const hitDieValue = classData?.hit_die ? parseInt(classData.hit_die.replace('d', '')) : 8;

  useEffect(() => {
    if (isAsiLevel) {
      fetchFeats();
    }
  }, [isAsiLevel]);

  const fetchFeats = async () => {
    const { data } = await supabase.from('feats').select('*').order('name');
    if (data) setAvailableFeats(data);
  };

  const handleStatIncrease = (stat, amount) => {
    const totalIncrease = Object.values(abilityScoreIncreases).reduce((a, b) => a + b, 0);
    const currentIncrease = abilityScoreIncreases[stat];
    
    // On ne peut pas dépasser +2 au total, ni dépasser +2 sur une seule stat
    if (amount > 0 && totalIncrease >= 2) return;
    if (amount > 0 && currentIncrease >= 2) return;
    if (amount < 0 && currentIncrease <= 0) return;

    setAbilityScoreIncreases({
      ...abilityScoreIncreases,
      [stat]: currentIncrease + amount
    });
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      let newStats = { ...(character.stats || {}) };
      let chosenFeat = null;

      // 1. Appliquer les bonus de caractéristiques (ASI ou Don)
      if (isAsiLevel) {
        if (asiType === 'asi') {
          Object.entries(abilityScoreIncreases).forEach(([stat, increase]) => {
            newStats[stat] = (newStats[stat] || 10) + increase;
          });
        } else if (asiType === 'feat' && selectedFeatId) {
          chosenFeat = availableFeats.find(f => f.id === selectedFeatId);
          // MAGIE ICI : On lit le JSON pour appliquer les stats automatiquement !
          if (chosenFeat?.data?.modifiers?.stats) {
            Object.entries(chosenFeat.data.modifiers.stats).forEach(([stat, bonus]) => {
              newStats[stat] = (newStats[stat] || 10) + bonus;
            });
          }
        }
      }

      // 2. Calcul des Points de Vie (incluant l'effet rétroactif de la Constitution)
      const oldConMod = Math.floor(((character.stats?.constitution || 10) - 10) / 2);
      const newConMod = Math.floor(((newStats.constitution || 10) - 10) / 2);
      const conModDiff = newConMod - oldConMod;
      
      // Si la Constitution a augmenté, on gagne +1 PV par niveau précédent !
      const retroactiveHp = conModDiff * (newLevel - 1);

      let hpGain = hpIncreaseType === 'fixed' 
        ? Math.floor(hitDieValue / 2) + 1 
        : parseInt(hpRoll || (Math.floor(hitDieValue / 2) + 1));
      
      hpGain += newConMod; // On ajoute le nouveau modificateur de CON pour le niveau actuel

      const newMaxHp = (parseInt(character.hit_points) || 0) + hpGain + retroactiveHp;

      // 3. Mise à jour des Dons (Feats) dans le JSON du personnage
      const currentFeats = character.data?.feats || [];
      const updatedData = { ...character.data };
      if (chosenFeat) {
        updatedData.feats = [...currentFeats, chosenFeat];
      }

      // 4. Sauvegarde en Base de Données
      const { error } = await supabase
        .from('characters')
        .update({
          level: newLevel,
          stats: newStats,
          hit_points: newMaxHp.toString(),
          data: updatedData
        })
        .eq('id', character.id);

      if (error) throw error;
      onComplete();

    } catch (error) {
      console.error('Erreur lors du passage de niveau:', error);
      alert("Une erreur s'est produite lors du passage de niveau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-night border border-arcane rounded-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-arcane bg-opacity-30 p-6 border-b border-arcane">
          <h2 className="text-2xl font-bold text-cyan-light flex items-center gap-3">
            <Sparkles className="text-cyan-light" />
            Passage au Niveau {newLevel} !
          </h2>
          <p className="text-silver mt-1">{character.name} devient plus puissant.</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          {/* Section 1 : Points de Vie */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-soft-white flex items-center gap-2 border-b border-arcane pb-2">
              <Shield size={20} className="text-cyan-light" /> Points de Vie
            </h3>
            <div className="bg-night bg-opacity-50 border border-arcane rounded-lg p-4">
              <p className="text-silver mb-4">Votre dé de vie est un <strong>d{hitDieValue}</strong>.</p>
              
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 text-soft-white cursor-pointer">
                  <input type="radio" checked={hpIncreaseType === 'fixed'} onChange={() => setHpIncreaseType('fixed')} className="text-cyan-light focus:ring-cyan-light bg-night" />
                  Valeur fixe ({Math.floor(hitDieValue / 2) + 1} + Mod. CON)
                </label>
                <label className="flex items-center gap-2 text-soft-white cursor-pointer">
                  <input type="radio" checked={hpIncreaseType === 'roll'} onChange={() => setHpIncreaseType('roll')} className="text-cyan-light focus:ring-cyan-light bg-night" />
                  Lancer le dé
                </label>
              </div>

              {hpIncreaseType === 'roll' && (
                <div className="flex items-center gap-4">
                  <Dices className="text-cyan-light" />
                  <input 
                    type="number" 
                    min="1" 
                    max={hitDieValue} 
                    value={hpRoll} 
                    onChange={(e) => setHpRoll(e.target.value)}
                    placeholder="Résultat du dé"
                    className="bg-night border border-arcane rounded px-3 py-1 text-soft-white focus:border-cyan-light w-32"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Section 2 : ASI ou Don (uniquement aux niveaux appropriés) */}
          {isAsiLevel && (
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-soft-white flex items-center gap-2 border-b border-arcane pb-2">
                <Sparkles size={20} className="text-cyan-light" /> Caractéristiques ou Don
              </h3>
              
              <div className="flex gap-4 mb-4">
                <button 
                  onClick={() => setAsiType('asi')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${asiType === 'asi' ? 'bg-cyan-light text-night' : 'bg-night border border-arcane text-silver hover:border-cyan-light'}`}
                >
                  Amélioration de Carac. (+2)
                </button>
                <button 
                  onClick={() => setAsiType('feat')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${asiType === 'feat' ? 'bg-cyan-light text-night' : 'bg-night border border-arcane text-silver hover:border-cyan-light'}`}
                >
                  Prendre un Don
                </button>
              </div>

              {asiType === 'asi' ? (
                <div className="bg-night bg-opacity-50 border border-arcane rounded-lg p-4 grid grid-cols-2 gap-4">
                  {Object.keys(abilityScoreIncreases).map(stat => (
                    <div key={stat} className="flex items-center justify-between">
                      <span className="text-soft-white capitalize">{stat.substring(0, 3)} ({(character.stats?.[stat] || 10) + abilityScoreIncreases[stat]})</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleStatIncrease(stat, -1)} disabled={abilityScoreIncreases[stat] === 0} className="w-6 h-6 rounded bg-arcane text-soft-white flex items-center justify-center disabled:opacity-50 hover:bg-red-500">-</button>
                        <span className="w-4 text-center text-cyan-light font-bold">+{abilityScoreIncreases[stat]}</span>
                        <button onClick={() => handleStatIncrease(stat, 1)} disabled={Object.values(abilityScoreIncreases).reduce((a,b)=>a+b,0) >= 2} className="w-6 h-6 rounded bg-arcane text-soft-white flex items-center justify-center disabled:opacity-50 hover:bg-green-500">+</button>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-2 text-center text-sm text-silver mt-2">
                    Points distribués : {Object.values(abilityScoreIncreases).reduce((a,b)=>a+b,0)} / 2
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <select 
                    value={selectedFeatId} 
                    onChange={(e) => setSelectedFeatId(e.target.value)}
                    className="w-full bg-night border border-arcane rounded-lg px-4 py-2 text-soft-white focus:border-cyan-light"
                  >
                    <option value="">-- Choisissez un Don --</option>
                    {availableFeats.map(feat => (
                      <option key={feat.id} value={feat.id}>{feat.name}</option>
                    ))}
                  </select>
                  
                  {selectedFeatId && (
                    <div className="bg-night bg-opacity-50 border border-arcane rounded-lg p-4 text-sm text-silver">
                      <p className="font-semibold text-cyan-light mb-1">Effets et Description :</p>
                      <p className="mb-2 italic">{availableFeats.find(f => f.id === selectedFeatId)?.description}</p>
                      <p>{availableFeats.find(f => f.id === selectedFeatId)?.benefits}</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="bg-arcane bg-opacity-30 p-4 border-t border-arcane flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-arcane text-silver rounded-lg hover:text-soft-white hover:border-soft-white transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={handleComplete}
            disabled={loading || (isAsiLevel && asiType === 'asi' && Object.values(abilityScoreIncreases).reduce((a,b)=>a+b,0) < 2) || (isAsiLevel && asiType === 'feat' && !selectedFeatId)}
            className="px-6 py-2 bg-cyan-light text-night font-bold rounded-lg hover:bg-soft-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? 'Application...' : 'Terminer la montée'}
            <Check size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
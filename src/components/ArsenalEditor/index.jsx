import React from 'react';
import WeaponSearch from './WeaponSearch';
import WeaponList from './WeaponList';
import { calculateWeaponStats, calculateCombatStats } from '../../utils/rulesEngine';

export default function ArsenalEditor({ value = [], onChange, formData }) {
  const charStats = formData.data || {}; 
  const derived = calculateCombatStats(formData.ruleset_id || 'dnd5', charStats, formData.level);
  const profBonus = parseInt(derived.prof?.replace('+', '') || 2);

  // RÉCUPÉRATION MAGIQUE DES ARMES DE L'INVENTAIRE
  const inventoryWeapons = (formData?.data?.inventory || [])
    .filter(item => item.location === 'equipped' && (item.type?.toLowerCase().includes('weapon') || item.type?.toLowerCase().includes('arme')))
    .map(item => {
      const base_data = item.base_data || { damage: '1d4', damage_type: 'Tranchant' };
      return {
        id: item.id,
        name: `${item.name} (Depuis le Sac)`,
        base_data: base_data,
        isEquippedFromInventory: true,
        stats: calculateWeaponStats(base_data, charStats, profBonus)
      };
    });

  // FUSION DE L'ARSENAL MANUEL ET DE L'INVENTAIRE
  const displayWeapons = [...inventoryWeapons, ...value];

  const addWeapon = (weaponItem) => {
    const stats = calculateWeaponStats(weaponItem.data, charStats, profBonus);
    const newEntry = {
      id: weaponItem.id,
      name: weaponItem.name,
      base_data: weaponItem.data,
      stats: stats
    };
    const newValue = Array.isArray(value) ? [...value, newEntry] : [newEntry];
    onChange(newValue);
  };

  const removeWeapon = (index) => {
    // Gestion intelligente de la suppression
    if (index < inventoryWeapons.length) {
      alert("Cette arme est liée à votre Inventaire. Allez dans l'onglet Inventaire pour la déséquiper ou la jeter !");
      return;
    }
    const realIndex = index - inventoryWeapons.length;
    const newValue = [...value];
    newValue.splice(realIndex, 1);
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <WeaponSearch onAddWeapon={addWeapon} />
      <WeaponList weapons={displayWeapons} onRemoveWeapon={removeWeapon} />
    </div>
  );
}
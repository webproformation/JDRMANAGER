import React from 'react';
import WeaponSearch from './WeaponSearch';
import WeaponList from './WeaponList';
import { calculateWeaponStats, calculateCombatStats } from '../../utils/rulesEngine';

export default function ArsenalEditor({ value = [], onChange, formData }) {
  
  const addWeapon = (weaponItem) => {
    const charStats = formData.data || {}; 
    const derived = calculateCombatStats(formData.ruleset_id || 'dnd5', charStats, formData.level);
    const profBonus = parseInt(derived.prof?.replace('+', '') || 2);

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
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <WeaponSearch onAddWeapon={addWeapon} />
      <WeaponList weapons={value} onRemoveWeapon={removeWeapon} />
    </div>
  );
}
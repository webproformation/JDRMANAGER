export const generateBioContent = (rulesetId, race, cl) => {
  const traits = ["Solitaire", "Héroïque", "Hanté par son passé", "Avide de richesses", "Dévoué à une cause", "Mystérieux"];
  const origins = ["un village côtier", "une citadelle en ruines", "une forêt sacrée", "les bas-fonds d'une cité"];
  const events = ["a survécu à une grande tragédie", "a découvert un secret interdit", "est en quête d'un héritage perdu"];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return {
    backstory: `Né dans ${pick(origins)}, ce ${race || 'individu'} ${cl || ''} ${pick(events)}. Cette expérience a forgé sa détermination.`,
    personality: `${pick(traits)}. Toujours prêt à affronter l'inconnu pour atteindre ses objectifs.`,
    description: `Porte les marques de ses voyages. Un regard vif qui trahit une grande intelligence.`
  };
};
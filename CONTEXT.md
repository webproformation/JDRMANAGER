📜 JDR MANAGER - GRIMOIRE DE CONTEXTE (Aethoria)
Dernière mise à jour : 22 Février 2026

🏛️ 1. VISION DU PROJET : "LE MOTEUR ULTIME"
Transformation de l'application en un Moteur de JDR Universel & Agnostique. L'objectif est de gérer n'importe quel univers et système de règles sans recoder l'application.

Agnosticisme : Le moteur ne connaît pas les règles "en dur" ; il lit des configurations dynamiques (rulesets.js).

Lore Profond : Gestion hiérarchique détaillée (Mondes > Villes > Lieux).

Secrets du MJ : Chaque entité possède une couche publique et une couche "Réservée au MJ" (gm_notes, gm_secret_plots).

Indépendance : Tout est centralisé sur Supabase sans API tierces obligatoires.

🛡️ 2. LOIS DE DÉVELOPPEMENT (INVIOLABLES)
🚫 RÈGLE 1 : AUCUNE SIMPLIFICATION
Interdiction formelle de condenser, d'omettre ou de simplifier le code.

Chaque propriété, icône, et bloc logique doit être écrit de manière explicite et développée.

Une réduction involontaire du nombre de lignes est considérée comme une perte de données grave.

📄 RÈGLE 2 : CODES INTÉGRAUX UNIQUEMENT
Toute réponse doit contenir le code complet et final des fichiers modifiés.

Les commentaires de type // ... reste du code identique sont strictement interdits.

🏗️ 3. ARCHITECTURE ET FICHIERS CLÉS
L'application utilise une architecture modulaire avancée (React + Vite + Tailwind + Supabase).

[NOUVEAUTÉ ARCHITECTURALE : APPROCHE PAR DOSSIERS / MODULES]
Afin d'éviter les fichiers monolithiques géants, les composants majeurs sont découpés en dossiers avec un `index.jsx` centralisateur :
- /EnhancedEntityForm/ : Sépare le Header, les Onglets, et le Rendu dynamique des champs (FieldRenderer). Intègre une grille CSS intelligente pour le placement 2 par 2 sur grand écran.
- /EnhancedEntityDetail/ : Sépare la logique de lecture. Intègre des boutons d'actions flottants autonomes (Modifier/Supprimer) et sécurisés (canEdit).
- /DynamicStatsEditor/ & /ArsenalEditor/ : Séparation des champs de formulaires spécifiques (ProgressField, NumberField) et du moteur de recherche d'armes.
- Composants de Relations (RelationSelect, RelationListSelect) : Utilisent désormais des `React Portals` (z-index: 99999) pour afficher des visionneuses d'encyclopédie façon RPG "plein écran" (carrousels interactifs avec couronnes de sélection).

⚙️ 4. LOGIQUE DES RÈGLES ET MOTEUR (Le rulesEngine)
Le moteur a été refondu en une structure modulaire par dossiers :
- /utils/rulesEngine/index.js : Le routeur principal.
- /utils/rulesEngine/diceRoller.js : Gère les lancers (ex: 4d6 drop lowest).
- /utils/rulesEngine/narrativeGen.js : Générateur narratif (Backstory, personnalité, apparence).
- /utils/rulesEngine/systems/... : Sous-dossier contenant les mathématiques pures isolées par jeu (dnd5e.js, cthulhu.js, rolemaster.js, runequest.js, rdd.js). 
Cela garantit des calculs dérivés étanches (PV selon le niveau, CA, emplacements de sorts D&D 5.0 vs Santé Mentale Cthulhu).

Les Configurations (rulesets.js) :
Supporte D&D 5e, Cthulhu 7e, Rolemaster, RuneQuest, Rêve de Dragon.
Utilise des types complexes comme relation-list pour les menus interactifs de sorts et talents.

🚧 5. ÉTAT DES MODULES
✅ Validés : 
- Univers (Mondes, Dieux & Panthéons, Calendriers & temps, Astrologie & Cieux Continents, Pays, Cités, Villages, Autres lieux, Océans & mers).
- Société (Guildes, Langues).
- Peuples (Races, langages, Classes, Capacités de classes, Sorts, Guildes, Sectes, Maledictions, Maladies, Monstres, animaux).
- Eléments du monde (Flore, Minéraux & Poudres, Matériaux d'artisanat, Objets, objets magiques, Potions, recettes de cuisine).
- Architecture Noyau : Formularires (EnhancedEntityForm/Detail) responsives, Modèles de stats (DynamicStats), UX immersive avec Portals (Popups de détails d'éléments), et Moteur de règles modulaire.

🚧 En cours : 
- Création des feuilles de personnages.
- Centralisation de la Magie interactive et intégration dans la génération des personnages.
- Centralisation des capacités de classes et intégration dans la génération des personnages.
- Centralisation des talents et options d'historiques et intégration dans la génération des personnages.
- Calculateur d'Arsenal automatique.
- VTT (Virtual TableTop) complexe.
- Carte du monde interactive (style google map en vue satellite).

⚠️ AVERTISSEMENT IA
"Nous codons un projet complexe. Ne prends aucune initiative qui réduirait la portée ou la qualité du code. Toujours fournir les blocs de code complets et respecter la séparation logique de l'architecture par dossiers définie ci-dessus."
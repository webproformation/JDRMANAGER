📜 RPG Manager - Document de Contexte (Le Moteur Ultime)
🏛️ 1. VISION DU PROJET : "LE MOTEUR ULTIME"
Transformation de l'application en un Moteur de JDR Universel & Agnostique. L'objectif est de gérer n'importe quel univers et système de règles sans recoder l'application.

Agnosticisme Total : Le moteur ne connaît pas les règles "en dur" ; il lit des configurations dynamiques.

Modularité des Règles : Décomposition du rulesets.js en fichiers indépendants par système (ex: src/data/ruleset_definitions/dnd5.js) pour une maintenance propre.

Pivot Dynamique : Utilisation d'un Hub de Liaison (src/data/ruleset_definitions/index.js) qui centralise et exporte les dictionnaires de règles.

Lore Profond : Gestion hiérarchique détaillée (Mondes > Continents > Pays > Villes > Lieux).

Secrets du MJ : Chaque entité possède une couche publique et une couche "MJ" sécurisée (onglet unifié sous l'identifiant id: 'gm').

Indépendance : Centralisation totale sur Supabase (PostgreSQL + JSONB).

Mode Solo "Héros" : Intégration d'une structure narrative permettant de jouer seul (style "Livre dont vous êtes le héros").

Système de Réputation Dynamique : Score évoluant selon la cohérence Actions/Alignement. Influence les réactions des PJ, esclaves et compagnons.

🛡️ 2. LOIS DE DÉVELOPPEMENT (INVIOLABLES)
🚫 RÈGLE 1 : AUCUNE SIMPLIFICATION : Interdiction formelle de condenser ou d'omettre le code.

📄 RÈGLE 2 : CODES INTÉGRAUX UNIQUEMENT : Toute modification doit être renvoyée sous forme de fichier complet.

🇫🇷 RÈGLE 3 : LANGUE : Toutes les interactions et documentations doivent être en français.

⚡ RÈGLE 4 : INTÉGRITÉ DES DONNÉES : Toute nouvelle table ou colonne doit posséder une valeur par défaut cohérente (ex: 'dnd5') pour éviter les ruptures d'affichage liées aux valeurs null.

🏗️ 3. ARCHITECTURE ET COMPOSANTS SPÉCIALISÉS
VTT-UI Kit (Standardisation) : Bibliothèque de composants atomiques (VTTSelect, VTTCounter, VTTButton) centralisant la logique des clics (stopPropagation), du graphisme Teal et des z-index.

Moteur de Formules (FormulaEngine) : Déplacement des calculs (CA, PV) en formules textes dans les rulesets (ex: "10 + @dex_mod") évaluées dynamiquement.

Gestion d'État Centralisée (Zustand) : Centralisation du système actif et de l'horloge pour une accessibilité globale sans "Prop Drilling".

Moteur d'Artisanat Interactif (CraftingEngineEditor) : Gère la création d'objets, potions, et recettes avec lien direct DB.

Horloge Mondiale (WorldClockControl) : Pilotage du temps réel avec affichage du système de règles actif.

Injecteur de Champs Dynamiques (RulesetDynamicFields) : * Lit le ruleset_id de l'entité.

Infecte les propriétés techniques (CA, PM, SAN) via entityType (ex: world, geo, region).

Impératif : Toujours utiliser une key={data.ruleset_id} pour forcer le re-rendu lors d'un changement de système.

Grimoire Arcanum Universalis (CharacterSpellbook) : Gestion intelligente des sorts par niveau et type.

Moteur de Tarots Magiques (TarotSystem) : Système dual de prédictions et de génération de sortilèges.

Interface Marchande (MerchantSystem) : Inventaire interactif pour l'achat/vente (style Skyrim).

Gestionnaire de Capacités & Dons (CharacterFeaturesEditor) : Synchronisation dynamique avec la DB.

Moteur d'Export PDF (pdfGenerator) : Génération de feuilles de personnage au millimètre.

⚙️ 4. LOGIQUE DES RÈGLES ET INFLUENCES (rulesEngine)
Synchronisation Realtime : Utilisation des Broadcasts Supabase pour mettre à jour les écrans des joueurs instantanément.

Fog of War du Lore : Filtrage dynamique des descriptions de fiches selon les stats (Intuition, Perception) de l'observateur.

Influences Cosmiques & Tarologiques : Calcul cumulatif des modificateurs.

Risques Arcaniques : Dégâts cérébraux et PV si dépassement des capacités lors du lancer de sort Tarot.

Mécanique de Cohérence : La réputation dicte la loyauté des accompagnateurs et la soumission des esclaves.

Deep Merge Security : Préservation absolue des objets JSON imbriqués lors des mises à jour (data: { ...prev.data, [key]: value }).

Sécurité Anti-Null/UUID : Le système doit gérer les ruleset_id mal formés ou vides en appliquant un fallback systématique sur 'dnd5'.

🚧 5. ÉTAT DES MODULES
✅ Validés (Terminés & Connectés)
Mondes & Continents : Refonte technique terminée. Injection dynamique des worldFields et geoFields fonctionnelle.

Base de Données : Migration SQL effectuée pour garantir 'dnd5' par défaut sur toutes les tables majeures.

Charte Graphique Unifiée : CSS Global (Teal Premium) et composants VTT-UI intégrés.

🚧 En cours (Refonte & Développement)
🔴 URGENCE PRIORITAIRE : Modularisation : Éclatement final du rulesets.js terminé, validation de la structure /ruleset_definitions/.

🔴 URGENCE PRIORITAIRE : Refonte des Entités : Migration progressive des layouts (Pays, Régions, Dieux, Sorts, Monstres, etc.) vers le système d'injection dynamique.

Système Solo & Réputation : Implémentation des triggers narratifs.

🎨 6. CHARTE GRAPHIQUE ET DESIGN SYSTEM (VTT PREMIUM)
Teal Premium (Vert d'Eau - #2dd4bf) : Couleur de référence interactive.

Compteurs Symétriques (.vtt-counter-container) : Boutons de 60px, zéro flèche native.

Sélecteurs Unifiés (.vtt-select) : Menus Teal avec gestion des clics prioritaire (z-index et stopPropagation).

Z-Index Standards : Footer de sauvegarde (z-[100]), menus déroulants (z-[80]), composants custom (z-30).

Standardisation du Lore : Remplacement systématique des champs texte par des dropdowns.

💡 8. PROTOCOLE DE DÉPANNAGE (RÉCENT)
Bloc invisible dans le formulaire ? Vérifier si le champ est déclaré dans la page (ex: WorldsPage.jsx) ET rendu dans le layout (ex: WorldForm.jsx).

Modification non enregistrée ? S'assurer que setFormData est passé au FieldRenderer et que le composant custom utilise bien l'objet data (JSONB).

Erreur "Message Channel" ? Souvent lié aux extensions navigateurs, mais vérifier les imports circulaires entre index.js et les fichiers de règles.

🔮 7. FEUILLE DE ROUTE (ROADMAP FUTUR)
Table Virtuelle (VTT) 3D : Intégration React Three Fiber.

Infrastructure Visio & Replay : Flux WebRTC auto-hébergé.

Marché des Arcanes : Écosystème E-Commerce pour modules et assets.

⚠️ AVERTISSEMENT IA
"Nous codons un projet complexe. Ne prends aucune initiative qui réduirait la portée ou la qualité du code. Toujours fournir les blocs de code complets et respecter la séparation logique de l'architecture. Le salut est dans le détail."
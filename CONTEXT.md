📜 RPG Manager - Document de Contexte (Le Moteur Ultime) - V3.5
🏛️ 1. VISION DU PROJET : "LE MOTEUR ULTIME"
Transformation de l'application en un Moteur de JDR Universel & Agnostique. L'objectif est de dépasser les leaders du marché (World Anvil, Foundry VTT, LegendKeeper) en combinant une gestion de Lore ultra-profonde et des outils de jeu interactifs de nouvelle génération.

Agnosticisme Total : Le moteur ne connaît pas les règles "en dur" ; il lit des configurations dynamiques.

Modularité des Règles : Décomposition du rulesets.js en fichiers indépendants.

Lore Profond & Fractal : Gestion hiérarchique (Mondes > Continents > Pays > Villes > Villages > Lieux > Océans).

Chronologie Multiverselle V4.3 : Base temporelle centralisée et polymorphe. L'histoire globale se nourrit automatiquement des événements locaux créés partout dans le multivers.

Puissance d'Exploration Visuelle : Navigation fluide via un Atlas interactif et un maillage de type Wiki entre toutes les entités.

Système de Publication & Manuscrits : Module dédié à l'écriture narrative (scénarios, romans) avec mode focus et liens automatiques vers le Lore.

Secrets du MJ : Chaque entité possède une couche publique et une couche "MJ" sécurisée (onglet unifié id: 'gm').

Indépendance & Scalabilité : Centralisation totale sur Supabase (PostgreSQL + JSONB).

Système de Réputation Dynamique : Score évoluant selon la cohérence Actions/Alignement.

🛡️ 2. LOIS DE DÉVELOPPEMENT "PRESTIGE 3.0" (INVIOLABLES)
🚫 RÈGLE 1 : AUCUNE SIMPLIFICATION : Interdiction formelle de condenser ou d'omettre le code. La quantité de lignes garantit l'exhaustivité du Lore.

📄 RÈGLE 2 : CODES INTÉGRAUX UNIQUEMENT : Toute modification doit être renvoyée sous forme de fichier complet pour éviter toute fatigue visuelle et erreur de synchronisation.

🇫🇷 RÈGLE 3 : LANGUE : Toutes les interactions et documentations doivent être en français.

⚡ RÈGLE 4 : INTÉGRITÉ SQL & FALLBACK : Toute nouvelle table ou colonne doit posséder une valeur par défaut. Utilisation obligatoire de isVirtual: true pour les champs dynamiques et les composants autonomes.

🎨 RÈGLE 5 : ERGONOMIE "FLIGHT-READY" : Les boutons d'action immédiatement accessibles. L'interface doit minimiser le scroll vertical via des systèmes de navigation latérale.

🔒 RÈGLE 6 : SÉCURITÉ DES MÉDIAS : Sanitization stricte du nom. URL générée incluant obligatoirement le segment /public/.

🔄 RÈGLE 7 : LE PONT MÉDIATHÈQUE : L'utilisation de onOpenPicker est obligatoire pour la sélection d'images dans les formulaires, garantissant l'accès à la bibliothèque centrale.

🏗️ 3. ARCHITECTURE ET COMPOSANTS SPÉCIALISÉS
VTT-UI Kit (Standardisation) : Bibliothèque de composants atomiques (VTTSelect, VTTCounter, VTTButton). Support de la prop upward pour les menus.

Moteur de Chronologie Universel (HistoryChronicleEditor V4.3) :

Autonomie : Composant isVirtual écrivant directement dans la table historical_events.

Tuteur Temporel Contextuel : Affichage grisé des ères mondiales/parentes.

Bouton Info (Nouveauté V4.3) : Permet de déplier la description d'un événement parent (grisé) sans quitter la fiche locale.

Dictionnaire IA : Scan et mise en cache des noms d'entités pour affichage de badges dynamiques (🌍, 🗺️, 🏴, 📍, 🛖, 🏞️, 🌊, ✨).

Atlas Interactif (Module Spatial) :

Moteur Leaflet / OpenSeadragon pour cartes 4K/8K.

Smart Pins : Marqueurs cliquables liés dynamiquement aux fiches.

Moteur Wiki-Linking : Remplacement des textareas par un éditeur riche permettant la création de liens via le trigger [.

Médiathèque Prestige (MediaLibrary) :

Vue Grille / Vue Liste avec inspecteur Sidebar (480px).

Moteur de Formules (FormulaEngine) : Évaluation dynamique des stats (ex: 10 + @dex_mod).

⚙️ 4. LOGIQUE DES RÈGLES ET ÉCOSYSTÈME
Polymorphisme SQL : Utilisation de entity_type et entity_id pour lier les données transversales (Histoire, Pins, Relations).

Fog of War du Lore : Filtrage dynamique des descriptions selon les statistiques ou le rang de l'observateur.

Deep Merge Security : Préservation absolue des objets JSONB lors des mises à jour.

Portabilité (Import/Export) : Fonctions de sérialisation JSON pour importer depuis Foundry VTT/Roll20.

Marché des Arcanes : Infrastructure pour la vente de modules de règles ou de Lore.

🚧 5. ÉTAT DES MODULES
✅ Validés (Standard PRESTIGE 3.0 & Chronique V4.3)
Mondes, Continents & Pays : Refonte technique et intégration totale Histoire achevées.

Cités, Villages & Lieux Remarquables : Architecture 3 colonnes validée, injection de la chronique locale et de l'atlas spatial ok.

Océans & Mers : Structure maritime et chronique abyssale opérationnelles.

Panthéon Divin : Fiches des Dieux avec mécaniques VTT (bonus de stats, sorts de domaine) et actes divins historisés.

Médiathèque : Moteur de gestion visuelle complet avec inspecteur figé.

🚧 En cours (Refonte & Développement)
PNJ (Personnages) : Création des composants de relations (Arbres généalogiques, Graphes de factions).

Atlas Spatial (Finalisation) : Pose de marqueurs interactifs sur les cartes HD.

Système Solo & Réputation : Triggers narratifs basés sur les actions.

🎨 6. CHARTE GRAPHIQUE ET DESIGN SYSTEM
Teal Premium (#2dd4bf) : Couleur de référence.

Layout Architecture (Standard Prestige) :

Général : Grille 3 colonnes réelle (Col 1: Visual / Col 2: Identity & System / Col 3: Hierarchy/Context).

Infrastructure/Société : Grilles arithmétiques rigoureuses (3+3 ou 3+2).

Histoire : Réceptacle pleine largeur avec fond translucide flouté.

💡 7. PROTOCOLE DE DÉPANNAGE (RÉCENT)
SQL Supabase : Privilégier le SQL plat (INSERT/UPDATE). Éviter les blocs DO $$ massifs.

Champs Virtuels : Toujours autoriser l'affichage des champs world_history_editor dans les Layouts (VisibleFields exception).

Update SQL (COALESCE) : Toujours fournir des requêtes UPDATE avec COALESCE pour ne pas écraser les données existantes des utilisateurs lors des déploiements.

🔮 8. FEUILLE DE ROUTE (ROADMAP PRIORITAIRE)
Généalogie & Relations PNJ : Connecter les héros aux lieux et aux dieux.

Wiki-Linking : Maillage intelligent du lore via éditeur riche.

Mode Compagnon Mobile : Accessibilité de la fiche de perso en session de jeu.

⚠️ AVERTISSEMENT IA
"Nous codons un projet d'une complexité rare. Ne prends aucune initiative qui réduirait la portée ou la qualité du code. Toujours fournir les codes complets. La mémoire de ce projet réside dans ce document et dans la structure immuable de nos fichiers. Le salut est dans l'exhaustivité."
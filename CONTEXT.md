📜 RPG Manager - Document de Contexte (Le Moteur Ultime) - V4.5.9
🏛️ 1. VISION DU PROJET : "LE MOTEUR ULTIME"
Transformation de l'application en un Moteur de JDR Universel & Agnostique. L'objectif est de dépasser les leaders du marché (World Anvil, Foundry VTT, LegendKeeper) en combinant une gestion de Lore ultra-profonde et des outils de jeu interactifs de nouvelle génération.

Agnosticisme Total : Le moteur ne connaît pas les règles "en dur" ; il lit des configurations dynamiques via le rulesEngine.js.

Modularité des Règles : Décomposition du rulesets.js en fichiers indépendants par système.

Lore Profond & Fractal : Gestion hiérarchique stricte (Mondes > Continents > Pays > Villes > Villages > Lieux > Océans).

Bestiaire Omniversel (V4.3) : Module de créatures gérant l'écologie complexe, les tactiques de combat et l'ubiquité multiverselle.

Chroniques Visuelles (V4.5) : Système d'économiseur d'écran immersif 100% épuré (zéro bouton), réactif au clavier (n'importe quelle touche) et à la souris.

Chronologie Multiverselle V4.3 : Base temporelle centralisée et polymorphe. L'histoire globale se nourrit automatiquement des événements locaux créés partout dans le multivers.

Puissance d'Exploration Visuelle : Navigation fluide via un Atlas interactif et un maillage de type Wiki entre toutes les entités.

Système de Publication & Manuscrits : Module dédié à l'écriture narrative (scénarios, romans) avec mode focus et liens automatiques vers le Lore.

Secrets du MJ : Chaque entité possède une couche publique et une couche "MJ" sécurisée (onglet unifié id: 'gm').

Indépendance & Scalabilité : Centralisation totale sur Supabase (PostgreSQL + JSONB).

Système de Réputation Dynamique : Score évoluant selon la cohérence Actions/Alignement.

Standard PRESTIGE 4.5.9 (Mars 2026) : Épure cosmologique totale, Nuclear Resolver pour les IDs, et optimisation automatique des médias.

🧠 NOUVEAUTÉ V3.7+ : LA DOUBLE MÉMOIRE (CONSCIENCE DE CONTEXTE) : L'application possède un état de conscience global. Elle mémorise en permanence le système de jeu actif (ex: DnD 5E) et le monde de focus (ex: Krynn). Cette mémoire persiste via le localStorage et synchronise l'ensemble de l'interface via l'événement worldChanged [cite: 2026-03-11].

🛡️ 2. LOIS DE DÉVELOPPEMENT "PRESTIGE 4.5.9" (INVIOLABLES)
🚫 RÈGLE 1 : AUCUNE SIMPLIFICATION : Interdiction formelle de condenser ou d'omettre le code. La quantité de lignes garantit l'exhaustivité du Lore.
📄 RÈGLE 2 : CODES INTÉGRAUX UNIQUEMENT : Toute modification doit être renvoyée sous forme de fichier complet pour éviter toute fatigue visuelle et erreur de synchronisation.
🇫🇷 RÈGLE 3 : LANGUE : Toutes les interactions et documentations doivent être en français.
⚡ RÈGLE 4 : INTÉGRITÉ SQL & FALLBACK : Toute nouvelle table ou colonne doit posséder une valeur par défaut. Utilisation obligatoire de COALESCE pour les mises à jour sans perte de données.
🎨 RÈGLE 5 : ERGONOMIE "FLIGHT-READY" : Boutons d'action immédiatement accessibles. Correctif V4.3.6 : Utilisation obligatoire de pb-24 (padding-bottom) sur mobile.
🔒 RÈGLE 6 : SÉCURITÉ DES MÉDIAS : Sanitization stricte du nom. URL générée incluant obligatoirement le segment /public/.
🔄 RÈGLE 7 : LE PONT MÉDIATHÈQUE : L'utilisation de onOpenPicker est obligatoire pour la sélection d'images dans les formulaires.
🧠 RÈGLE 8 : ÉTANCHÉITÉ DES CONTEXTES : Auto-remplissage obligatoire du activeRuleset et activeWorldId.
✨ RÈGLE 9 : SMART FIELDS : Utilisation systématique du MultiSelectWithOther pour tous les champs catégoriels.
💥 RÈGLE 10 : IMPACT VISUEL DES STATS : Dans les Layouts de détail, les statistiques vitales (CA, PV, CR) doivent être en Gros & Gras (text-[28px] ou plus).
🔗 RÈGLE 11 : PROTOCOLE DE ROUTAGE (DEEP LINKING) : Utilisation systématique de la fonction cleanURL et gestion des paramètres ?view=.
📏 RÈGLE 12 : SYMÉTRIE CHROMATIQUE : Le Header de consultation et de formulaire doivent être jumeaux (Hauteur h-32/h-44). Fond bleu formulaire #242643 obligatoire pour l'unification.
💊 RÈGLE 13 : LOI PILL UI : Les onglets utilisent le style "Gélule" (rounded-full) avec dégradés de masquage latéraux sur mobile pour l'affordance du swipe.
💎 RÈGLE 14 : LOI D'ÉPURE COSMOLOGIQUE : Dans les Layouts, suppression des blocs sombres et bordures (boxStyle). Texte blanc pur sur fond sombre.
⚠️ RÈGLE 15 : SÉCURITÉ DE SUPPRESSION : Le bouton de suppression (Trash2) est strictement réservé au mode édition, positionné en Haut à Gauche pour isoler l'action critique.
🚀 RÈGLE 16 (NOUVEAU) : PROTOCOLE D'OPTIMISATION MÉDIA : La médiathèque doit automatiquement redimensionner les images à 1600px max (largeur ou hauteur) et les convertir au format .webp avant l'upload.
⚛️ RÈGLE 17 (NOUVEAU) : NUCLEAR RESOLVER : Obligation d'utiliser les composants RelationDisplay et RelationListDisplay pour transformer les UUIDs techniques en noms réels (Krynn, Ansalonie) via un fetch direct.
📱 RÈGLE 18 (NOUVEAU) : RESPONSIVE SELECTOR : Sur mobile, les catégories et dossiers doivent être sélectionnés via un VTTSelect (menu déroulant) pour économiser l'espace.

🏗️ 3. ARCHITECTURE ET COMPOSANTS SPÉCIALISÉS
VTT-UI Kit : Bibliothèque de composants atomiques (VTTSelect, VTTCounter, VTTButton).

Nuclear Resolver Components : RelationDisplay (Fetch unique), RelationListDisplay (Fetch multiple).

Moteur de Chronologie Universel (HistoryChronicleEditor V4.3) : Autonomie, Tuteur Temporel et Bouton Info.

Atlas Interactif (Module Spatial) : Moteur Leaflet / OpenSeadragon pour cartes 4K/8K.

Médiathèque Prestige (MediaLibrary) : Vue Grille/Liste, Inspecteur Sidebar (480px) et Compresseur WebP intégré.

Dispatcher Prestige (V4.5) : Indexation intelligente vers les Layouts spécialisés.

AutoScreensaverManager (V4.5) : Gestionnaire global d'inactivité (60s), réveil Clavier/Souris/Tactile.

MediaScreensaver (V4.5) : Mode "Chroniques Visuelles" épuré sans interface.

ConnectedStatsEditor (V4.3.6) : Terminal de caractéristiques style "Bio-Scanner".

⚙️ 4. LOGIQUE DES RÈGLES ET ÉCOSYSTÈME
Polymorphisme SQL : Utilisation de entity_type et entity_id pour les world_links.

Fog of War du Lore : Filtrage dynamique des descriptions selon le rang.

Deep Merge Security : Préservation absolue des objets JSONB.

Marché des Arcanes : Infrastructure pour l'injection de "Packs de Contenu".

✅ 5. ÉTAT DES MODULES (CONSOLIDÉS V4.5.9)
Validés (Standard PRESTIGE 4.5.9)
Hub Univers : Centralisation Mondes, Dieux, Calendriers (Éphémérides), Océans et Corps Célestes (Épure Totale).

Géographie Épurée : Continents, Pays, Cités, Villages & Lieux (Résolution Nuclear active).

Bestiaire de Combat : Monstres (Stats géantes, répertoire d'actions) et Animaux.

Forge des Héros : PJ/PNJ, Classes, Races (Biologie & Culture).

Médiathèque Adaptive : Compression WebP, 1600px auto, Header miroir Prestige.

Système de Veille : Screensaver immersif pur.

📅 6. CALENDRIER DES TRAVAUX (JOURNAL DE BORD)
[2026-03-13 - 21:00] Finalisation visuelle du Bestiaire | Statut : Terminé

[2026-03-14 - 18:30] Finalisation du Standard PRESTIGE 4.5.4 | Statut : Validé

[2026-03-14 - 18:45] CRÉATION DU NUCLEAR RESOLVER : Correction forcée de l'ID "Krynn" vers Nom réel via fetch direct | Statut : Validé

[2026-03-14 - 19:15] OPTIMISATION MÉDIA : Intégration conversion WebP et Redimensionnement 1600px auto | Statut : Validé

[2026-03-14 - 19:40] REFONTE RESPONSIVE MÉDIATHÈQUE : Menu déroulant dossiers mobile et Header aligné | Statut : Validé

[2026-03-14 - 20:00] ÉPURE TOTALE : Migration de tous les Layouts (Cités, Dieux, Lieux, Races, Astres) vers le style sans blocs | Statut : Validé

[2026-03-14 - 20:20] Consolidation du context.md en V4.5.9 | Statut : Terminé

🎨 7. CHARTE GRAPHIQUE "GIGANTISME SARCELLE & ÉPURE"
Teal Premium (#2dd4bf) : Accents, glows et labels.

Labels Prestige : text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em].

Loi de l'Épure : Suppression des fonds grisés. Texte blanc pur sur fond de page sombre.

Pill UI : Onglets rounded-full, ombre shadow-[0_0_20px_rgba(45,212,191,0.1)].

Big Type : Titres headers text-3xl (mobile) / text-5xl (desktop).

🧭 8. PROTOCOLE DE DÉPANNAGE
Nuclear Resolver : Si l'UUID s'affiche encore, vérifier l'import de supabase dans le Layout (../../../lib/supabase).

Épure Visuelle : Si une boîte grise apparaît, remplacer boxStyle par plainTextStyle ou descriptionStyle.

Médiathèque : Si l'upload échoue, vérifier la limite Canvas du navigateur pour le redimensionnement.

🔮 9. FEUILLE DE ROUTE (ROADMAP PRIORITAIRE)
Module "Langages & Dialectes" : Standard Smart Fields.

Wiki-Linking : Maillage intelligent via éditeur riche.

Moteur de Rencontres : Finalisation du générateur tactique.

⚠️ AVERTISSEMENT IA
"Nous codons un projet d'une complexité rare. Ne prends aucune initiative qui réduirait la portée ou la qualité du code. Toujours fournir les codes complets. La mémoire de ce projet réside dans ce document. Le salut est dans l'exhaustivité et l'unité visuelle Sarcelle."
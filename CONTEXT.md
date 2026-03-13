📜 RPG Manager - Document de Contexte (Le Moteur Ultime) - V4.3
🏛️ 1. VISION DU PROJET : "LE MOTEUR ULTIME"
Transformation de l'application en un Moteur de JDR Universel & Agnostique. L'objectif est de dépasser les leaders du marché (World Anvil, Foundry VTT, LegendKeeper) en combinant une gestion de Lore ultra-profonde et des outils de jeu interactifs de nouvelle génération.

Agnosticisme Total : Le moteur ne connaît pas les règles "en dur" ; il lit des configurations dynamiques via le rulesEngine.js.

Modularité des Règles : Décomposition du rulesets.js en fichiers indépendants par système.

Lore Profond & Fractal : Gestion hiérarchique stricte (Mondes > Continents > Pays > Villes > Villages > Lieux > Océans).

Bestiaire Omniversel (V4.2) : Module de créatures gérant l'écologie complexe, les tactiques de combat et l'ubiquité multiverselle.

Chroniques Visuelles (V4.3) : Système d'économiseur d'écran immersif faisant défiler les archives de la médiathèque sous forme de photos physiques (bord blanc, rotation aléatoire, superposition).

Chronologie Multiverselle V4.3 : Base temporelle centralisée et polymorphe. L'histoire globale se nourrit automatiquement des événements locaux créés partout dans le multivers.

Puissance d'Exploration Visuelle : Navigation fluide via un Atlas interactif et un maillage de type Wiki entre toutes les entités.

Système de Publication & Manuscrits : Module dédié à l'écriture narrative (scénarios, romans) avec mode focus et liens automatiques vers le Lore.

Secrets du MJ : Chaque entité possède une couche publique et une couche "MJ" sécurisée (onglet unifié id: 'gm').

Indépendance & Scalabilité : Centralisation totale sur Supabase (PostgreSQL + JSONB).

Système de Réputation Dynamique : Score évoluant selon la cohérence Actions/Alignement.

🧠 NOUVEAUTÉ V3.7+ : LA DOUBLE MÉMOIRE (CONSCIENCE DE CONTEXTE) : L'application possède un état de conscience global. Elle mémorise en permanence le système de jeu actif (ex: DnD 5E) et le monde de focus (ex: Krynn). Cette mémoire persiste via le localStorage et synchronise l'ensemble de l'interface via l'événement worldChanged [cite: 2026-03-11].

🛡️ 2. LOIS DE DÉVELOPPEMENT "PRESTIGE 4.3" (INVIOLABLES)
🚫 RÈGLE 1 : AUCUNE SIMPLIFICATION : Interdiction formelle de condenser ou d'omettre le code. La quantité de lignes garantit l'exhaustivité du Lore.

📄 RÈGLE 2 : CODES INTÉGRAUX UNIQUEMENT : Toute modification doit être renvoyée sous forme de fichier complet pour éviter toute fatigue visuelle et erreur de synchronisation.

🇫🇷 RÈGLE 3 : LANGUE : Toutes les interactions et documentations doivent être en français.

⚡ RÈGLE 4 : INTÉGRITÉ SQL & FALLBACK : Toute nouvelle table ou colonne doit posséder une valeur par défaut. Utilisation obligatoire de COALESCE pour les mises à jour sans perte de données.

🎨 RÈGLE 5 : ERGONOMIE "FLIGHT-READY" : Boutons d'action immédiatement accessibles. Minimisation du scroll vertical via des systèmes de navigation latérale. Correctif V4.3 : Utilisation obligatoire de pt-24 sur mobile pour libérer l'espace des boutons de navigation.

🔒 RÈGLE 6 : SÉCURITÉ DES MÉDIAS : Sanitization stricte du nom. URL générée incluant obligatoirement le segment /public/.

🔄 RÈGLE 7 : LE PONT MÉDIATHÈQUE : L'utilisation de onOpenPicker est obligatoire pour la sélection d'images dans les formulaires.

🧠 RÈGLE 8 : ÉTANCHÉITÉ DES CONTEXTES : Tout nouveau formulaire doit obligatoirement s'auto-remplir avec le activeRuleset et le activeWorldId en mémoire [cite: 2026-03-11].

✨ RÈGLE 9 : SMART FIELDS : Utilisation systématique du MultiSelectWithOther pour tous les champs catégoriels avec suggestions contextuelles (Types de monstres, Tailles, Habitats, Régimes, etc.).

💥 RÈGLE 10 : IMPACT VISUEL DES STATS : Dans les Layouts de détail, les statistiques vitales (CA, PV, CR) doivent être affichées en Gros & Gras (text-[28px] ou plus, font-black) avec l'accent Sarcelle.

🏗️ 3. ARCHITECTURE ET COMPOSANTS SPÉCIALISÉS
VTT-UI Kit : Bibliothèque de composants atomiques (VTTSelect, VTTCounter, VTTButton). Support de la prop upward pour les menus.

Moteur de Chronologie Universel (HistoryChronicleEditor V4.3) :

Autonomie : Composant isVirtual écrivant directement dans la table historical_events.

Tuteur Temporel : Affichage grisé des ères mondiales/parentes.

Bouton Info : Dépliage de la description d'un événement parent sans quitter la fiche locale.

Atlas Interactif (Module Spatial) : Moteur Leaflet / OpenSeadragon pour cartes 4K/8K. Smart Pins liés dynamiquement.

Médiathèque Prestige (MediaLibrary) : Vue Grille / Vue Liste avec inspecteur Sidebar (480px).

Dispatcher Prestige (V4.2) : Le fichier index.jsx des formulaires et détails agit comme un aiguillage intelligent vers les Layouts spécialisés par tableName.

AutoScreensaverManager (V4.3) : Gestionnaire global d'inactivité (60s) déclenchant l'économiseur d'écran en fondu.

MediaScreensaver (V4.3) : Composant immersif de type "Chroniques Visuelles". Affiche les images de la table media_items avec un cadre blanc léger (p-2), sans arrondi, et une rotation aléatoire importante (±30°).

⚙️ 4. LOGIQUE DES RÈGLES ET ÉCOSYSTÈME
Polymorphisme SQL : Utilisation de entity_type et entity_id pour lier les données transversales (ex: world_links).

Fog of War du Lore : Filtrage dynamique des descriptions selon le rang de l'observateur ou les stats du personnage.

Deep Merge Security : Préservation absolue des objets JSONB lors des mises à jour.

Marché des Arcanes : Infrastructure pour l'injection de "Packs de Contenu" pré-paramétrés par système [cite: 2026-03-11].

✅ 5. ÉTAT DES MODULES (CONSOLIDÉS V4.3)
Validés (Standard PRESTIGE 4.3)
Hub Univers consolidé : Centralisation de Mondes, Dieux, Calendriers, Océans et Astrologie.

Géographie Fractale : Continents, Pays, Cités, Villages & Lieux (Grilles 3+3 ou 3+2).

Bestiaire Omniversel : Fiches Monstres avec stats combat impactantes, écologie intelligente et gestion GM (tactiques).

Races & Peuples : Morphologie, Traits et Psychologie standardisés.

Médiathèque : Moteur de gestion visuelle complet et module Chroniques Visuelles.

Paramètres Utilisateur : Page de profil sécurisée avec toggle pour l'économiseur automatique et correctif mobile pt-24.

📅 6. CALENDRIER DES TRAVAUX (JOURNAL DE BORD)
[2026-03-13 - 21:00] Finalisation visuelle du Bestiaire (Layouts, Formulaires, Dispatcher) | Statut : Terminé & Validé

[2026-03-13 - 22:15] Création du module MediaScreensaver (Chroniques Visuelles) - Style physique argentique | Statut : Terminé & Validé

[2026-03-13 - 22:30] Développement du AutoScreensaverManager (Inactivité 60s) & Correctif Mobile UserSettingsPage (pt-24) | Statut : Terminé & Validé

[2026-03-13 - 22:50] Optimisation MediaScreensaver (Angle ±30°, Taille augmentée, Cadre p-2, Ombre 0.7) | Statut : Terminé & Validé

[2026-03-13 - 23:15] Mise à jour du context.md (V4.3) avec restauration de l'exhaustivité et calendrier format liste | Statut : Terminé & Validé

🎨 7. CHARTE GRAPHIQUE "GIGANTISME SARCELLE"
Teal Premium (#2dd4bf) : Couleur de référence pour les accents, glows et labels.

Labels Prestige : text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em].

BoxStyle : bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 p-3 shadow-inner.

Scrollbars Prestige : Barres de 5px, vert d'eau, fondu invisible (scrollbar-gutter: stable).

Chroniques Visuelles : Photos sans arrondi, cadre blanc fin (p-2), ombre portée massive (rgba(0,0,0,0.7)).

🧭 8. PROTOCOLE DE DÉPANNAGE
SQL Supabase : Privilégier le SQL plat. Vérifier l'existence des colonnes avant UPDATE.

Navigation / Warp Zone : Si une URL renvoie "Zone Inexplorée", vérifier l'alias dans le switch de App.jsx.

Synchronisation du Monde : Vérifier l'émission de window.dispatchEvent(new Event('worldChanged')).

Simplification Interdite : Si le code est réduit, faire un "Reset Contexte : Prestige 4.3".

🔮 9. FEUILLE DE ROUTE (ROADMAP PRIORITAIRE)
Module "Langages & Dialectes" : Application du standard Smart Fields.

Classes & Évolutions : Gestion des niveaux et arbres de compétences.

Wiki-Linking : Maillage intelligent du lore via éditeur riche (Trigger [).

⚠️ AVERTISSEMENT IA
"Nous codons un projet d'une complexité rare. Ne prends aucune initiative qui réduirait la portée ou la qualité du code. Toujours fournir les codes complets. La mémoire de ce projet réside dans ce document et dans la section 'Calendrier des Travaux'. Le salut est dans l'exhaustivité et l'unité visuelle Sarcelle."
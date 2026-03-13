📜 RPG Manager - Document de Contexte (Le Moteur Ultime) - V3.7
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

🧠 NOUVEAUTÉ V3.7 : LA DOUBLE MÉMOIRE (CONSCIENCE DE CONTEXTE) : L'application possède désormais un état de conscience global. Elle mémorise en permanence le système de jeu actif (ex: DnD 5E) et le monde de focus (ex: Krynn) [cite: 2026-03-11]. Cette mémoire persiste via le localStorage et synchronise l'ensemble de l'interface [cite: 2026-03-11].

🛡️ 2. LOIS DE DÉVELOPPEMENT "PRESTIGE 3.0" (INVIOLABLES)
🚫 RÈGLE 1 : AUCUNE SIMPLIFICATION : Interdiction formelle de condenser ou d'omettre le code. La quantité de lignes garantit l'exhaustivité du Lore.

📄 RÈGLE 2 : CODES INTÉGRAUX UNIQUEMENT : Toute modification doit être renvoyée sous forme de fichier complet pour éviter toute fatigue visuelle et erreur de synchronisation.

🇫🇷 RÈGLE 3 : LANGUE : Toutes les interactions et documentations doivent être en français.

⚡ RÈGLE 4 : INTÉGRITÉ SQL & FALLBACK : Toute nouvelle table ou colonne doit posséder une valeur par défaut. Utilisation obligatoire de isVirtual: true pour les champs dynamiques et les composants autonomes.

🎨 RÈGLE 5 : ERGONOMIE "FLIGHT-READY" : Les boutons d'action immédiatement accessibles. L'interface doit minimiser le scroll vertical via des systèmes de navigation latérale.

🔒 RÈGLE 6 : SÉCURITÉ DES MÉDIAS : Sanitization stricte du nom. URL générée incluant obligatoirement le segment /public/.

🔄 RÈGLE 7 : LE PONT MÉDIATHÈQUE : L'utilisation de onOpenPicker est obligatoire pour la sélection d'images dans les formulaires, garantissant l'accès à la bibliothèque centrale.

🧠 RÈGLE 8 : ÉTANCHÉITÉ DES CONTEXTES : Tout nouveau formulaire doit obligatoirement s'auto-remplir avec le activeRuleset et le activeWorldId stockés en mémoire [cite: 2026-03-11].

🏗️ 3. ARCHITECTURE ET COMPOSANTS SPÉCIALISÉS
VTT-UI Kit (Standardisation) : Bibliothèque de composants atomiques (VTTSelect, VTTCounter, VTTButton). Support de la prop upward pour les menus.

Moteur de Chronologie Universel (HistoryChronicleEditor V4.3) :

Autonomie : Composant isVirtual écrivant directement dans la table historical_events.

Tuteur Temporel Contextuel : Affichage grisé des ères mondiales/parentes.

Bouton Info (Nouveauté V4.3) : Permet de déplier la description d'un événement parent (grisé) sans quitter la fiche locale.

Atlas Interactif (Module Spatial) :

Moteur Leaflet / OpenSeadragon pour cartes 4K/8K.

Smart Pins : Marqueurs cliquables liés dynamiquement aux fiches.

Moteur Wiki-Linking : Remplacement des textareas par un éditeur riche permettant la création de liens via le trigger [.

Médiathèque Prestige (MediaLibrary) : Vue Grille / Vue Liste avec inspecteur Sidebar (480px).

🧭 Navigation Focus (V3.7) : Barre latérale adaptative intégrant un indicateur de focus permanent. Elle affiche le logo du système et le nom du monde actif, mis à jour en temps réel via l'événement global worldChanged.

🛡️ App-Protector (Routage) : Système de routage intelligent dans App.jsx incluant des alias de sécurité (/worlds-hub, /continents-hub) pour rediriger automatiquement les anciens liens vers les nouveaux hubs consolidés.

⚙️ 4. LOGIQUE DES RÈGLES ET ÉCOSYSTÈME
Polymorphisme SQL : Utilisation de entity_type et entity_id pour lier les données transversales.

Fog of War du Lore : Filtrage dynamique des descriptions selon les statistiques ou le rang de l'observateur.

Deep Merge Security : Préservation absolue des objets JSONB lors des mises à jour.

Marché des Arcanes : Infrastructure pour la vente de modules. L'architecture supporte désormais l'injection de "Packs de Contenu" pré-paramétrés par système [cite: 2026-03-11].

🚧 5. ÉTAT DES MODULES
✅ Validés (Standard PRESTIGE 3.0 & Chronique V4.3)
Hub Univers consolidé : Centralisation de Mondes, Dieux, Calendriers, Océans et Astrologie dans une interface à tuiles dynamiques.

Mondes, Continents & Pays : Refonte technique et intégration totale Histoire achevées.

Cités, Villages & Lieux Remarquables : Architecture 3 colonnes validée.

Océans & Mers : Structure maritime opérationnelle.

Panthéon Divin : Fiches des Dieux avec mécaniques VTT.

Médiathèque : Moteur de gestion visuelle complet.

Hub Métiers & Commerces : Interface prête pour Marchands, Artisans, Aubergistes, Alchimistes et Maîtres.

Hub Campagnes & Combats : Gestion des scénarios et des rencontres.

🚧 À Finaliser (Mise au Standard du Lore Restant)
Il reste à régler l'affichage interactif pour :

Races, Langages, Classes, Capacités, Sorts, Dons.

Guildes, Sectes.

Malédictions, Maladies.

Monstres, Animaux, Flore, Minéraux, Objets.

🚧 En cours (Refonte & Développement)
Responsive Design Global : Finalisation du design adaptatif des listes et formulaires.

PNJ (Personnages) : Création des composants de relations.

Atlas Spatial (Finalisation) : Pose de marqueurs interactifs sur les cartes HD.

🎨 6. CHARTE GRAPHIQUE ET DESIGN SYSTEM
Teal Premium (#2dd4bf) : Couleur de référence pour les accents et les glows.

Scrollbars Prestige : Barres de défilement ultra-fines (5px), vert d'eau, avec fondu invisible pour préserver le Glassmorphism.

Layout Architecture : Grilles arithmétiques rigoureuses (3+3 ou 3+2) et conteneurs avec scrollbar-gutter: stable pour éviter les sauts d'interface.

💡 7. PROTOCOLE DE DÉPANNAGE (RÉCENT)
SQL Supabase : Privilégier le SQL plat (INSERT/UPDATE).

Navigation / Warp Zone : Si une URL renvoie "Zone Inexplorée", vérifier l'alias dans le switch de App.jsx.

Synchronisation du Monde : Si le focus monde ne change pas, vérifier l'émission de window.dispatchEvent(new Event('worldChanged')) dans EntityList.jsx ou App.jsx.

🔮 8. FEUILLE DE ROUTE (ROADMAP PRIORITAIRE)
Finalisation du Lore Interactif : Appliquer le design 3 colonnes aux entités restantes (Races, Sorts, etc.).

Module "Livres & Savoirs" : Gestion des types (romans, grimoires) et apprentissage.

Classes Spéciales de PNJ / Gestions de Commerces : Marchands, Artisans, Aubergistes (Gestion d'inventaires et ateliers).

Maîtres d'apprentissage : Règles spéciales pour la transmission de compétences et le temps nécessaire.

Généalogie & Relations PNJ : Connecter les héros aux lieux et factions.

Wiki-Linking : Maillage intelligent du lore via éditeur riche.

⚠️ AVERTISSEMENT IA
"Nous codons un projet d'une complexité rare. Ne prends aucune initiative qui réduirait la portée ou la qualité du code. Toujours fournir les codes complets. La mémoire de ce projet réside dans ce document et dans la structure immuable de nos fichiers. Le salut est dans l'exhaustivité."
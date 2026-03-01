🏛️ 1. VISION DU PROJET : "LE MOTEUR ULTIME"
Transformation de l'application en un Moteur de JDR Universel & Agnostique. L'objectif est de gérer n'importe quel univers et système de règles sans recoder l'application.

Agnosticisme : Le moteur ne connaît pas les règles "en dur" ; il lit des configurations dynamiques (rulesets.js).

Lore Profond : Gestion hiérarchique détaillée (Mondes > Continents > Pays > Villes > Lieux).

Secrets du MJ : Chaque entité possède une couche publique et une couche "MJ" sécurisée (onglet unifié sous l'identifiant id: 'gm').

Indépendance : Centralisation totale sur Supabase (PostgreSQL + JSONB).

🛡️ 2. LOIS DE DÉVELOPPEMENT (INVIOLABLES)

🚫 RÈGLE 1 : AUCUNE SIMPLIFICATION : Interdiction formelle de condenser ou d'omettre le code. Chaque propriété et bloc logique doit être écrit de manière explicite.

📄 RÈGLE 2 : CODES INTÉGRAUX UNIQUEMENT : Toute modification doit être renvoyée sous forme de fichier complet. Les commentaires de type // ... reste du code sont interdits.

🏗️ 3. ARCHITECTURE ET COMPOSANTS SPÉCIALISÉS
L'application repose sur une architecture modulaire où chaque grande fonctionnalité dispose de son propre éditeur intelligent :

Moteur d'Artisanat Interactif (CraftingEngineEditor) : Gère la création d'objets, potions, et recettes avec lien direct DB et filtrage intelligent.

Horloge Mondiale (WorldClockControl) : Pilotage du temps réel (Année, Mois, Jour, Heure) avec débordement intelligent et affichage du système de règles actif.

Éditeur de Calendrier (CalendarConfigEditor) : Définition de calendriers uniques par monde.

Injecteur de Champs Dynamiques (RulesetDynamicFields) : Permet d'injecter des propriétés techniques spécifiques au système choisi (ex: CA, PM, SAN) dans n'importe quelle entité.

Grimoire Arcanum Universalis (CharacterSpellbook) : Gestion intelligente des sorts par classe et niveau, distinction entre sorts Appris, Connus et Préparés, et gestion des rituels/concentration.

Gestionnaire de Capacités & Dons (CharacterFeaturesEditor) : Synchronisation dynamique avec la base de données (races, classes, niveaux) pour automatiser l'ajout de traits, dons et maîtrises directement sur la fiche du personnage.

Moteur d'Export PDF (pdfGenerator) : Génération de feuilles de personnage au millimètre avec intégration de polices personnalisées (Google Fonts) et dessin géométrique dynamique. Le moteur est "intelligent" : il convertit automatiquement les UUIDs de la base de données (Races, Classes, Sous-classes) en texte lisible et aplatit les structures de données complexes (comme le Grimoire VTT) en listes formatées.

Séparation des Responsabilités (UI/Logique) : Fin des "God Components". Les configurations d'affichage complexes (comme la fiche de personnage) sont isolées dans des fichiers dédiés (ex: CharactersConfig.jsx) pour permettre une adaptation fluide à n'importe quel système de jeu (D&D, Cthulhu, etc.) sans surcharger le composant principal.

⚙️ 4. LOGIQUE DES RÈGLES ET INFLUENCES (rulesEngine)
Le moteur a été étendu pour gérer la simultanéité des influences :

Système d'Horoscope & Influences Cosmiques : Calcul cumulatif (Natal + Annuel + Mensuel + Quotidien + Horaire) avec injection d'un modificateur global en pourcentage (%) sur les statistiques du personnage.

Structure du rulesEngine : Mathématiques isolées par jeu (dnd5, cthulhu, etc.) calculant automatiquement les statistiques dérivées (CA via inventaire, Initiative, DD de sauvegarde, Perception Passive).

Assistant d'Ascension (LevelUpWizard) : Moteur de progression lisant le rulesEngine pour calculer automatiquement les nouveaux Points de Vie (Dés de Vie + Modificateurs) et injecter les nouvelles capacités de classe lors d'un passage de niveau. 

Sécurité des Données : Utilisation de fusions profondes (Deep Merge) lors de la mise à jour des statistiques pour garantir la préservation absolue des objets JSON imbriqués (Grimoire, Arsenal, Inventaire).

🚧 5. ÉTAT DES MODULES
✅ Validés :

Univers : Mondes (avec Horloge et Calendrier), Dieux, Astrologie & Corps Célestes, Géographie complète (Continents, Pays, Océans).

Système de Temps : Calendriers personnalisés, écoulement du temps MJ, influences astrales synchronisées en temps réel sur la fiche personnage.

Société & Peuples : Guildes, Langues, Sectes, Races (avec éditeur de bonus), Classes, Capacités.

Encyclopédie Technique : Sorts (système complet), Monstres (avec éditeur de stats), Animaux, Maladies, Malédictions.

Économie & Artisanat : Flore, Minéraux, Matériaux, Objets, Potions, Recettes de cuisine (avec moteurs VTT dédiés).

Moteur de Naissance : Génération de backstory et calcul du Thème Astral selon la date et l'heure de naissance.

Feuille de Personnage : Refonte modulaire de l'interface (séparation en CharactersPage, CharactersConfig et LevelUpWizard). Intègre des calculs de statistiques dynamiques, un suivi complet de la monnaie (PC, PA, PE, PO, PP), une séparation claire des maîtrises (Armes/Outils/Dons), et un export PDF D&D 5e ultra-calibré sur la fiche officielle avec résolution des relations (Races/Classes).

Inventaire Global : Filtrage intelligent étendu avec détection sémantique et calcul d'encombrement basé sur la taille (P/M/G) et la constitution.

🚧 En cours :

Simulateur de Combat VTT : Gestion des tours, de l'ordre d'initiative incluant les modificateurs cosmiques.

Gestion de Campagne : Journal de quêtes, suivi des PNJ rencontrés et chronologie des événements.

Carte Interactive : Système de navigation spatial/géographique.

Calculateur d'Arsenal automatique : Finalisation de l'intégration des minéraux/matériaux dans la forge.

🔮 6. FEUILLE DE ROUTE (ROADMAP FUTUR)
Les modules avancés prévus pour les phases de développement ultérieures :

Table Virtuelle (VTT) 3D : Intégration de l'écosystème React Three Fiber (R3F) et de modèles `.glb` (Blender) pour concevoir un lanceur de dés 3D réaliste (physique Rapier/Cannon) et une Battlemap 3D synchronisée en temps réel via Supabase.

Infrastructure Visio & Replay : Mise en place d'un flux WebRTC auto-hébergé (voie "Hacker Open-Source" type LiveKit) pour gérer la visioconférence multijoueur avec capacité d'enregistrement Cloud longue durée (jusqu'à 8h consécutives) pour les diffusions/replays d'Actual Plays.

Écosystème E-Commerce (Medusa.js) : Développement et intégration d'une plateforme de vente complète en architecture Headless. Utilisation de Medusa.js couplé au front-end React existant pour offrir une marketplace d'assets numériques, la vente de modules de campagnes, et la gestion des abonnements premium pour les MJ avec une souveraineté totale sur le système d'achat.

⚠️ AVERTISSEMENT IA
"Nous codons un projet complexe. Ne prends aucune initiative qui réduirait la portée ou la qualité du code. Toujours fournir les blocs de code complets et respecter la séparation logique de l'architecture."
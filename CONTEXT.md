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

⚙️ 4. LOGIQUE DES RÈGLES ET INFLUENCES (rulesEngine)
Le moteur a été étendu pour gérer la simultanéité des influences :

Système d'Horoscope & Influences Cosmiques : Calcul cumulatif (Natal + Annuel + Mensuel + Quotidien + Horaire) avec injection d'un modificateur global en pourcentage (%) sur les statistiques du personnage.

Structure du rulesEngine : Mathématiques isolées par jeu (dnd5, cthulhu, etc.) calculant automatiquement les statistiques dérivées (CA, Initiative, DD de sauvegarde, Bonus d'attaque magique).

🚧 5. ÉTAT DES MODULES
✅ Validés :

Univers : Mondes (avec Horloge et Calendrier), Dieux, Astrologie & Corps Célestes, Géographie complète (Continents, Pays, Océans).

Système de Temps : Calendriers personnalisés, écoulement du temps MJ, influences astrales synchronisées en temps réel sur la fiche personnage.

Société & Peuples : Guildes, Langues, Sectes, Races (avec éditeur de bonus), Classes, Capacités.

Encyclopédie Technique : Sorts (système complet), Monstres (avec éditeur de stats), Animaux, Maladies, Malédictions.

Économie & Artisanat : Flore, Minéraux, Matériaux, Objets, Potions, Recettes de cuisine (avec moteurs VTT dédiés).

Moteur de Naissance : Génération de backstory et calcul du Thème Astral selon la date et l'heure de naissance.

Feuille de Personnage : Centralisation interactive des statistiques, de l'Arsenal, et du nouveau Grimoire Arcanique Dynamique.

🚧 En cours :

Simulateur de Combat VTT : Gestion des tours, de l'ordre d'initiative incluant les modificateur cosmiques.

Gestion de Campagne : Journal de quêtes, suivi des PNJ rencontrés et chronologie des événements.

Carte Interactive : Système de navigation spatial/géographique.

Calculateur d'Arsenal automatique : Finalisation de l'intégration des minéraux/matériaux dans la forge.

⚠️ AVERTISSEMENT IA
"Nous codons un projet complexe. Ne prends aucune initiative qui réduirait la portée ou la qualité du code. Toujours fournir les blocs de code complets et respecter la séparation logique de l'architecture."
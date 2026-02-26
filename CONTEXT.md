📜 JDR MANAGER - GRIMOIRE DE CONTEXTE (Aethoria)
Dernière mise à jour : 26 Février 2026

🏛️ 1. VISION DU PROJET : "LE MOTEUR ULTIME"
Transformation de l'application en un Moteur de JDR Universel & Agnostique. L'objectif est de gérer n'importe quel univers et système de règles sans recoder l'application.

Agnosticisme : Le moteur ne connaît pas les règles "en dur" ; il lit des configurations dynamiques (rulesets.js).

Lore Profond : Gestion hiérarchique détaillée (Mondes > Villes > Lieux).

Secrets du MJ : Chaque entité possède une couche publique et une couche "MJ" sécurisée (onglet id: 'gm').

Indépendance : Centralisation totale sur Supabase (PostgreSQL + JSONB).

🛡️ 2. LOIS DE DÉVELOPPEMENT (INVIOLABLES)
🚫 RÈGLE 1 : AUCUNE SIMPLIFICATION
Interdiction formelle de condenser ou d'omettre le code. Chaque propriété et bloc logique doit être écrit de manière explicite. Une réduction involontaire de lignes est une perte de données.

📄 RÈGLE 2 : CODES INTÉGRAUX UNIQUEMENT
Toute modification doit être renvoyée sous forme de fichier complet. Les commentaires de type // ... reste du code sont interdits.

🏗️ 3. ARCHITECTURE ET COMPOSANTS SPÉCIALISÉS
L'application repose sur une architecture modulaire où chaque grande fonctionnalité dispose de son propre éditeur intelligent :

Moteur d'Artisanat Interactif (CraftingEngineEditor) :

Gère la création d'objets, potions, et recettes.

Lien direct DB : Sélection dynamique des Minéraux, Plantes, Matériaux et Sorts.

Filtrage Intelligent : Recherche de sorts par École (Type) et par Niveau.

Processus : Gestion d'étapes illimitées avec durées, modificateurs de DD et gestion des critiques (réussites/échecs).

Horloge Mondiale (WorldClockControl) :

Permet au MJ de piloter le temps réel du monde (Année, Mois, Jour, Heure).

Débordement Intelligent : Calcule automatiquement le passage au jour/mois suivant selon la configuration du monde.

Éditeur de Calendrier (CalendarConfigEditor) :

Permet de définir des calendriers uniques par monde (Noms des mois personnalisés, nombre de jours par mois, heures par jour).

Moteurs de Règles VTT : Composants dédiés insérés dans les onglets techniques (ex: DeityMechanicsEditor, CurseMechanicsEditor) pour gérer les bonus/malus chiffrés.

⚙️ 4. LOGIQUE DES RÈGLES ET INFLUENCES (rulesEngine)
Le moteur a été étendu pour gérer la simultanéité des influences :

Système d'Horoscope & Influences Cosmiques :

Calcul cumulatif basé sur l'échelle de temps : Natal + Annuel + Mensuel + Hebdomadaire + Quotidien + Horaire.

Modificateur Global : Injection d'un bonus/malus en pourcentage (%) sur l'ensemble des compétences du personnage en fonction de l'alignement des astres (Astre dominant vs absent).

Structure du rulesEngine :

/systems/ : Mathématiques pures isolées par jeu (D&D 5e, Cthulhu, etc.).

Les fonctions de calcul acceptent désormais un cosmicModifier global pour altérer dynamiquement les statistiques dérivées (Initiative, Chance, PV temporaires).

🚧 5. ÉTAT DES MODULES
✅ Validés :

Univers : Mondes (avec Horloge et Calendrier), Dieux, Astrologie & Corps Célestes, Géographie complète.

Système de Temps : Calendriers personnalisés, écoulement du temps MJ, influences astrales synchronisées.

Société & Peuples : Guildes, Langues, Sectes, Races, Classes, Capacités.

Encyclopédie Technique : Sorts, Monstres, Animaux, Maladies, Malédictions.

Économie & Artisanat : Flore, Minéraux, Matériaux, Objets (Magiques ou non), Potions, Recettes de cuisine.

Moteur de Naissance : Génération de backstory et calcul du Thème Astral / Résonance Magnétique selon la date de naissance.

Feuille de Personnage : Centralisation interactive des statistiques, de l'Arsenal et des influences cosmiques en temps réel.

🚧 En cours :

Simulateur de Combat VTT : Gestion des tours, de l'ordre d'initiative incluant les modificateurs cosmiques.

Gestion de Campagne : Journal de quêtes, suivi des PNJ rencontrés et chronologie des événements.

Carte Interactive : Système de navigation spatial/géographique.

Calculateur d'Arsenal automatique : Finalisation de l'intégration des minéraux/matériaux dans la forge.

⚠️ AVERTISSEMENT IA
"Nous codons un projet complexe. Ne prends aucune initiative qui réduirait la portée ou la qualité du code. Toujours fournir les blocs de code complets et respecter la séparation logique de l'architecture."
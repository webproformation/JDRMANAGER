📜 JDR MANAGER - GRIMOIRE DE CONTEXTE (Aethoria)
Dernière mise à jour : 13 Février 2026

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

🏗️ RÈGLE 3 : MODULARITÉ ET COMPLEXITÉ
Le système est vaste : ne pas hésiter à décomposer les composants en fichiers plus petits pour simplifier les copier-coller.

Ne jamais supprimer de fonctionnalités existantes (ex: calculs Rolemaster, RuneQuest) lors de l'ajout de nouvelles.

🎨 3. ARCHITECTURE UI/UX (LE DESIGN "ABYSSAL")
L'interface est unifiée sous le Design System "Abyssal".

Composants Core :

EntityList.jsx : Grille intelligente et filtres.

EnhancedEntityDetail.jsx : Vue Premium avec navigation par onglets (chevrons), boutons de scroll verticaux extérieurs, et affichage des statistiques techniques.

EnhancedEntityForm.jsx : Forge interactive avec zone latérale "sticky", sélection multiple (relation-list) et bouton "Zap" de génération totale.

Palette : Fond #1a1d2d (Night Blue), Accents Teal-500 et Cyan-400.

🧠 4. MOTEUR DE RÈGLES ET DONNÉES
Structure hybride (Relationnelle + NoSQL JSONB) pour une flexibilité totale.

Le Cerveau (rulesEngine.js) :

Gère les dés (4d6 drop lowest).

Générateur narratif (Backstory, personnalité, apparence).

Calculs dérivés (PV selon le niveau, CA, emplacements de sorts D&D 5.0).

Les Configurations (rulesets.js) :

Supporte D&D 5e, Cthulhu 7e, Rolemaster, RuneQuest, Rêve de Dragon.

Utilise des types complexes comme relation-list pour les menus interactifs de sorts et talents.

🚧 5. ÉTAT DES MODULES
✅ Validés : Univers (Mondes, Dieux & Panthéons, Calendriers & temps, Astrologie & Cieux Continents, Pays, Cités, Villages, Autres lieux, Océans & mers), Société (Guildes, Langues), Peuples (Races, langages, Classes, Capacités de classes, Sorts, Guildes, Sectes, Maledictions, Maladies, Monstres, animaux), Eléments du monde (Flore, Minéraux & Poudres, Matéiruax d'artisanat, Objets, objets magiques, Potions, recettes de cuisine)

🚧 En cours : Création des feuilles de personnages, Centralisation de la Magie interactive et intégration dans la génération des personnages, Centralisation des capacités de classes et intégration dans la génération des personnages, Centralisation des talents et options d'historiques et intégration dans la génération des personnages Calculateur d'Arsenal automatique, VTT complexe, Carte du monde interractif (style google map en vue satellite).

⚠️ AVERTISSEMENT IA
"Nous construisons un système énorme et complexe. On ne peut pas revenir en arrière à chaque fois. Ta mission est l'exhaustivité et le respect scrupuleux du design Premium établi."
# TempoSim - Simulation du coût de consommation EDF

TempoSim est une appli web permettant de simuler le coût de votre consommation
électrique passée sur les différentes offres du tarif bleu EDF (Base, Heures
Creuses et Tempo).

L'application ne télécharge aucune donnée et ne dépose aucun cookie. Tout
s'exécute dans votre navigateur.

TempoSim est disponible en ligne ici: https://temposim.njoyard.fr.

## Utilisation locale

Prérequis: Node 20, yarn.

Cloner le dépôt et exécuter `yarn preview`. L'application est accessible à
l'URL http://localhost:4173/.

## Historique

### Version 0.2.1

Très légers changements cosmétiques.

### Version 0.2.0

- Ajout du réglage des heures creuses
- Fusion des deux graphiques mensuel/annuel en un seul

### Version 0.1.0

Première version publiée.

## Licence et crédits

Ce code est sous [licence MIT](LICENSE.md).

L'application utilise l'API https://www.api-couleur-tempo.fr/ pour récupérer
l'historique des couleurs des jours Tempo.

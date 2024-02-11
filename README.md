# TempoSim - Simulation du coût de consommation EDF

TempoSim est une appli web permettant de simuler le coût de votre consommation
électrique passée sur les différentes offres du tarif bleu EDF (Base, Heures
Creuses et Tempo).

L'application ne télécharge aucune donnée et ne dépose aucun cookie. Tout
s'exécute dans votre navigateur.

TempoSim est disponible en ligne ici: https://temposim.njoyard.fr.

![Capture d'écran de l'application](screenshots/mensuel.png)

## Utilisation locale

Prérequis: Node 20, yarn.

Cloner le dépôt et exécuter `yarn preview`. L'application est accessible à
l'URL http://localhost:4173/.

## Historique

### Version 0.3.5

Mise à jour des tarifs EDF au 1er février 2024.

### Version 0.3.4

Ajout d'une balise meta description.

### Version 0.3.3

Correction d'une typo.

### Version 0.3.2

Correction d'un bug sur la bascule année/mois.

### Version 0.3.1

Correction d'une erreur de calcul des durées.

### Version 0.3.0

- Ajout d'un graphique de consommation
- Option de séparation des tarifs suivant les HC/HP et la couleur du jour
- Correction des calculs (les mesures Enedis indiquent la FIN de la plage, pas le début)

### Version 0.2.2

Modification des couleurs.

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

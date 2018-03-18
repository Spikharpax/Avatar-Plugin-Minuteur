Minuteur
========

Ce plugin est un add-on pour le framework [Avatar](https://github.com/Spikharpax/Avatar-Serveur)

Il permet de déclencher une action lorsque le temps défini est écoulé (pour un minuteur) ou arrivé (pour une alarme).

![GitHub Logo](/logo/timer.jpg)

Ce minuteur est un démonstrateur du potentiel d'Avatar en multiroom et en Traitement Naturel du Langage.<BR>
Si vous dites:<BR>
- `Démarre un minuteur de 1 minute 20 secondes`<BR>
Avatar analyse la phrase et crée un scénario de relations:
- **La phrase**: 	`start a timer of 1 minute 20 seconds`
- **Le scénario**: 	
	- **Action:** `start`
	- **Object:** `timer`
	- **When:**	  `1 minute 20 seconds`
- **Résultat:**
	- `${ACTION}` un `${OBJET}` de `${WHEN}`<BR>
Le plugin assigne alors une action avec le résultat. Pour cet exemple, un minuteur de 1 minute et 20 secondes.

Autre exemple, si vous dites:<BR>
- `Réveille-moi demain à 7h45` (Aujourd'hui Dimanche 18 Mars)<BR>
Avatar analyse la phrase et crée un scénario de relations:
- **La phrase**: 	`wake up tomorrow at 7:45`
- **Le scénario**: 	
	- **Action:** `wake up`
	- **When:**	  `Mon Mar 19 2018 07:45:00 GMT+0100 (Paris, Madrid)`
- **Résultat:**
	- `${ACTION}` le `${WHEN}`<BR>
Le plugin assigne alors une action avec le résultat. Pour cet exemple, le déclenchement d'une musique le lendemain à 7h45.

Autre exemple avec un jour et une heure, si vous dites:<BR>
- `Réveille-moi Lundi à 7h45` (Aujourd'hui Dimanche 18 Mars)<BR>
Avatar analyse la phrase et crée un scénario en relation:
- **La phrase**: 	`wake me up Monday at 7:45`
- **Le scénario**: 	
	- **Action:** `wake`
	- **When:**	  `Mon Mar 19 2018 07:45:00 GMT+0100 (Paris, Madrid)`
- **Résultat:**
	- `${ACTION}` le `${WHEN}`<BR>
Le plugin assigne alors une action avec le résultat. Pour cet exemple, le déclenchement d'une musique le lundi suivant à 7h45.

Ce plugin est aussi multiroom. Vous pouvez déclencher un minuteur ou une alarme depuis une pièce pour être exécuté dans une autre pièce.
Par exemple, vous pouvez déclencher votre action depuis la pièce Salon pour qu'elle soit exécutée dans le pièce Chambre:
- `Démarre un minuteur de 1 heure 20 minutes 30 secondes dans la Chambre`
- `Réveille-moi demain à 7h45 dans la Chambre`
- `Déclenche une alarme à 20h45 dans le Salon`
- `Réveille-moi jeudi à 7h45`<BR>
A noter que si vous ne précisez pas la pièce, le client courant est utilisé, par exemple, Salon pour Salon ou Cuisine pour Cuisine.

Vous pouvez aussi définir des minuteurs pour des choses précises:
- `Démarre un minuteur pour des frites`
- `Déclenche un minuteur pour des pommes au four`

Il est aussi parfaitement intégré avec un système de son Sonos System en utilisant le plugin [SonosPlayer](https://github.com/Spikharpax/Avatar-Plugin-SonosPlayer).

**A noter:**
- Ce plugin permet de créer des alarmes qui peuvent faire office de réveil matin mais vous pouvez réaliser des programations (et des réveils) nettement plus élaborées avec le plugin `scenariz` seul.

<BR>
## Installation
- Dézippez le fichier `Avatar-Plugin-Minuteur-Master.zip` dans un répertoire temporaire
- Copiez le répertoire `timer` dans le répertoire `Avatar-Serveur/plugins`


## Configuration
La configuration du plugin se fait dans le fichier `Avatar-Serveur/plugins/timer/timer.prop`


## Versions
Version 1.0 
- Version Released

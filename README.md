Minuteur
========

Ce plugin est un add-on pour le framework [Avatar](https://github.com/Spikharpax/Avatar-Serveur)

Il permet de déclencher une action lorsque le temps défini est écoulé (pour un minuteur) ou arrivé (pour une alarme).

![GitHub Logo](/logo/timer.jpg)

Ce minuteur est un démonstrateur du potentiel d'Avatar en multiroom et en Traitement Naturel du Langage.<BR>
**Si vous dites:**<BR>
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

**Autre exemple, si vous dites:**<BR>
- `Réveille-moi demain à 7h45` (Aujourd'hui Dimanche 18 Mars)<BR>
Avatar analyse la phrase et crée un scénario de relations:
- **La phrase**: 	`wake up tomorrow at 7:45`
- **Le scénario**: 	
	- **Action:** `wake up`
	- **When:**	  `Mon Mar 19 2018 07:45:00 GMT+0100 (Paris, Madrid)`
- **Résultat:**
	- `${ACTION}` le `${WHEN}`<BR>
Le plugin assigne alors une action avec le résultat. Pour cet exemple, le déclenchement d'une musique le lendemain à 7h45.

**Autre exemple avec un jour et une heure, si vous dites:**<BR>
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

Les minuteurs et les alarmes sont gérés indépendamments les uns des autres, vous pouvez donc en lancer autant qu'il vous plaira et ca sur tous les clients Avatar de votre installation.<BR>
Si vous voulez intérrompre un minuteur avant son exécution, Avatar vous les ennumerera et vous demandera lequel supprimer.<BR>
Pour les alarmes, vous pouvez utiliser la règle de suppression des programmes du plugin `scenariz`.

Vous pouvez aussi définir des minuteurs pour des choses précises:
- `Démarre un minuteur pour des frites`
- `Déclenche un minuteur pour des pommes au four`
- `Démarre un minuteur pour ma partie de carte`

Ce plugin est aussi parfaitement intégré avec un système de son Sonos System en utilisant le plugin [SonosPlayer](https://github.com/Spikharpax/Avatar-Plugin-SonosPlayer).

**A noter:**
- Ce plugin permet de créer des alarmes qui peuvent faire office de réveil matin pour un seul jour donné mais vous pouvez aussi réaliser des programations (et des réveils) nettement plus élaborées et répétitives avec le plugin [Scenariz](https://github.com/Spikharpax/Avatar-Plugin-scenariz).

<BR>

## Installation
- Dézippez le fichier `Avatar-Plugin-Minuteur-Master.zip` dans un répertoire temporaire
- Copiez le répertoire `timer` dans le répertoire `Avatar-Serveur/plugins`


## Configuration
La configuration du plugin se fait dans le fichier `Avatar-Serveur/plugins/timer/timer.prop`

### NoXMLGrammar
Cette propriété permet de ne pas ajouter la règle dictée dans le fichier XML de grammaire Speech Microsoft Speech Engines du client Avatar même si la variable globale `addToLocalGrammar` du client est à `true`.<BR>
En général, les plugins qui n'ont pas de règles fixes, comme celui-ci, permettent, par définition, un grand nombre de règles et les ajouter toutes dans le fichier de grammaires aurait pour résultat d'avoir un grand nombre de faux positifs.<BR>
Pour ce plugin, laissez cette variable à `true`.

### nlpPosition
Cette propriété est faite pour éviter les conflits entre les plugins lorsque ceux-ci peuvent avoir les mêmes termes dans leurs règles.<BR>
Pour plus de précision, voir la documentation au paragraphe "Réordonner l'ordre des plugins pour NLP".<BR>
Pour ce plugin, laissez cette variable à `3`.

**Important:** <BR>
Ce plugin prend la place du plugin `time` dans l'ordre du Traitement Naturel du Langage.<BR>
La propriété `nlpPosition` du plugin `time` est modifié à `5` avec la mise à jour 0.1.8 du Serveur Avatar.<BR>


### addspeech
Valable uniquement pour les minuteurs.<BR>
Cette propriété permet d'ajouter une phrase lorsque le temps défini pour le minuteur est écoulé et **après** la musique programmée.
- 2: Si `addspeech=true`, Avatar dira alors:
	- Minuteur de **....** terminé.

Valeurs:<BR>
- addspeech : true,
- addspeech : false,


### default_sound
Valable uniquement pour les minuteurs.<BR>
Cette propriété définie le son par défaut lorsque aucun son n'est défini pour un type de minuteur.<BR>
Par défaut, "rencontre_du_troisieme_type.mp3" 


### lexic
valable uniquement pour les alarmes programmées.<BR>
Cette propriété permet de donner un nom aux alarmes en fonction de leurs types dans la base de programmes du plugin scenariz.<BR>

Si aucune valeur n'est trouvée pour le type, le nom par défaut est `un programme`.
 

### sound
Cette propriété permet de configurer les musiques associées aux types d'alarmes.<BR>



 
 
 


## Versions
Version 1.0 
- Version Released

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
- `Réveille-moi à 7h45 demain dans la Chambre`
- `Déclenche une alarme à 20h45 dans le Salon`
- `Réveille-moi jeudi prochain à 7h45`<BR>
A noter que si vous ne précisez pas la pièce, le client courant est utilisé, par exemple, Salon pour Salon ou Cuisine pour Cuisine.

Les minuteurs et les alarmes sont gérés indépendamments les uns des autres, vous pouvez donc en lancer autant qu'il vous plaira et ca sur tous les clients Avatar de votre installation.<BR>
Si vous voulez intérrompre un minuteur avant son exécution et si il y en a plusieurs, Avatar vous les ennumerera et vous demandera lequel supprimer. Si il n'y en a qu'un seul, Avatar le supprimera directement.<BR>
Pour supprimer une alarme, vous pouvez utiliser la règle de suppression des programmes du plugin `scenariz`.

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

Vérifiez que vous avez les version requises d'Avatar Serveur et Client.

## Compatibilité
- [X] Avatar Serveur >= 0.1.8
- [X] Avatar Client >= 0.2.3
- [X] Avatar Android >= 0.1.0

Pour les alarmes uniquement, il est obligatoire que le plugin `scenariz` soit installé:
- [X] Scenariz >= 1.1 (03-11-2017)

**Note:** Ce plugin ne nécessite aucune configuration.

Pour le son déporté avec un système Sonos:
- [X] SonosPlayer >= 1.3

<BR>

## Configuration
La configuration du plugin se fait dans le fichier `Avatar-Serveur/plugins/timer/timer.prop`

Ci-dessous les propriétés basiques du plugin:

| Propriété 	| défaut | Description 	|
|     :---:     | :---:   | --- 			|
| **NoXMLGrammar**    | true  | Cette propriété permet de ne pas ajouter la règle dictée dans le fichier XML de grammaire Microsoft Speech Engines du client Avatar même si la variable globale `addToLocalGrammar` du client est à `true`.<BR>En général, les plugins qui n'ont pas de règles fixes, comme celui-ci, permettent, par définition, un grand nombre de règles et les ajouter toutes dans le fichier de grammaires aurait pour résultat d'avoir un grand nombre de faux positifs.<BR>Pour ce plugin, laissez cette variable à `true`.<BR>|
| **nlpPosition**    | 3  | Cette propriété est faite pour éviter les conflits entre les plugins lorsque ceux-ci peuvent avoir les mêmes termes dans leurs règles.<BR>Pour plus de précision, voir la documentation au paragraphe "Réordonner l'ordre des plugins pour NLP".<BR>Pour ce plugin, laissez cette variable à `3`.<BR><BR>**Important:** <BR>Ce plugin prend la place du plugin `time` dans l'ordre du Traitement Naturel du Langage.<BR>La propriété `nlpPosition` du plugin `time` est modifié à `5` avec la mise à jour 0.1.8 du Serveur Avatar.<BR>|
| **addspeech**    | true  | Valable uniquement pour les minuteurs.<BR>Cette propriété permet d'ajouter une phrase lorsque le temps défini pour le minuteur est écoulé et **après** la musique programmée. Si `addspeech=true`, Avatar dira ensuite: "Minuteur de **....** terminé".<BR>Valeurs possibles: true, false<BR>|
| **lexic**    | "un programme"  | Valable uniquement pour les alarmes programmées.<BR>Cette propriété permet de donner un nom aux alarmes en fonction de leurs types dans la base de programmes du plugin scenariz.<BR>|

<BR>

## Configuration de la musique
Chaque minuteur ou alarme se termine par une musique au format mp3 ou wav.

### Musique par défaut
Une musique par défaut est utilisée si aucun son n'est défini pour un type de minuteur ou que le répertoire défini pour les alarmes est introuvable. Cette musique est définie dans la propriété `default_sound`.

**Valeur par défaut:** rencontre_du_troisieme_type.mp3

### Musique pour les minuteurs
Les musiques pour les minuteurs sont définis dans le répertoire `sound` du plugin. Vous pouvez en ajouter comme vous voulez.

Les minuteurs avec une définition fixe, comme par exemple `minuteur pour des frites`, peuvent avoir dans leurs définitions des sons spécifiques. Voir le chapitre suivant pour la définition des minuteurs fixes.

### Musique pour les alarmes
Les alarmes peuvent avoir des sons spécifiques définis dans le tableau `sounds` avec le format suivant:
```js
"sounds": {
	"repertoire" : ["Action", "Action", "Action"],
	"repertoire" : ["Action", "Action", "Action"],
	"repertoire" : ["Action", "Action", "Action"]
},
```

**ou**<BR>
"répertoire" est le nom du répertoire sous le répertoire `sound` du plugin et qui est lié avec le type d'alarme défini par la relation "Action".<BR>
["Action", "Action", "Action"] est le tableau associé des relations "Action".

Par exemple, si vous dites:<BR>
- `Réveille-moi à 7h45 demain` <BR>
La relation "Action" est:<BR>
- **Action:** `wake up`
	
Si je veux avoir des musiques pour le réveil, je crée un répertoire `sound/reveil` et je copie dedans des musiques, puis je configure le tableau comme ci-dessous:<BR>
```js
"sounds": {
	"reveil" : ["wake up"]
},
```

Le plugin recherchera récursivement dans **tous les répertoires sous le répertoire principal `reveil`** et une musique sera prise au hasard pour être jouée par le plugin dans la pièce qui a été définie au moment de la création de l'alarme (par défaut, la pièce où la règle a été passée si aucune pièce n'a été précisée).

Vous pouvez aussi créer un lien symbolique de répertoire Windows avec votre bibliothèque musicale, ce qui évitera de dubliquer votre bibliothèque.

**Comment connaitre l'Action associé à une règle ?**<BR>
Dictez une règle et visualisez le résultat et l'Action dans la console Avatar:
- Dans le tableau "Relations Actions" et l'objet "text" (en fin de tableau)
- Sur la ligne "Relation Type:"


## Configuration de minuteurs fixes
Les minuteurs fixes sont définis dans le tableau `times` avec le format suivant:
```js
"times" {
	"nom du minuteur fixe" : {
		"time" : "HH:mm:ss",
		"sound" : "nom du son associé",
		"substitute: ["mot-clé possible", "mot-clé possible", "mot-clé possible",],
		"speech" : "Une phrase vocalisée par Avatar après le son si la variable `addspeech`=true"
	},
	"nom du minuteur fixe" : {
			......
			......
			......
	}
}
```
**ou:**<BR>
- "time" est obligatoire
- "sound" est optionel, `default_sound` est utilisé si manquant.
- "substitute" est obligatoire
- "speech" est optionel. Avatar dira `Minuteur terminé` si la variable `addspeech`=true


## Les règles
3 actions par mots-clés sont possibles et définies dans le tableau "rules"

### Les règles de minuteur
Vous pouvez dicter des règles avec le format suivant:
- .......**minuteur de** XX heure XX minutes XX secondes pièce
	- Démarre un minuteur de 1 heure 20 minutes 30 secondes
	- Tu peux démarrer un minuteur de 10 minutes s'il te plait ?
	- Déclenche un minuteur de 50 secondes 
	- Déclenche un minuteur de 50 secondes dans le Salon
- Avec des règles fixes:
	- Démarre un minuteur pour des frites`
	- Déclenche un minuteur pour du riz dans la cuisine s'il te plait

**A noter** que "timer** est aussi compris.

### Les règles d'alarmes
Vous pouvez dicter des règles d'alarmes avec le format suivant:
- **réveil, alarme, minuteur****à** HH:mm jour de la semaine
- **réveil, alarme, minuteur****à** jour de la semaine HH:mm pièce
	- Tu peux me réveiller à 7h35 demain ?
	- Reveilles-moi à 7h45 demain
	- Reveilles-moi demain à 7h45
	- Déclenche une alarme à 20 heures lundi
	- Tu peux déclencher une alarme mardi à 20 heures s'il te plait ?
	- Reveilles-moi à 6 heures mardi
	- Reveilles-moi à mardi à 6 heures dans la Chambre

**A noter** qu'il peut arriver, suivant le jour de la semaine, que la date comprise par le traitement naturel du langage soit antérieure à celle du jour, dites alors "prochain" avec le jour pour faciliter la compréhension, par exemple:
	- Reveilles-moi à 6 heures mardi prochain

Les règles d'alarmes sont créées dans la base de données du plugin `scenariz`, elles restent activent même si le serveur redémarre.

### Les règles d'arrêt d'un minuteur
Vous pouvez arrêter un minuteur en cours avec la règle suivante:
- "Arrete le minuteur"
Si un seul minuteur est actif, Avatar l'arrete directement.<BR>
Si plusieurs minuteurs sont actifs, Avatar rentre dans un jeu de questions/réponses:
- Répondez après une question d'Avatar:
	- "Oui", "Oui s'il te plait" pour stopper le minuteur
	- "Non", "Non suivant" pour passer au suivant
	- "Merci Sarah", "Terminé", "Annule" pour arreter la oommande
	
Les réponses sont dans le fichier de propriétés et dans le tableau "askme", vous pouvez les modifier ou en ajouter.

### Les règles d'arrêt d'une musique
Lorsqu'une musique est en train d'être jouée, vous pouvez l'arreter par la commande suivante:
- "Stop la lecture"

Utile par exemple pour un réveil.

Toutes ces règles peuvent être modifiées, vous pouvez aussi en ajouter...


<BR><BR>
 

## Versions
Version 1.0 
- Version Released

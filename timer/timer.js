/*
 Author: Stéphane Bascher
*/


var timerJobs = [],
	onPlay = [],
	CronJob = require('cron').CronJob,
	moment = require('moment'),
	_ = require('underscore'),
	fs  = require('fs-extra'),
	path   = require('path');

require('colors');


exports.action = function(data, callback){  

	var _TimerConf = {
		sound: Config.modules.timer['default_sound'] || 'rencontre_du_troisieme_type.mp3',
		addspeech: Config.modules.timer['addspeech'] || false,
	};	
	
	var tblActions = {
		startTimer: function() {start(data.client, client, data.action.time, data.action.type, _TimerConf.sound, _TimerConf.addspeech)},
		stopTimer: function() {stop(data.client)},
		execJob: function() {execJob(client, data.action.sound)},
		stopPlay: function() {stopPlay(client, data.client)}
	};
	
	var client = setClient(data);
	info("Timer command:", data.action.command.yellow, "From:", data.client.yellow, "To:", client.yellow);
	tblActions[data.action.command]();
	
	callback({});
}



var setClient = function (data) {
	
	// client direct (la commande provient du client et est exécutée sur le client)
	var client = data.client;	
	// Client spécifique fixe (la commande ne provient pas du client et n'est pas exécutée sur le client et ne peut pas changer)
	if (data.action.room) 
		client = (data.action.room != 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;

	// Client spécifique non fixe dans la commande HTTP (la commande ne provient pas du client et n'est pas exécutée sur le client et peut changer)
	if (data.action.setRoom) 
		client = data.action.setRoom;
	
	return client;
}


var execJob = function (client, sound) {
	
	if (sound != Config.modules.timer['default_sound']) {
		var folder = path.normalize(__dirname + '/sound/' + sound);
		if (!fs.existsSync(folder)) {
			sound = Config.modules.timer['default_sound'];
			setjob(client, client, '2', sound);
		} else {
			
			walk (folder, function(err, results){
				if (err) {
					error(err.red);
					return;
				}
				
				if (results.length > 0) {
					sound = results[getRandomIntInclusive(0, results.length - 1)];
				} else
					sound = Config.modules.timer['default_sound'];
					
				setjob(client, client, '2', sound);
				
			});
		}
	} else
		setjob(client, client, '2', sound);
	
}




var walk = function(folder, callback) {

  var results = [];
  fs.readdir(folder, function(err, list) {
	if (err) return callback(err);

	var pending = list.length;
	if (!pending) return callback(null, results);

	list.forEach(function(file) {
	  file = folder + "/" + file;
	  fs.stat(file, function(err, stat) {
		if (stat && stat.isDirectory()) {
		  walk(file, function(err, res) {
			results = results.concat(res);
			if (!--pending) callback(null, results);
		  });
		} else {
		  var context = path.normalize(__dirname + '/sound');	
		  results.push(file.replace(context+"\\",''));
		  if (!--pending) callback(null, results);
		}
	  });
	});
  });
}



var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}


var getDay = function (hourday, hour) {
	
	var tblday = ["-0000001","-1000000","-0100000","-0010000","-0001000","-0000100","-0000010"];
	return hour+tblday[parseInt(hourday)];
		
}


var start = function (speakOnClient, client, time, type, sound, addspeech) {
	
	if (!time)
		return Avatar.speak("Je n'ai rien compris, recommence.", speakOnClient, function () { 
				var clientSocket = Avatar.Socket.getClientSocket(speakOnClient);
				if (clientSocket)
						clientSocket.emit('listen_again');
		});
	
	if (time instanceof Date && !isNaN(time.valueOf())) {
		// Un programme [réveil, alarme, sonnerie] avec une date et une heure de programmation
		var currentDate = moment().format("YYYY-MM-DDTHH:mm");
		
		var month = parseInt(time.getMonth()+1).toString();
		month = month.length == 1 ? '0' + month : month;
		var day = time.getDate().toString();
		day = day.length == 1 ? '0' + day : day;
		var hour = time.getHours().toString();
		hour = hour.length == 1 ? '0' + hour : hour;
		var minutes = time.getMinutes().toString();
		minutes =  minutes.length == 1 ? '0' + minutes : minutes;
		var timerTime = time.getFullYear()+'-'+month+'-'+day+'T'+hour+':'+minutes;
		
		// Date avant aujourd'hui
		if (moment(timerTime).isAfter(currentDate) == false) {
			return Avatar.speak("J'ai compris une date antérieure à aujourd'hui, essaye avec prochain dans la phrase. Mercredi prochain, par exemple.", speakOnClient, function () { 
					var clientSocket = Avatar.Socket.getClientSocket(speakOnClient);
					if (clientSocket)
							clientSocket.emit('listen_again');
				});
		}
		
		// 6 jours maxi pour scenariz - 1 semaine max
		var maxDate = moment(currentDate).add(6, 'days').format("YYYY-MM-DDTHH:mm");
		if (moment(timerTime).isAfter(maxDate) == true) {
			return Avatar.speak("Désolé, je ne peux pas programmer une date à plus de 6 jours", speakOnClient, function () { 
				Avatar.Speech.end(speakOnClient); 
			});
		}
		
		hour = moment(timerTime).format('HH:mm');
		
		var hourday = time.getDay().toString();
		hourday = getDay (hourday, hour); 
		
		info('Time/day', hourday.yellow);
		
		var folderType;
		if (type) {
			info('Relation type', type.yellow);
			for (var soundType in Config.modules.timer.sounds) {
				if (_.indexOf(Config.modules.timer.sounds[soundType], type) > -1) {
					folderType = soundType;
					info('Type music directory found:', folderType.yellow);
					break;
				}
			}
		}
		if (!folderType) {
			folderType = sound;
			info('Default sound:', folderType.yellow);
		}
		
		if (Avatar.exists('scenariz')) {
			var tts_type = 'un programme';
			for (var lexic in Config.modules.timer.lexic) {
				if (lexic.toLowerCase() == type.toLowerCase()) {
					tts_type = Config.modules.timer.lexic[lexic];
					break;
				}
			}
			Avatar.call('scenariz', {command: 'saveCron', 
				program: tts_type+' '+getRandomIntInclusive(1,1000).toString(),
				name: tts_type+' à '+hour+' dans la pièce '+client,
				exec: 'true',
				order: '1',
				plug: 'timer',
				start: hourday,
				key: 'command=execJob~client='+client+'~sound='+folderType,
				autodestroy: 'true',		
				client: client,
				mute: 'true',
				cronClient : client,
				}, function(cb){ 
					setTimeout(function(){
						moment.locale('fr');
						var formatedDate = moment(timerTime).format('dddd à HH:mm');
						
						Avatar.speak("J'ai créé " + tts_type + " pour "+formatedDate, speakOnClient, function () { 
							Avatar.Speech.end(speakOnClient);
						});
					}, 1000);
			});
		} else {
			Avatar.speak("Le plugin scenarize n'est pas installé. Dommage, j'aurais pu créer ce programme.", speakOnClient, function () { 
				Avatar.Speech.end(speakOnClient);
			});
		}
		return;		
	} 
	
	
	// Un Minuteur
	if (typeof time !== 'string') {
		return Avatar.speak("Je n'ai rien compris, recommence.", speakOnClient, function () { 
				var clientSocket = Avatar.Socket.getClientSocket(speakOnClient);
				if (clientSocket)
						clientSocket.emit('listen_again');
		});
	}
	
	var momentTime = { hour:"00", minute:"00", second:"00" };
	var tbltime = time.split(" ");
	
	if (_.indexOf(tbltime, "hour") > 0 || _.indexOf(tbltime, "hours") > 0) {
		var pos = (_.indexOf(tbltime, "hour") > 0) ? _.indexOf(tbltime, "hour") : _.indexOf(tbltime, "hours");
		var hour = tbltime [pos - 1].toString();
		momentTime.hour = hour.length == 1 ? "0"+hour : hour;
		
		if (tbltime [pos + 1] && Number.isInteger(parseInt(tbltime [pos + 1])) && (!tbltime [pos + 2] || tbltime[pos + 2].indexOf('minute') == -1)){
			var minute = tbltime [pos + 1].toString();
			momentTime.minute = minute.length == 1 ? "0"+minute : minute;
		}
	}
	
	if (_.indexOf(tbltime, "minute") > 0 || _.indexOf(tbltime, "minutes") > 0) {
		var pos = (_.indexOf(tbltime, "minute") > 0) ? _.indexOf(tbltime, "minute") : _.indexOf(tbltime, "minutes");
		var minute = tbltime[pos - 1].toString();
		momentTime.minute = minute.length == 1 ? "0"+minute : minute;
		
		if (tbltime[pos + 1] && Number.isInteger(parseInt(tbltime[pos + 1])) && (!tbltime[pos + 2] || tbltime[pos + 2].indexOf('second') == -1)){
			var second = tbltime[pos + 1].toString();
			momentTime.second = second.length == 1 ? "0"+second : second;
		}
		
	}
	
	if (_.indexOf(tbltime, "second") > 0 || _.indexOf(tbltime, "seconds") > 0) {
		var pos = ((_.indexOf(tbltime, "second") > 0) ? _.indexOf(tbltime, "second") : _.indexOf(tbltime, "seconds")) - 1;
		var second = tbltime [pos].toString();
		momentTime.second = second.length == 1 ? "0"+second : second;
	}
	
	var itemTimer;
	var addTime = momentTime.hour+":"+momentTime.minute+":"+momentTime.second;
	if (addTime == "00:00:00") {
		// Un minuteur avec mot-clé (ex: des frites) ?
		var definedTimer;
		var found = false;
		for (var definedTime in Config.modules.timer.times) {
			for (var rule in Config.modules.timer.times[definedTime]) {
				if (rule == 'substitute') {
					for (var substitute in Config.modules.timer.times[definedTime][rule]) {
						if (time.toLowerCase().indexOf(Config.modules.timer.times[definedTime][rule][substitute].toLowerCase()) != -1) {
							info('Minuteur trouvé pour', definedTime.yellow);
							itemTimer = definedTime;
							definedTimer = Config.modules.timer.times[definedTime].time;
							found = true;
							break;
						}
					}
				}
				if (found) break;
			}	
			if (found) break;
		}
		
		if (definedTimer) {
			var tbldefinedTimer = definedTimer.split(':');
			momentTime.hour = tbldefinedTimer[0];
			momentTime.minute = tbldefinedTimer[1];
			momentTime.second = tbldefinedTimer[2];
		}
	}
	
	// Controle des secondes > 59 = +1mn
	if (parseInt(momentTime.second) > 59) {
		var ss = parseInt(momentTime.second);
		var mm=0;
		while(ss>59){ ss-=60; mm++;}
		momentTime.minute = (parseInt(momentTime.minute) + mm).toString().length == 1 
							? "0"+(parseInt(momentTime.minute) + mm).toString() 
							: (parseInt(momentTime.minute) + mm).toString();
	    momentTime.second = ss.toString().length == 1 
							? "0"+ss.toString() 
							: ss.toString();
	}
	// Controle des minutes > 59 = +1h
	if (parseInt(momentTime.minute) > 59) {
		var mm = parseInt(momentTime.minute);
		var hh=0;
		while(mm>59){ mm-=60; hh++;}
		momentTime.hour = (parseInt(momentTime.hour) + hh).toString().length == 1 
							? "0"+(parseInt(momentTime.hour) + hh).toString() 
							: (parseInt(momentTime.hour) + hh).toString();
	    momentTime.minute = mm.toString().length == 1 
							? "0"+mm.toString() 
							: mm.toString();
	}
	
	// Test si le minuteur est correcte
	var addTime = momentTime.hour+":"+momentTime.minute+":"+momentTime.second;
	var date = moment().format("YYYY-MM-DD");
	if (addTime == "00:00:00" || moment(date+'T'+addTime).isValid() == false){
		return Avatar.speak("Je n'ai rien compris, recommence.", speakOnClient, function () { 
			var clientSocket = Avatar.Socket.getClientSocket(speakOnClient);
			if (clientSocket)
					clientSocket.emit('listen_again');
		});
	}
	
	info('Minuteur de', addTime.yellow);
	
	// faisons simple
	// Reste plus qu'à définir le job...
	var hourToSec = (momentTime.hour != '00') ? parseInt(momentTime.hour) * 3600 : 0,
	mnToSec = (momentTime.minute != '00') ? parseInt(momentTime.minute) * 60 : 0,
	secondes = (momentTime.second != '00') ? hourToSec + mnToSec + parseInt(momentTime.second) : hourToSec + mnToSec;

	setjob(speakOnClient, client, secondes,sound, addspeech, itemTimer, function(){
			ttsFormat(momentTime, function(speech) {
				var tts;
				if (itemTimer) 
					tts = (speakOnClient.toLowerCase() != client.toLowerCase()) 
							? "minuteur de " + speech + " pour " + itemTimer + " démarré dans la pièce " + client 
							: "minuteur de " + speech + " pour " + itemTimer + " démarré";
			    else
					tts = (speakOnClient.toLowerCase() != client.toLowerCase()) 
							? "minuteur de " + speech + " démarré dans la pièce " + client 
							: "minuteur de " + speech + " démarré";
							
				Avatar.speak(tts, speakOnClient, function () { 
					Avatar.Speech.end(speakOnClient);
				});
			});
	});
}





var stopPlay = function (client, speakOnClient) {
	
	if (onPlay.length > 0) {
		var done;
		if (onPlay.length == 1 && onPlay[0].client == client) {
			Avatar.stop (onPlay[0].file, client);
			onPlay = [];
			done = true;
		} else {
			
			for (var i = 0; i < onPlay.length; i++) {
				if (onPlay[i].client == client) {
					
					Avatar.stop (onPlay[i].file, client);
					
					var even = _.filter(onPlay, function(played){
						return played.client != client;
					});
					onPlay = even ? even : [];
					
					done = true;
					break;
				}
			}
		}
		
		setTimeout(function(){
			var tts = done ? "c'est fait" : "Je n'ai pas trouvé de lecture en cours dans la pièce " + client;
			Avatar.speak(tts, speakOnClient, function () { 
				Avatar.Speech.end(speakOnClient);
			});				
		}, 1500);
	
	} else {
		Avatar.speak("Je n'ai pas trouvé de lecture en cours dans la pièce " + client, speakOnClient, function () { 
			Avatar.Speech.end(speakOnClient);
		});
	}
	
}




var stop = function (client) {

	if (timerJobs.length > 0) {
		info('Nombre de minuteurs:', timerJobs.length);
		
		if (timerJobs.length == 1) {
			var job = timerJobs[0].job;
			job.stop();
			info('Minuteur', timerJobs[0].name, 'stoppé');
			Avatar.speak(timerJobs[0].name + " stoppé.", client, function () { 
					Avatar.Speech.end(client);
			});
			timerJobs =	[];
		} else {
			selectTimerToStop(client, 0, timerJobs, selectTimerToStop, function(pos) { 
				var job = timerJobs[pos].job;
				job.stop();
				info('Minuteur', timerJobs[pos].name, 'stoppé');
				Avatar.speak(timerJobs[pos].name + " stoppé.", client);
				
				var even = _.filter(timerJobs, function(item){
					return item.id != timerJobs[pos].id;
				});
				
				timerJobs =	even ? even : [];
			});
		}
	} else 
		Avatar.speak("Il n'y a aucun minuteur en cours.", client, function () { 
					Avatar.Speech.end(client);
		});
		
}


var selectTimerToStop = function (client, pos, timerJobs, callback, callbackNext) {
	
	if (!callback) return;
	var tts;
	var endList;
	if (pos == timerJobs.length) {
		tts = "Fin des minuteurs, veux-tu recommencer au début?";
		endList = true;
	} else 
		 tts =  "Je stop le " + timerJobs[pos].name + "?";
	
	Avatar.askme(tts, client, 
		Config.modules.timer.askme, 
		0, function(answer, end){
				switch (answer) {
				case 'yes':
					if (endList) {
						end(client);
						callback (client, 0, timerJobs, callback, callbackNext);
					} else {
						end(client, true);
						callbackNext (pos);
					}
					break;
				case 'no':
					end(client);
					callback (client, ++pos, timerJobs, callback, callbackNext);
					break;
				case 'Sarahcancel':
					Avatar.speak("de rien|a ton service", client, function() { 
						end(client, true);
					});
					break;
				default:	
				case 'cancel':
					Avatar.speak("annulé", client, function() { 
						end(client, true);
					});
				}
	});
	
}



// Start Job
var setjob = function (speakOnClient, client, secs, sound, addspeech, itemTimer, callback) {

	var d = new Date();
	var s = d.getSeconds()+secs;
	d.setSeconds(s);

	var jobId = getRandomIntInclusive(1,1000).toString();
	
	dateHMS(secs, function (hms) {
		timerJobs.push ({
		name: "Minuteur de "+hms, 
		id : jobId,
		job: new CronJob(d, function(done) {
				info("Minuteur de " + hms + " terminé");
				timer_done(speakOnClient, client, sound, addspeech, itemTimer, hms);	
				
				var even = _.filter(timerJobs, function(job){
					return job.id != jobId;
				});
				
				timerJobs =	even ? even : [];
				
			},null, true) 
		});
		
		if (callback) callback();
	});
	
}



var timer_done = function (speakOnClient, client, sound, addspeech, itemTimer, hms) {
		
	if (itemTimer && Config.modules.timer.times[itemTimer].sound)
			sound = Config.modules.timer.times[itemTimer].sound;
	
	if (!Avatar.Socket.isServerSpeak(client)) {
		
		Avatar.copyfile('plugins/timer/sound/'+sound, client, function() {
			
			onPlay.push ({file: '%TRANSFERT%/'+sound, client: client});
			
			Avatar.play('%TRANSFERT%/'+sound, client, function(){ 
			
				var even = _.filter(onPlay, function(played){
					return played.client != client;
				});
				
				onPlay = even ? even : [];
				
				if (addspeech) {
					var tts;
					if (itemTimer && Config.modules.timer.times[itemTimer].speech)
						tts = Config.modules.timer.times[itemTimer].speech;
					else
						tts = "Minuteur de " + hms + " terminé";
					
					Avatar.speak(tts, client, function() { 
						if (Avatar.exists('SonosPlayer')) {
							if (Config.modules.SonosPlayer.speech.ttsExport) {
								var even = _.find(Config.modules.SonosPlayer.speech.ttsExport_Clients, function(num){
									return num.toLowerCase().indexOf(client.toLowerCase()) != -1; 
								});

								if (even)
									Avatar.call('SonosPlayer', {action : {command: 'speak_closure'}, client: client});
							}
						}
					});
				}
			});
		})
	} else
		Avatar.play('plugins/timer/sound/'+sound, client, function(){ 
			if (addspeech) {
				var tts;
				if (itemTimer && Config.modules.timer.times[itemTimer].speech)
					tts = Config.modules.timer.times[itemTimer].speech;
				else
					tts = "Minuteur de " + hms + " terminé";
				
				Avatar.speak(tts, client, function() { 
					if (Avatar.exists('SonosPlayer')) {
						if (Config.modules.SonosPlayer.speech.ttsExport) {
							var even = _.find(Config.modules.SonosPlayer.speech.ttsExport_Clients, function(num){
								return num.toLowerCase().indexOf(client.toLowerCase()) != -1; 
							});

							if (even)
								Avatar.call('SonosPlayer', {action : {command: 'speak_closure'}, client: client});
						}
					}
				});
			} else {
				if (Avatar.exists('SonosPlayer')) {
					if (Config.modules.SonosPlayer.speech.ttsExport) {
						var even = _.find(Config.modules.SonosPlayer.speech.ttsExport_Clients, function(num){
							return num.toLowerCase().indexOf(client.toLowerCase()) != -1; 
						});

						if (even)
							Avatar.call('SonosPlayer', {action : {command: 'speak_closure'}, client: client});
					}
				}
			}
		});
}



var dateHMS = function (time, callback) {
	var addZero = function(v) { return v<10 ? '0' + v : v; };
	var d = new Date(time * 1000); // en millisecondes
	var momentTime = { hour:"00", minute:"00", second:"00" };

	momentTime.hour = addZero(d.getHours() - 1); // - 1H pour le time zone, dirty hack...
	momentTime.minute = addZero(d.getMinutes());
	momentTime.second = addZero(d.getSeconds());
	ttsFormat(momentTime, function(hm) {
	  callback(hm);
	});
}


// Formatage du tts
var ttsFormat = function (momentTime,callback){
	
	var timer;
	if (momentTime.hour != "00")
		timer = momentTime.hour + " heure";
	if (momentTime.minute != "00")
		timer = timer ? timer + " " + momentTime.minute + " minute" : momentTime.minute + " minute";
	if (momentTime.second != "00")
		timer = timer ? timer + " " + momentTime.second + " seconde" : momentTime.second + " seconde";

	callback(timer);
}


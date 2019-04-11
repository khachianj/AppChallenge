
var inCordova = false;

var wordDelay = 200;

document.addEventListener("deviceready", function(){
	
	inCordova = true;
	
});

window.addEventListener("load", function setupVoiceRecognition(){
	
	if(inCordova){
		
		document.getElementById("microphoneButton").addEventListener("click", function(){
			
			window.plugins.speechRecognition.isRecognitionAvailable(function(available){
				
				if(available){
					
					window.plugins.speechRecognition.startListening(async function(result){
						
						words = convertToArray(result);
						
						for(var i = 0; i < words.length; i++){
							
							document.getElementById("output").innerHTML = words[i];
							
							await sleep(wordDelay);
							
						}
						
						document.getElementById("output").innerHTML = "";
						
					}, function(err){
						
						document.getElementById("microphoneButton").innerHTML = err;
						
					}, settings);
					
				}
				
			}, function(err){
				
				console.error(err);
				
			});
			
		});
		
	}
	
	else{
		
		if('webkitSpeechRecognition' in window){

			var message = document.querySelector('#output');

			var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

			var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

			var grammar = '#JSGF V1.0;'

			var recognition = new SpeechRecognition();

			var speechRecognitionList = new SpeechGrammarList();

			speechRecognitionList.addFromString(grammar, 1);

			recognition.grammars = speechRecognitionList;

			recognition.lang = 'en-US';

			recognition.interimResults = false;

			recognition.onresult = async function(event) {
				
				document.getElementById("microphoneButton").className = "";
				
				var last = event.results.length - 1;
				
				var command = event.results[last][0].transcript;
				
				words = convertToArray(command);
				
				for(var i = 0; i < words.length; i++){
					
					document.getElementById("output").innerHTML = words[i];
					
					await sleep(wordDelay);
					
				}
				
				document.getElementById("output").innerHTML = "";
				
			};

			recognition.onspeechend = function() {
				
				recognition.stop();
				
				document.getElementById("microphoneButton").className = "";
				
			};

			recognition.onerror = function(event) {
				
				document.getElementById("microphoneButton").className = "";
				
				//document.getElementById("output").value = 'Error occurred in recognition : ' + event.error;
				
			}
			
			document.querySelector('#microphoneButton').addEventListener('click', function(){
				
				if(document.getElementById("microphoneButton").className == "activeMicrophone"){
					
					recognition.stop();
					
					document.getElementById("microphoneButton").className = "";
					
				}
				
				else{
					
					recognition.start();
					
					document.getElementById("microphoneButton").className = "activeMicrophone";
					
				}
				
			});
			
		}
		
		else{
			
			document.getElementById("microphoneError").innerHTML = 'Your browser does not support voice recognition';
			
		}
	
	}
	
});

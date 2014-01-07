// This is a text adventure. All rights are fucked up and shit is rad.


// Declare general things.

var Saves = new Meteor.Collection("Saves");

var currentdesc, playerobj, attempt, CurrentDecision;

var player = {
    // Current state
    health: 100,
    wealth: 0,


    // Characteristics
    strength: 1,
    dexterity: 1,
    perception: 1,
    intellegence: 1,

    choices: {},
	inventory: {
    "something": 1,
    "morestuff": 20

	}
};
startUp();


//Game mechanics
function startUp(){

	

	if (Meteor.isClient) {
		Session.set("Player", player);
		currentdesc = Session.get("currentdesc");

		playerobj = Session.get("Player");

	}
}
// save system



function Decision(decision){
	if (Meteor.isClient){
		CurrentDecision = decision;
		Session.set("choices", CurrentDecision.choices);
		//CurrentDecision = Session.get("CurrentDecision");
		
		displayChoiceUI(CurrentDecision)
	}
	findDecision(decision);
}

function Choice(selection) {
	if (Meteor.isClient){
		
		choiceEffects(selection)
		
		printDebug();
	}
}

function choiceEffects(selection){
					selection -= 1;
					var playerobject = Session.get("Player"), pick, n;
					
					n = 0;
					for (var i in CurrentDecision.choices){
							if (n == selection){
								pick = CurrentDecision.choices[i].name;
							}
							n++
					};
					if (CurrentDecision.matters){
						playerobj.choices[CurrentDecision.matters] = { // Write down what we picked 
							choice: selection + 1,
							description: pick
						};
					}
					CurrentDecision.choices[selection].consequence(); // See how what we picked affects us
				
}

// User interface


function displayChoiceUI(options){
	Print(options.description, 1);
	
    // Print them out
		var m = 0, val;
		for (var i in options.choices) {
			
			if (options.choices[i]){
				val = options.choices[i].condition;
				if (val|| val == null) {
					Print( (parseInt(m)+parseInt(1)) + ". " + options.choices[i].name , parseInt(m) + parseInt(2) );
				}
				else if (val == false){
					Print( (parseInt(m)+parseInt(1)) + ". " +  options.choices[i].unavailable , parseInt(m) + parseInt(2) );
				}
			}
			m++;
		}
		
}

function Print(string, number) {
	if (Meteor.isClient) {

		if (number == 1) { // For descriptions
		
			Session.set("currentdesc",string);
			
		} 
		
	}
}

function printChoices(choices) {
	
}
function printDebug() { // Print the debug info
		
		if (Meteor.isClient) {
					var choices = JSON.stringify(playerobj.choices),
					inventory = JSON.stringify(playerobj.inventory),
					debugchoices = choices,
					debuginventory = inventory;
			
					Session.set("debugchoices", debugchoices);
					Session.set("debuginventory", debuginventory);

			
		}

}

if (Meteor.isClient) {
			
			Template.usermenu.events({
				'click .save':function(){
					if (true) 
					{
						Save(CurrentDecision);
					}
				},
				'click .load':function(){
					if (true) 
					{
						Load()
					}
				}
			});
            Template.main.desc = function(){
				var string = [], desc = Session.get("currentdesc");
					string = desc.split("\n");
				return string;
			};
            Template.below.choice = function(){
				var obj = [], n;
				n = 0,
				choices = Session.get("choices");
				for (var i in choices){

					if (choices[i]) {
						obj.push(choices[i]);
						
						obj[n].clas = "choose" + (n+1);
						
					}
				n++;
				}; 
				return obj;
			};
			
			Template.below.valid = function(){
				if (this.condition == null || this.condition != false){
					return true;
				}
			}

			
			Template.debug.objects = function(){
				return " Choices :" + Session.get("debugchoices") + " Inventory :" + Session.get("debuginventory") + " Selected choice :" + Session.get("debugselectedchoice");
			};
			
			Template.below.events({
				'click p.choose1': function () {
						attempt = 1;
						Choice(attempt);
					},
				'click p.choose2': function () {
						attempt = 2;
						Choice(attempt);
					},
				'click p.choose3': function () {
						attempt = 3;
						Choice(attempt);
					},
				'click p.choose4': function () {
						attempt = 4;
						Choice(attempt);
					},
				'click p.choose5': function () {
						attempt = 5;
						Choice(attempt);
					},
				'click p.choose6': function () {
						attempt = 6;
						Choice(attempt);
					}
					
			
			});


}


// The actual game


	var intro = {
		intro_text:{
			name : "intro text 0",
			description: "This is the world of the day after tomorow.\n Once as powerfull and mighty as corrupted and sinned, the hummanity has driven itself into a dead end. Since the catastrophe Earth has been populated by terrible creatures, polluted by radiation and other hazards, mostly turned into deserts or dangerous enviroments not yet inspected by mankind. \nHumans, as usual, survived. Slowly, year after year, they regained lost pieces of culture and progress. Due to harsh enviroment huge fortresses became the only places where people lived.  hese cities, with their own societies and goverments, covered new continents with a pattern of chaotically placed dots.  \nMost people never go outside the walls of their city. Because outside there is only death for them. \nFor a long time the settlements were completely separated from eachother. But as technology progressed and needs expanded politics started to reappear on desolated lands. That produced a high need for a way to transfer information between strongholds. To satisfy that very need a new profession was born.",
			//description: 
			choices: [
						{
								name: "Continue...",
								
								condition: null,
								unavailable: null,
								consequence: function(){printDebug(); Decision(intro.intro_text_1);}
								}]

			},

		intro_text_1:{
			name : "intro text 1",
			description: "\nThe conductors. They were the ones, who could cross thousand miles, slipping past all dangers of the new world, from one city to another. All alone. They always do it alone, because a lone man can easily pass somewhere, where even an armed squad would fail. \nYou are one of them. You are a Condutor, the only thing that connects cities together and allows for information to transfer. You are armed with a great deal of experience, ability to defend yourself, a steel nerve and knowledge of such things as physics, biology, medicine and many more.",
			choices: [
						{
								name: "Start the adventure.",
								
								condition: null,
								unavailable: null,
								consequence: function(){printDebug(); Decision(Chapter1.area1.decision_a1_1);}
								}]

			},

	},
	Chapter1 = {
		area1: {
			decision_a1_1: {
				description: "Finally the long trip of yours is over. Before you stands a six meters high stone wall of the town called Agrad. There is an enourmous gate, that probably have never been opened since it's construction. As an experienced conductor you quickly notice a small reinforced metal door in the gate.",
				choices: [
							{
									name: "Knock the door",
									
									condition: null,
									unavailable: null,
									consequence: function(){printDebug(); Decision(intro_text_1);}
									},
							{
									name: "Kick the door",
									
									condition: null,
									unavailable: null,
									consequence: function(){printDebug(); Decision(intro_text_1);}
									},
						
				]

			},
				
		}
		
	};
function Play(){
	
	Decision(intro.intro_text);
	
}

function serverSave(decision, save){
			if (Saves.find({_id: Meteor.userId()})) {
						
						Saves.update( {_id: Meteor.userId()}, {save: save} )
						
						console.log("Updated saves")
			}
			else { 
						Saves.insert(save)
						console.log("Created saves")
			}
		
}
function Save(decision) {
			if (Meteor.userId()) {
				player = Session.get("Player");
				var save = {	
						_id: Meteor.userId(),
						player: player,
						decision:  decision.name
				};
				console.log(JSON.stringify(save));
				serverSave(decision, save)
					
				console.log("Saved");
			}
	}
	
function Load(){
	var des;
		if (Meteor.isServer){
			if (Meteor.userId()){
				if (Saves.find({_id: Meteor.userId()}).save != undefined ){
					console.log(JSON.stringify(Saves.find({_id: Meteor.userId()}).save));
					player = Saves.find(Meteor.userId()).save.player;
					des: Saves.find({_id: Meteor.userId()}).save.decision;
					console.log("Trying to start from the point we need");
					des = findDecision(des);
					Decision(des);
				}
			}
		}
}


function findDecision(decision){
	var find = null;
	
	for (var i in intro){
		if (intro[i].name == decision){
				find = intro[i];
			break;
		}
	}
	return find;
}


Play();
 


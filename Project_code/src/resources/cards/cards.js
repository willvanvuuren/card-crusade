$(document).on("click", ".flip-container", function () {
	$(this).toggleClass('hover');
});
// This value is used to keep track of the movement of the cards
var index = 0;
// zIndex Value to keep track 
var zValueStart= -1000
//selects the id for card1 element
var card1 = document.getElementById('cardContainer1');
//selects the id for card2 element
var card2 = document.getElementById('cardContainer2');

//used to store the html location of Deck 1 & Deck 2
var deck1Pile =document.getElementById("Deck1");
var deck2Pile =document.getElementById("Deck2");

//used to store the card ids for the cards in a players deck for access, reinitialized
var deck1Ids =[];
var deck2Ids=[];

//global score values
var P1Score =0;
var P2Score =0;

//zindex for viewing cards
var card1zIndex =0;
var card2zIndex =0;


//global values for decks, decks should be shuffled
var deck1 =[1,2,3];
var deck2 =[1,2,3];

//global var to keep track of the ids for the cards in the tie pile
var TiePile =[];
//globar var to keep track of the values of the cards in the tie pile
var TiePileValues=[];

//html elements for card count in deck
var P1CardCountHTML = document.getElementById('deck1Cards');
var P2CardCountHTML = document.getElementById('deck2Cards');


//html elements for score count
var P1ScoreHTML = document.getElementById("P1Score");
var P2ScoreHTML = document.getElementById("P2Score");
var winnerHTML = document.getElementById("winner");

//initialize arrays that will keep track of card game
var deck1Play = [];
var deck2Play = [];

//global variable to store old values of cards and cardIDs, this will be used primarily for 
var oldCardID=[]
var oldCardValue=[]

//global variable to store round 
var round = 0;

//Who Won Flag ,0=tie, 1=1P,2=2P,-1 =starting game
var whoWonLastRound = -1;
//slightly deprecated but used to keep track of the html values of the cards
// var html1 = "<div class='col-sm' id='card1' ;'><div class='flip-box'> <div class='flip-box-inner'> <div class='flip-box-front'> <img alt='Card1' style='width:150px;height:250px'> </div> <div class='flip-box-back'> <h2 id= 'Card2Title'>Card 2</h2> <p>This is the value of the card</p> <p class='p-3 border bg-dark' id='Card2Value' style='width:10px;left:50%;text-align:center;'>2</p> </div> </div></div></div>";
// var html2 = "<div class='col-sm' id='card2' ;'><div class='flip-box'> <div class='flip-box-inner'> <div class='flip-box-front'> <img alt='Player2' style='width:150px;height:250px'> </div> <div class='flip-box-back'> <h2 id= 'Card2Title'>Card 2</h2> <p>This is the value of the card</p> <p class='p-3 border bg-dark' id='Card2Value' style='width:10px;left:50%;text-align:center;'>2</p> </div> </div></div></div>";

var lastPlayedNonTieId =[];
var lastPlayedNonTieValue =[];

// Helper function to shuffle decks,fisher-yates algorithm

function shuffleDeck(array1){
	for(let y=array1.length-1;y>0;y--){
		const indexer = Math.floor(Math.random()*(y+1));
		const placer = array1[y];
		array1[y]=array1[indexer];
		array1[indexer] =placer;

	}
}

//function used to start a new game and generate a deck
function startGame(){

	// Used to shuffle deck once shuffle is implemented
	// shuffleDeck(deck1);
	// shuffleDeck(deck2);
	

	//Reset Game Score and WhoWonFlag
	P1Score=0;
	P2Score=0;
	whoWonLastRound = -1;
	P1CardCountHTML.innerText="Cards Left: "+deck1.length;
	P2CardCountHTML.innerText="Cards Left: "+deck2.length;
	
	//reset arrays that will keep track of card game
	deck1Play = [];
	deck2Play = [];

	//copy deck 1 and deck 2 values
	deck1Play =[...deck1];
	deck2Play = [...deck2];

	//shuffle decks
	shuffleDeck(deck1Play);
	shuffleDeck(deck2Play);

	//reset Deck Ids
	deck1Ids =[];
	deck2Ids=[];

	//deck id values
	deck1IDValue ={};
	deck2IDValue ={};

	//refresh zIndex; not really necessary 
	card1zIndex =0;
	card2zIndex =0;


	//untested remove feature here
	//remove lingering Children inside deck1Pile and deck2Pile
	deck1Pile.innerHTML="";
	deck2Pile.innerHTML="";
	document.getElementById("TieField").innerHTML="";
	//untested remove feature above
	document.getElementById("P1Field").innerHTML="<p>P1 Card</p><p id='deck1Cards'>Cards Left:"+(deck1Play.length)+" </p><div id ='P1FieldCardHolder'></div>";
	document.getElementById("P2Field").innerHTML="<p>P2 Card</p><p id='deck2Cards'>Cards Left:"+(deck2Play.length)+" </p><div id ='P2FieldCardHolder'></div>";
	document.getElementById("P1Score").innerText = 0;
	document.getElementById("P2Score").innerText = 0;
	for(let i =0;i<deck1Play.length;i++){

		//create new card element
		const newCard1= document.createElement('div');
		const newCard2= document.createElement('div');

		//create new card value
		let card1Value= deck1Play[i];
		let card2Value= deck2Play[i];

		//set the id for each individual card for css and js manipulation
		newCard1.id = '1Pcard'+i;
		newCard2.id = '2Pcard'+i;

		//create the id for values of cards 1 and 2
		let newCard1ValueId="1PCardValue"+i;
		let newCard2ValueId="2PCardValue"+i;

		//setting the HTML of newCard 1 and 2 ,specifically controlling for card value and card value id 
		newCard1.innerHTML= "<div class='col-sm' id='cardContainer1' ><div class = 'row'> <h6 > Player 1 </h6> </div> <div class ='row'> <h2 id= 'Card1Title'>Card "+i+"</h2> </div> <div class ='row'> <p>This is the value of the card</p> <p class='p-3 border bg-secondary' id='"+newCard1ValueId+"' style='width:10px;left:50%;text-align:center;margin:auto;'>"+card1Value+"</p> </div> </div> ";
		newCard2.innerHTML="<div class='col-sm' id='cardContainer2'><div class = 'row'> <h6 > Player 2 </h6> </div> <div class ='row'> <h2 id= 'Card2Title'>Card "+i+"</h2> </div> <div class ='row'> <p>This is the value of the card</p> <p class='p-3 border bg-secondary' id='"+newCard2ValueId+"' style='width:10px;left:50%;text-align:center;margin:auto;'>"+card2Value+"</p> </div> </div> "
		//zindex added
		card1zIndex++;
		card2zIndex--;

		newCard1.style.position='inline';
		newCard1.style.zIndex=card1zIndex;
		// newCard1.style.display="none";

		newCard2.style.zIndex=card2zIndex;
		newCard2.style.position='inline';
		// newCard2.style.display="none"

		
		deck1Pile.appendChild(newCard1);
		deck1Ids.push([newCard1.id,newCard1ValueId]);
		

		deck2Pile.appendChild(newCard2);
		deck2Ids.push(newCard1.id);

		//hotfix
		deck1IDValue[newCard1.id]=newCard1ValueId;
		deck2IDValue[newCard2.id]=newCard2ValueId;

		console.log(deck1Ids);
	}
	//entry to new game
	console.log("New Game Started");
	console.log("P1Score: "+P1Score+", P2Score: "+P2Score)
	console.log("deck1Values: " +deck1Play+", deck1Ids: "+deck1Ids);
	console.log("deck2Values: " +deck2Play+", deck2Ids: "+deck2Ids);
	
}

function playCard(){
	// document.getElementById("P1Field").innerHTML="<p>P1 Card</p><p id='deck1Cards'>Cards Left: </p>";
	// document.getElementById("P2Field").innerHTML="<p>P2 Card</p><p id='deck2Cards'>Cards Left: </p>";
	
	//check for game end condition
	P1CardCountHTML.innerText="Cards Left: "+(deck1Play.length-1);
	P2CardCountHTML.innerText="Cards Left: "+(deck2Play.length-1);

	if(deck1Play.length===0 ||deck2Play.length===0 ||round >=50){
		let P1Score = document.getElementById("P1Score").innerText;
		let P2Score = document.getElementById("P2Score").innerText;
		P1CardCountHTML.innerText="Cards Left: "+(deck1Play.length);
		P2CardCountHTML.innerText="Cards Left: "+(deck2Play.length);

		
		if(P1Score>P2Score){

			document.getElementById('winner').innerText = "P1 wins the game!";
		}else if(P2Score>P1Score){
			document.getElementById('winner').innerText = "P2 wins the game!";

		}else{
			document.getElementById('winner').innerText = "It's a final tie!";
		}

	}

	//handles the case where game does not end
	else{
			
			shuffleDeck(deck1Play);
			shuffleDeck(deck2Play);
			//select the first element of both player decks

			let P1CardID = deck1Ids[0];
			let P2CardID = deck2Ids[0];
			
			//used to select the HTML elements of the cards

			let P1CardHTML = document.getElementById(P1CardID);
			let P2CardHTML = document.getElementById(P2CardID);

			console.log("Last Played ID's: ");
			console.log(lastPlayedNonTieId);
			if(whoWonLastRound===1 && round >0){
				

				$("#"+lastPlayedNonTieId[0]).appendTo("#Deck1");
				$("#"+lastPlayedNonTieId[1]).appendTo("#Deck1");
				lastPlayedNonTieId=lastPlayedNonTieId.slice(1);
				lastPlayedNonTieId=lastPlayedNonTieId.slice(1);
				
			} else if(whoWonLastRound===2 && round>0){
				$("#"+lastPlayedNonTieId[0]).appendTo("#Deck2");
				$("#"+lastPlayedNonTieId[1]).appendTo("#Deck2");
				lastPlayedNonTieId=lastPlayedNonTieId.slice(1);
				lastPlayedNonTieId=lastPlayedNonTieId.slice(1);
			}
			

			// P1CardHTML.style.position = 'absolute';
			P1CardHTML.style.display = 'inline';

			// P2CardHTML.style.position = 'absolute';
			P2CardHTML.style.position = 'inline';
			//card to move cards from deck into play field
			deckToField(P1CardHTML,P2CardHTML,P1CardID,P2CardID);

			

			//use this to score the cards and move to deck
			score(P1CardID,P2CardID);

			

			//removes first id of cards from the array
			deck1Ids=deck1Ids.slice(1);
			deck2Ids=deck2Ids.slice(1);
			
			//removes first value of cards from the array
			deck1Play=deck1Play.slice(1);
			deck2Play=deck2Play.slice(1);
			round++;
			console.log("Deck1: "+deck1Play);
			console.log("Deck2: "+deck2Play);
			console.log("TieDeck: "+TiePileValues)
			console.log("Round #: "+round);

			}
}

// deprecatedfunction to generate the decks of both players
// function generateDecks(){
// 	for(let i =0;i<deck1.length;i++){
		
// 		//create new card element
// 		const newCard1= document.createElement('div');
// 		const newCard2= document.createElement('div');

// 		//create new card value
// 		let card1Value= deck1[i];
// 		let card2Value= deck2[i];

// 		// Setting the ID for card 1 and 2 in order to manipulate it in the future
// 		newCard1.id = '1Pcard'+i;
// 		newCard2.id = '2Pcard'+i;

// 		//id for value selection
// 		let newCard1ValueId="1PCardValue"+i;
// 		let newCard2ValueId="2PCardValue"+i;
// 		//setting the HTML of newCard 1 and 2 ,specifically controlling for card value and card value id 
// 		newCard1.innerHTML= "<div class='col-sm' id='card1' ;'><div class='flip-box'> <div class='flip-box-inner'> <div class='flip-box-front'> <img alt='Player1' style='width:150px;height:250px'> </div> <div class='flip-box-back'> <h2 id= 'Card1Title'>Card 1</h2> <p>This is the value of the card</p> <p class='p-3 border bg-dark' id='"+newCard1ValueId+"' style='width:10px;left:50%;text-align:center;'>"+card1Value+"</p> </div> </div></div></div>";
// 		newCard2.innerHTML="<div class='col-sm' id='card2' ;'><div class='flip-box'> <div class='flip-box-inner'> <div class='flip-box-front'> <img alt='Player2' style='width:150px;height:250px'> </div> <div class='flip-box-back'> <h2 id= 'Card2Title'>Card 2</h2> <p>This is the value of the card</p> <p class='p-3 border bg-dark' id='"+newCard2ValueId+"' style='width:10px;left:50%;text-align:center;'>"+card2Value+"</p> </div> </div></div></div>";
		
	
// 		//styling properties for card 1 
// 		newCard1.style.position="absolute";
// 		newCard1.style.display="inline";
// 		newCard1.style.zIndex=zValueStart+i;
		
// 		//styling properties for card 2
// 		newCard2.style.position="absolute";
// 		newCard2.style.display="inline";
// 		newCard2.style.zIndex=zValueStart+i;
		
		
// 		console.log("card1Value: "+card1Value );
// 		//have to add value from array into card


// 		deck1Pile.appendChild(newCard1);
// 		deck2Pile.appendChild(newCard2);
// 		deck1Ids.push(newCard1.id);
// 		deck2Ids.push(newCard2.id);

// 	}
// }

function score(card1Id,card2Id){
	
	//retrieves HTML elements for cards
	let card1html =document.getElementById(card1Id);
	let card2html =document.getElementById(card2Id);
	let TieField =document.getElementById("TieField");

	// //retrieves first element of deck values for comparison
	// card1Value= deck1Play[0];
	// card2Value= deck2Play[0];

	card1Value= deck1IDValue[card1Id];
	card2Value= deck2IDValue[card2Id];
	//P1  conditions
	if(card1Value>card2Value){
		P1Score++;
		P1ScoreHTML.innerText = P1Score;
		winnerHTML.innerText = "P1 wins!";
		whoWonLastRound=1;
		deck1Play.push(card1Value,card2Value);
		deck1Ids.push(card1Id,card2Id);
		// $("#"+card1Id).appendTo("#Deck1");
		// $("#"+card2Id).appendTo("#Deck2");
		lastPlayedNonTieId.push(card1Id,card2Id);
		lastPlayedNonTieValue.push(card1Value,card2Value);
		console.log("added: "+card1Id+" and "+card2Id+" to last pile");
		if(TiePile.length >0){
	
			fieldToNext();
	
		}
		

	}
	//P2  Conditions
	else if(card1Value<card2Value){
		P2Score++;
		P2ScoreHTML.innerText = P2Score;
		winnerHTML.innerText = "P2 wins!";
		whoWonLastRound=2;
		deck2Play.push(card1Value,card2Value);
		deck2Ids.push(card1Id,card2Id);
		// $("#"+card1Id).appendTo(deck2Pile);
		// $("#"+card2Id).appendTo(deck2Pile);
		lastPlayedNonTieId.push(card1Id,card2Id);
		lastPlayedNonTieValue.push(card1Value,card2Value);
		console.log("added: "+card1Id+" and "+card2Id+" to last pile");
		if(TiePile.length >0){
	
			fieldToNext(TiePile,TiePileValues);
	
		}

	}
	//Tie Conditions
	else if(card1Value===card2Value){
		whoWonLastRound=0;

		document.getElementById('winner').innerText = "It's a tie!";
		
		TieField.appendChild(card1html);
		TieField.appendChild(card2html);
		TiePile.push(card1Id);
		TiePile.push(card2Id);
		TiePileValues.push(card1Value,card2Value);
		
	}
	console.log("P1Score: "+ card1Value+" v. P2Score: "+card2Value);
	
	
}

function deckToField(card1,card2,card1Id,card2Id){
	

	let field1 =document.getElementById("P1FieldCardHolder");
	let field2 =document.getElementById("P2FieldCardHolder");

	$("#"+card1Id).appendTo("#P1FieldCardHolder");
	$("#"+card2Id).appendTo("#P2FieldCardHolder");


	

	// Animation Code Disabled For Functionality
	// let start = Date.now();

	// let timer = setInterval(function(){
	// 	let timePassed = Date.now() -start;
	// 	let card1id = '1Pcard'+index;
	// 	let card2id = '2Pcard'+index;
	

	// 	let card1 =document.getElementById(card1id);
	// 	let card2 =document.getElementById(card2id);
	// 	let field1 =document.getElementById("P1Field");
	// 	let field2 =document.getElementById("P2Field");
		

	// 	// This is the code that contains the animations
	// 	// card1.style.position = 'relative';
	// 	// card1.style.left = timePassed/5 +'px';
	// 	// card1.style.bottom = timePassed/5 +'px';

	// 	// card2.style.position = 'relative';
	// 	// card2.style.right = timePassed/5 +'px';
	// 	// card2.style.bottom = timePassed/5 +'px';
		
	// field1.appendChild(card1);
	// field2.appendChild(card2);

	
	// if (timePassed>1000){
	// 		clearInterval(timer);
	// 	}
	// },20);
	
	

}

//function that handles transition between draw rounds
function fieldToNext(){
		while(TiePile.length!=0){
			let card1Temp = document.getElementById(TiePile[0]);
			let card2Temp = document.getElementById(TiePile[1]);
			let card1Value = deck1IDValue[TiePile[0]];
			let card2Value = deck1IDValue[TiePile[1]];
			if(whoWonLastRound===1){
				deck1Pile.appendChild(card1Temp);
				deck1Pile.appendChild(card2Temp);
				deck1Play.push(card1Value,card2Value);
				deck1Ids.push(TiePile[0],TiePile[1]);

			} else if(whoWonLastRound===2){
				deck2Pile.appendChild(card1Temp);
				deck2Pile.appendChild(card2Temp);
				deck2Play.push(card1Value,card2Value);
				deck2Ids.push(TiePile[0],TiePile[1]);
		}
			TiePile=TiePile.slice(1);
			TiePile=TiePile.slice(1);
			TiePileValues=TiePileValues.slice(1); 
			TiePileValues=TiePileValues.slice(1); 
	}
}


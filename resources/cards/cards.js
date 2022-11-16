// This value is used to keep track of the movement of the cards
var index = 0;
// zIndex Value to keep track 
var zValueStart= -1000
//selects the id for card1 element
var card1 = document.getElementById('card1');
//selects the id for card2 element
var card2 = document.getElementById('card2');

//used to store the html location of Deck 1 & Deck 2
var deck1Pile =document.getElementById("Deck1");
var deck2Pile =document.getElementById("Deck2");

//used to store the card ids for the cards in a players deck for access, reinitialized
var deck1Ids =[];
var deck2Ids=[];

//global score values
var P1Score =0;
var P2Score =0;

//global values for decks, decks should be shuffled
var deck1 =[9,9,9];
var deck2 =[9,9,10];

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
var WinnerHTML = document.getElementById("winner");

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


	//untested remove feature here
	//remove lingering Children inside deck1Pile and deck2Pile
	deck1Pile.innerHTML="";
	deck2Pile.innerHTML="";
	//untested remove feature above


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
		newCard1.innerHTML= "<div class='col-sm' id='card1' ;'><div class='flip-box'> <div class='flip-box-inner'> <div class='flip-box-front'> <img alt='Player1' style='width:150px;height:250px'> </div> <div class='flip-box-back'> <h2 id= 'Card1Title'>Card 1</h2> <p>This is the value of the card</p> <p class='p-3 border bg-dark' id='"+newCard1ValueId+"' style='width:10px;left:50%;text-align:center;'>"+card1Value+"</p> </div> </div></div></div>";
		newCard2.innerHTML="<div class='col-sm' id='card2' ;'><div class='flip-box'> <div class='flip-box-inner'> <div class='flip-box-front'> <img alt='Player2' style='width:150px;height:250px'> </div> <div class='flip-box-back'> <h2 id= 'Card2Title'>Card 2</h2> <p>This is the value of the card</p> <p class='p-3 border bg-dark' id='"+newCard2ValueId+"' style='width:10px;left:50%;text-align:center;'>"+card2Value+"</p> </div> </div></div></div>";
		
		deck1Pile.appendChild(newCard1);

		deck1Ids.push(newCard1.id);

		deck2Pile.appendChild(newCard2);
		deck2Ids.push(newCard2.id);
	}
	//entry to new game
	console.log("New Game Started");
	console.log("P1Score: "+P1Score+", P2Score: "+P2Score)
	console.log("deck1Values: " +deck1Play+", deck1Ids: "+deck1Ids);
	console.log("deck2Values: " +deck2Play+", deck2Ids: "+deck2Ids);
	
}

function playCard(){
	//check for game end condition
	if(deck1Play.length===0 ||deck2Play.length===0){
		let P1Score = document.getElementById("P1Score").innerText;
		let P2Score = document.getElementById("P2Score").innerText;
		console.log(P1Score+" "+P2Score)
		if(P1Score>P2Score){
			document.getElementById('winner').innerText = "P1 Wins the game!";
		}else if(P2Score>P1Score){
			document.getElementById('winner').innerText = "P2 Wins the game!";
		}else{
			document.getElementById('winner').innerText = "It's a final tie!";
		}

	}
	//handles the case where game does not end
	else{

		if(round>0){

			fieldToNext(oldCardID[0],oldCardID[1],oldCardValue[0],oldCardValue[1]);
			oldCardID= oldCardID.slice(1);
			oldCardID= oldCardID.slice(1);
			oldCardValue=oldCardValue.slice(1);
			oldCardValue=oldCardValue.slice(1);
		}
			//select the first element of both player decks

			let P1CardID = deck1Ids[0];
			let P2CardID = deck2Ids[0];
			
			//used to select the HTML elements of the cards
			let P1CardHTML = document.getElementById(P1CardID);
			let P2CardHTML = document.getElementById(P2CardID);

			//card to move cards from deck into play field
			deckToField(P1CardHTML,P2CardHTML,P1CardID,P2CardID);

			//use this to score the cards and move to deck
			score(P1CardID,P2CardID);

			P1CardHTML.style.position = 'absolute';
			P1CardHTML.style.position = 'inline';
			P2CardHTML.style.position = 'absolute';
			P2CardHTML.style.position = 'inline';
			//removes first id of cards from the array
			deck1Ids=deck1Ids.slice(1);
			deck2Ids=deck2Ids.slice(1);
			
			//removes first value of cards from the array
			deck1Play=deck1Play.slice(1);
			deck2Play=deck2Play.slice(1);
			round++;
			console.log(deck1Play);
			console.log(deck2Play);
			
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

	//retrieves first element of deck values for comparison
	card1Value= deck1Play[0];
	card2Value= deck2Play[0];

	//P1 Win conditions
	if(card1Value>card2Value){
		P1Score++;
		P1ScoreHTML.innerText = P1Score;
		WinnerHTML.innerText = "P1 Wins!";
		whoWonLastRound=1;
		oldCardValue.push(card1Value,card2Value);
		oldCardID.push(card1Id,card2Id);
		if(TiePile.length >0){
	
			for(let t=TiePile.length-1;t>=0;t--){
				
				let tieCard = document.getElementById(TiePile[t]);

				deck1Pile.appendChild(tieCard);
				deck1.push(TiePileValues[t]);
				TiePile.pop();
				TiePileValue.pop();
			}
	
		}

	}
	//P2 Win Conditions
	else if(card1Value<card2Value){
		P2Score++;
		P2ScoreHTML.innerText = P2Score;
		WinnerHTML.innerText = "P2 Wins!";
		whoWonLastRound=2;
		oldCardValue.push(card1Value,card2Value);
		oldCardID.push(card1Id,card2Id);
		if(TiePile.length >0){
	
			for(let t=TiePile.length-1;t>=0;t--){
				
				let tieCard = document.getElementById(TiePile[t]);

				deck2Pile.appendChild(tieCard);
				deck2.push(TiePileValues[t]);
				TiePile.pop();
				TiePileValues.pop();
			}
	
		}
	}
	//Tie Conditions
	else if(card1Value===card2Value){
		document.getElementById('winner').innerText = "It's a tie!";
		
		TieField.appendChild(card1html);
		TieField.appendChild(card2html);
		TiePile.push(card1Id);
		TiePile.push(card2Id);
		TiePileValues.push(card1Value,card2Value);
		
	}
	console.log(deck1Play.length);
	console.log(deck2Play.length);
	
	
}

function deckToField(card1,card2,card1Id,card2Id){
	

	let field1 =document.getElementById("P1Field");
	let field2 =document.getElementById("P2Field");
	field1.appendChild(card1);
	field2.appendChild(card2);


	

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

function fieldToNext(card1ID,card2ID,card1Valued,card2Valued){
		let card1Temp = document.getElementById(card1ID);
		let card2Temp = document.getElementById(card2ID);

		if(whoWonLastRound===1){
			deck1Pile.appendChild(card1Temp);
			deck1Pile.appendChild(card2Temp);
			deck1Play.push(card1Valued,card2Valued);
			deck1Ids.push(card1ID,card2ID);

	}else if(whoWonLastRound===2){
			deck2Pile.appendChild(card1Temp);
			deck2Pile.appendChild(card2Temp);
			deck2Play.push(card1Valued,card2Valued);
			deck2Ids.push(card1ID,card2ID);
	} 
}


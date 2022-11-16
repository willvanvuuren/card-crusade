// This value is used to keep track of the movement of the cards
var index = 0;
// zIndex Value to keep track 
var zValueStart= -1000
//selects the id for card1 element
var card1 = document.getElementById('card1');
//selects the id for card2 element
var card2 = document.getElementById('card2');

var deck1Pile =document.getElementById("Deck1");
var deck2Pile =document.getElementById("Deck2");

var deck1Ids =[];
var deck2Ids=[];

var P1Score =0;
var P2Score =0;
var deck1 =[0,8,5];
var deck2 =[0,5,7];
var TiePile =[];
var TiePileValues=[];
var html1 = "<div class='col-sm' id='card1' ;'><div class='flip-box'> <div class='flip-box-inner'> <div class='flip-box-front'> <img alt='Card1' style='width:150px;height:250px'> </div> <div class='flip-box-back'> <h2 id= 'Card2Title'>Card 2</h2> <p>This is the value of the card</p> <p class='p-3 border bg-dark' id='Card2Value' style='width:10px;left:50%;text-align:center;'>2</p> </div> </div></div></div>";
var html2 = "<div class='col-sm' id='card2' ;'><div class='flip-box'> <div class='flip-box-inner'> <div class='flip-box-front'> <img alt='Player2' style='width:150px;height:250px'> </div> <div class='flip-box-back'> <h2 id= 'Card2Title'>Card 2</h2> <p>This is the value of the card</p> <p class='p-3 border bg-dark' id='Card2Value' style='width:10px;left:50%;text-align:center;'>2</p> </div> </div></div></div>";


// Function to shuffle decks, implement once i get to internet connection

// function shuffle(){
// 	for(let y=0;y<deck1.length;y++){

// 	}
// }


//function to generate the decks of both players
function generateDecks(){
	for(let i =0;i<deck1.length;i++){
		
		//create new card element
		const newCard1= document.createElement('div');
		const newCard2= document.createElement('div');

		//create new card value
		let card1Value= deck1[i];
		let card2Value= deck2[i];

		// Setting the ID for card 1 and 2 in order to manipulate it in the future
		newCard1.id = '1Pcard'+i;
		newCard2.id = '2Pcard'+i;

		//id for value selection
		let newCard1ValueId="1PCardValue"+i;
		let newCard2ValueId="2PCardValue"+i;
		//setting the HTML of newCard 1 and 2 ,specifically controlling for card value and card value id 
		newCard1.innerHTML= "<div class='col-sm' id='card1' ;'><div class='flip-box'> <div class='flip-box-inner'> <div class='flip-box-front'> <img alt='Player1' style='width:150px;height:250px'> </div> <div class='flip-box-back'> <h2 id= 'Card1Title'>Card 1</h2> <p>This is the value of the card</p> <p class='p-3 border bg-dark' id='"+newCard1ValueId+"' style='width:10px;left:50%;text-align:center;'>"+card1Value+"</p> </div> </div></div></div>";
		newCard2.innerHTML="<div class='col-sm' id='card2' ;'><div class='flip-box'> <div class='flip-box-inner'> <div class='flip-box-front'> <img alt='Player2' style='width:150px;height:250px'> </div> <div class='flip-box-back'> <h2 id= 'Card2Title'>Card 2</h2> <p>This is the value of the card</p> <p class='p-3 border bg-dark' id='"+newCard2ValueId+"' style='width:10px;left:50%;text-align:center;'>"+card2Value+"</p> </div> </div></div></div>";
		
	
		//styling properties for card 1 
		newCard1.style.position="absolute";
		newCard1.style.display="inline";
		newCard1.style.zIndex=zValueStart+i;
		
		//styling properties for card 2
		newCard2.style.position="absolute";
		newCard2.style.display="inline";
		newCard2.style.zIndex=zValueStart+i;
		
		
		console.log("card1Value: "+card1Value );
		//have to add value from array into card


		deck1Pile.appendChild(newCard1);
		deck2Pile.appendChild(newCard2);
		deck1Ids.push(newCard1.id);
		deck2Ids.push(newCard2.id);

	}
}

function score(){
	//these two segments retrieve the index id from 
	//since the index is increased everytime the score button is pressed, and continue increases index by 1, index-1 allows access to the proper indexed value since score is after continue
	let card1ValueId = "1PCardValue"+(index-1);
	let card2ValueId = "2PCardValue"+(index-1);
	let card1id = '1Pcard'+(index-1);
	let card2id = '2Pcard'+(index-1);
	let card1 =document.getElementById(card1id);
	let card2 =document.getElementById(card2id);
	let TieField =document.getElementById("TieField");

	card1Value= document.getElementById(card1ValueId).innerText;
	card2Value= document.getElementById(card2ValueId).innerText;

	
	

	if(card1Value>card2Value){
		P1Score++;
		document.getElementById("P1Score").innerText = P1Score;
		document.getElementById('winner').innerText = "P1 Wins!";
		deck1Pile.appendChild(card1);
		deck1Pile.appendChild(card2);
		deck1.push(card1Value,card2Value);
		if(TiePile.length >0){
	
			for(let t=TiePile.length-1;t>=0;t--){
				
				let tieCard = document.getElementById(TiePile[t]);

				deck1Pile.appendChild(tieCard);
				deck1.push(TiePileValues[t]);
				TiePile.pop();
			}
	
		}

	}
	else if(card1Value<card2Value){
		P2Score++;
		document.getElementById("P2Score").innerText = P2Score;
		document.getElementById('winner').innerText = "P2 Wins!";
		deck2Pile.appendChild(card1);
		deck2Pile.appendChild(card2);
		deck2.push(card1Value,card2Value);
		if(TiePile.length >0){
	
			for(let t=TiePile.length-1;t>=0;t--){
				
				let tieCard = document.getElementById(TiePile[t]);

				deck2Pile.appendChild(tieCard);
				deck2.push(TiePileValues[t]);
				TiePile.pop();
			}
	
		}
	}
	else if(card1Value===card2Value){
		document.getElementById('winner').innerText = "It's a tie!";
		
		TieField.appendChild(card1);
		TieField.appendChild(card2);
		TiePile.push(card1id);
		TiePile.push(card2id);
		TiePileValues.push(card1Value,card2Value);
		
	}
	if(deck1.length===0 ||deck2.length===0){
		let P1Score = document.getElementById("P1Score");
		let P2Score = document.getElementById("P2Score");
		if(P1Score>P2Score){
			document.getElementById('winner').innerText = "P1 Wins the game!";
		}else if(P2Score>P1Score){
			document.getElementById('winner').innerText = "P2 Wins the game!";
		}else{
			document.getElementById('winner').innerText = "It's a final tie!";
		}
	}
	
}

function diagonalMove(){
	let card1id = deck1Ids[0];
	let card2id = deck2Ids[0];
	let card1 =document.getElementById(card1id);
	let card2 =document.getElementById(card2id);
	let field1 =document.getElementById("P1Field");
	let field2 =document.getElementById("P2Field");
	field1.appendChild(card1);
	field2.appendChild(card2);

	console.log("deck1: "+deck1+", deck2: "+deck2);

	//remove cards from deck1
	deck1.pop();
	//remove cards from deck2
	deck2.pop();


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
	index++;
	

}



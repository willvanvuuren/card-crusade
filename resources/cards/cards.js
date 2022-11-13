var index = 0;
	var card1 = document.getElementById('card1');
	var card2 = document.getElementById('card2');
	var deck1Div = document.getElementById('Deck1');
	var P1Score =0;
	var P2Score =0;
	var deck1 =[5,3,4,5,6];
	var deck2 =[7,8,9,10,11];
	var html1 = "<div class='col-sm' id='card1' ;'><div class='flip-box'> <div class='flip-box-inner'> <div class='flip-box-front'> <img alt='Card1' style='width:150px;height:250px'> </div> <div class='flip-box-back'> <h2 id= 'Card2Title'>Card 2</h2> <p>This is the value of the card</p> <p class='p-3 border bg-dark' id='Card2Value' style='width:10px;left:50%;text-align:center;'>2</p> </div> </div></div></div>";
	var html2 = "<div class='col-sm' id='card2' ;'><div class='flip-box'> <div class='flip-box-inner'> <div class='flip-box-front'> <img alt='Player2' style='width:150px;height:250px'> </div> <div class='flip-box-back'> <h2 id= 'Card2Title'>Card 2</h2> <p>This is the value of the card</p> <p class='p-3 border bg-dark' id='Card2Value' style='width:10px;left:50%;text-align:center;'>2</p> </div> </div></div></div>";

function generateDecks(){
	for(let i =0;i<deck1.length;i++){
		//copy existing card element that has been disabled, could be replaced with a partial at some point
		const newCard= document.createElement('div');
		let card1Value= deck1[i];
		newCard.innerHTML= "<div class='col-sm' id='card1' ;'><div class='flip-box'> <div class='flip-box-inner'> <div class='flip-box-front'> <img alt='Player1' style='width:150px;height:250px'> </div> <div class='flip-box-back'> <h2 id= 'Card1Title'>Card 1</h2> <p>This is the value of the card</p> <p class='p-3 border bg-dark' id='Card1Value' style='width:10px;left:50%;text-align:center;'>"+card1Value+"</p> </div> </div></div></div>";
		
		newCard.id = '1Pcard'+i;
		

		//stack em with z-index
		newCard.style.position="absolute";
		newCard.style.display="inline";
		newCard.style.zIndex=0-i;
		
		
		
		console.log("card1Value: "+card1Value);
		//have to add value from array into card


		document.getElementById("Deck1").appendChild(newCard);
	}
	for(let i =0;i<deck2.length;i++){
		//copy existing card element that has been disabled, could be replaced with a partial at some point
		const newCard= document.createElement('div');
		newCard.innerHTML = html2;
		
		newCard.id = '2Pcard'+i;
		
		const cardValue= deck2[i];

		//stack em with z-index
		newCard.style.position="absolute";
		newCard.style.display="inline";
		newCard.style.zIndex=0-i;
		
		
	


		document.getElementById("Deck2").appendChild(newCard);
	}
}

function score(){
	card1Value= document.getElementById('Card2Value').innerText;
	card2Value= document.getElementById('Card2Value').innerText;
	if(card1Value>card2Value){
		P1Score++;
		document.getElementById("P1Score").innerText = P1Score;
		document.getElementById('winner').innerText = "P1 Wins!";
	}
	else if(card1Value<card2Value){
		P2Score++;
		document.getElementById("P2Score").innerText = P2Score;
		document.getElementById('winner').innerText = "P2 Wins!";
	}
	else if(card1Value===card2Value){
		document.getElementById('winner').innerText = "It's a tie!";
	}
}

function diagonalMove(){
	let start = Date.now();
	let timer = setInterval(function(){
	let timePassed = Date.now() -start;
	let card1id = '1Pcard'+index;
	let card2id = '2Pcard'+index;
	
	let card1 =document.getElementById(card1id);
	let card2 =document.getElementById(card2id);

	// let card2 =document.getElementById('2Pcard2')
	card1.style.position = 'relative';
	card1.style.left = timePassed/5 +'px';
	card1.style.bottom = timePassed/5 +'px';

	card2.style.position = 'relative';
	card2.style.right = timePassed/5 +'px';
	card2.style.bottom = timePassed/5 +'px';
	if (timePassed>1000){
			clearInterval(timer);
		}
	},20);
	index++
}



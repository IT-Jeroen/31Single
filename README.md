# 31 Single  

## Game Rules:  
* The purpose of this card game is to score 31 points, and or not to score the lowest number of points.  
* All number cards are worth their number value, All picture cards are worth 10 points, except Aces, which are worth 11 points.  
* You need to collect three cards from the same suite (heart, club, spade, diamond) to be able to collect 31.  
* You can collect three different suite cards with the same rank which will give you a score of 30.5 (Also with 3 aces). 
* The first player (local player) has the option to swap all cards with the bank without having to fold, at its first turn.
* Swapping all cards with the bank by default will end your turn, and will force you to fold/hold
* If one player scores 31, all other players will get one last turn. (A badge displaying 31 will appear)  
* If all other players fold/hold then the the last player will get one last turn. (A player who folds/hold will display a red stroke around the cards)  
* An orange stroke will appear around the cards of the auto-player who's turn it is.  

## Purpose:  
* The purpose of this project is to build up a portfolio as my resume, to display my skills for an entry-level full-stack web develloper job.  
	
## Challenges:  
* Not knowing where to start or what works it took some time to work out the best way for placing cards in their designated zones.  
* css tranform has some unexpected outcomes on translate when applying scale or rotate, and a mix of inline transform and css file transform doesn't work.  
* There is a time difference between what gets rendered in the DOM and what gets processed as javaScript. Right now that is handled by adding timeOut delays.  
* The number of possible moves the auto player can make is chalenging to predict. And it can easily lock into an infinte loop.  
	
## Future Desires:  
* I would like to look into async functions to get rid of the timeOut delays as the outcome of that is probably system dependent.  
* I would like to add some quesing for the autoplayer, or for it to alter it train of thoughts to make changes to the conditions for breaking the infinite loop.  
* I would like to turn this single player version into a multi player version.  
* Intergrate css variables and js variables more tightly from a single source  
	
## Running The Game:  
* The game runs as a github page: [31Single](https://it-jeroen.github.io/31Single/)  
* Run the game localy: Download index.html, index.js and styles.css into the same folder. Open index.html with a web browser 

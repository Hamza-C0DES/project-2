// CREATING A ANSWER VALIDATOR 

function answerValidator(userInput,requiredFirstLetter) {
    if (userInput[0] == requiredFirstLetter){
        console.log("Successful Input"); 
        return true;
    }
    else{
        console.log("Invalid Input");
        return false;
    }
    
}
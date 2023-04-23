/**
 * Scissor = 0
 * Paper = 1
 * Rock = 2
 * Lizard = 3
 * Spock = 4
 * 
 * Conditions
 *  0 beats 1 and 3
 *  1 beats 2 and 4
 *  2 beats 3 and 0
 *  3 beats 4 and 1
 *  4 beats 0 and 2
 * 
 * Based on the conditions above a value can defeat its +1 and +3 ( if in advance mode) sum
 *  So we can make a if condition like:
 *  if computer pick value is equal to player pick value +1 or player pick value +3, the user wins
 *  else if computer pick value is equal to player pick value, the result is draw
 *  else, player lose;
 */

// variables
let elementIDs = [
                    'header-text',
                    'btn-change-mode',
                    'img-rules',
                    'game-option-container',
                    'game-scissors',
                    'game-paper',
                    'game-rock',
                    'game-spock',
                    'game-lizard',
                    'rules',
                    'game-result-container'
                ];
let elementFilter = [ 'game-scissors', 'game-paper', 'game-rock', 'game-spock', 'game-lizard', 'rules', 'game-result-container' ];
let domStorage = {};
let normalClass = 'game-mode-normal';
let advanceClass = 'game-mode-advance';
let selection = [ 'scissors', 'paper', 'rock', 'lizard', 'spock' ];
let playerPick = -1;
let computerPick = -1;
let gameMode = 0;
let localStorageScoreItem = 'rockPaperScissorsLizardSpock_score';

// Functions
function init() {
    // Initialize the sessionStorage's score item if not yet initialized
    if( localStorage.getItem( localStorageScoreItem ) === null ) {
        localStorage.setItem( localStorageScoreItem, 0);
    }
    // Initialize if the element var holder is null
    if( Object.keys(domStorage) <= 0  ) {
        // Get all the element details
        getDomElements( elementIDs );
    }

    if( domStorage['header-text'] != null ) { return true; }
    return false;
}

function changeGameMode() {
    if( !init() || playerPick > -1 ) { return; }

    gameMode = ( gameMode ) ? 0 : 1;

    fadeOutElements();

    setTimeout( () => {
        if( domStorage['header-text'].classList.contains( normalClass ) ) {
            modifyElementClass( domStorage, normalClass, advanceClass, elementFilter );
        } else if( domStorage['header-text'].classList.contains( advanceClass ) ) {
            modifyElementClass( domStorage, advanceClass, normalClass, elementFilter );
        }
        fadeInElements();
    }, 500 );
}

function fadeInElements() {
    if( !init() ) { return; }

    modifyElementClass( domStorage, 'fadeOut', 'fadeIn', elementFilter );
}

function fadeOutElements() {
    if( !init() ) { return; }
    
    modifyElementClass( domStorage, 'fadeIn', 'fadeOut', elementFilter );
}

function showRules() {
    if( !init() || domStorage['rules'] == null ) { return; }

    modifyElementClass( { 'rules': domStorage['rules'] }, 'fadeOut', 'fadeIn' );
}

function hideRules() {
    if( !init() || domStorage['rules'] == null ) { return; }
    
    modifyElementClass( { 'rules': domStorage['rules'] }, 'fadeIn', 'fadeOut' );
}

function getDomElements( elementIDs ) {
    if( !Array.isArray(elementIDs) ) { return false; }
    if( elementIDs.length <= 0 ) { return false; }

    for( let a = 0; a < elementIDs.length; a++ ) {
        let tmpElementHolder;

        if( ( tmpElementHolder = document.getElementById( elementIDs[a] ) ) != null ) {
            domStorage[ elementIDs[a] ] = tmpElementHolder;
        }
    }
}

function modifyElementClass( elements, classNameToRemove = '', classNameToAdd = '', elementFilter = [] ) {
    // Check if given attributes are valid
    if( typeof elements !== 'object'
            || Array.isArray( elements )
            || !Array.isArray( elementFilter ) ) {
        return;
    }
    if( Object.keys(domStorage) <= 0 ) { return; }
    
    Object.keys(elements).forEach( value => {
        if( !elementFilter.includes( value ) ) {
            if( classNameToRemove != '' || classNameToRemove == null ) {
                elements[value].classList.remove( classNameToRemove );
            }

            if( classNameToAdd != '' || classNameToAdd == null ) {
                elements[value].classList.add( classNameToAdd );
            }
        }
    } );
}

function playerPicks( selectedItem ) {
    if( !init() ) { return; }

    if( selection.includes( selectedItem ) ) {
        playerPick = findItemIndex( selectedItem, selection );

        if( !isNaN( playerPick) && playerPick > -1 ) {
            processPicks();

            let key = 'game-' + selectedItem;
            let hideKey = 'game-option-container';
            let showKey = 'game-result-container';
            let chageModeButton = Object.keys(domStorage)[1];

            if( !Object.keys(domStorage).includes( key ) ) { return; }
            if( domStorage [key ] == null ) { return; }

            let toHideElement = { hideKey: domStorage[ hideKey ] };
            let toShowElement = { showKey: domStorage[ showKey ] };
            let toDisableBtn = { chageModeButton: domStorage[ chageModeButton ]  };
            
            modifyElementClass( toHideElement, 'fadeIn', 'fadeOutVanish', [] );
            modifyElementClass( toShowElement, 'fadeOutVanish', 'fadeIn', [] );
            modifyElementClass( toDisableBtn, 'null', 'disabled', [] );

            setTimeout( () => {
                document.getElementById( hideKey ).setAttribute( 'style', 'display: none;' );
            }, 500 );

            setTimeout( () => {
                document.getElementById( showKey ).setAttribute( 'style', 'display: flex;' );
            }, 500 );
        }
    }
}

function findItemIndex( item, arr ) {
    if( !Array.isArray( arr ) ) { return -1; }
    
    for( let a = 0; a < arr.length; a++ ) {
        if( item == arr[a] ) {
            return a;
        }
    }

    return -1;
}

function getScore() {
    if( !init() ) { return; }

    let scoreElement = document.getElementById( 'score-points' );
    scoreElement.innerHTML = localStorage.getItem( 'rockPaperScissorsLizardSpock_score' );
}

function processPicks() {
    computerPick = gameMode ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 2);
    let playerCanBeatIndex1 = !gameMode ?
                                ( playerPick + 1 > 2 ? 0 : playerPick + 1 ) :
                                ( playerPick + 1 > 4 ? 0 : playerPick + 1 );
    let playerCanBeatIndex2 = !gameMode ? -1 : ( playerPick - 2 < 0 ? playerPick + 3 : playerPick - 2);
    let pointToAdd = 0;
    let verdictText = "";

    if( computerPick == playerCanBeatIndex1
            || ( playerCanBeatIndex2 > -1 && computerPick == playerCanBeatIndex2 ) ) {
        verdictText = "YOU WIN";
        pointToAdd = 1;
    } else if( playerPick == computerPick ) {
        verdictText = "DRAW";
    } else {
        verdictText = "YOU LOSE";
        pointToAdd = -1;
    }
    
    document.getElementById( 'result-header' ).innerHTML = verdictText;
    document.getElementById( 'player-select' ).classList.add( 'picked-' + selection[ playerPick ] );
    document.getElementById( 'house-select' ).classList.add( 'picked-' + selection[ computerPick ] );

    if( pointToAdd != 0 ) {
        localStorage.setItem( localStorageScoreItem,
            parseInt(localStorage.getItem( localStorageScoreItem )) + pointToAdd );

        let winnerID = ""
        if( pointToAdd > 0 ) {
            winnerID = "player-select";
        } else {
            winnerID = "house-select";
        }
        document.getElementById( winnerID ).classList.add( 'winner-pick' );
        setTimeout( () => {
            document.getElementById( 'score-points' ).innerHTML = localStorage.getItem( localStorageScoreItem );
        }, 3500 );
    }
}

function gameRestart() {
    let chageModeButton = Object.keys(domStorage)[1];
    let hideKey = 'game-result-container';
    let showKey = 'game-option-container';
    let toHideElement = { hideKey: domStorage[ hideKey ] };
    let toShowElement = { showKey: domStorage[ showKey ] };
    let toEnableBtn = { chageModeButton: domStorage[ chageModeButton ]  };
    
    modifyElementClass( toHideElement, 'fadeIn', 'fadeOutVanish', [] );
    modifyElementClass( toShowElement, 'fadeOutVanish', 'fadeIn', [] );

    setTimeout( () => {
        document.getElementById( hideKey ).setAttribute( 'style', 'display: none;' );
        document.getElementById( 'player-select' ).classList.remove( 'picked-' + selection[ playerPick ] );
        document.getElementById( 'player-select' ).classList.remove( 'winner-pick' );
        document.getElementById( 'house-select' ).classList.remove( 'picked-' + selection[ computerPick ] );
        document.getElementById( 'house-select' ).classList.remove( 'winner-pick' );
        modifyElementClass( toEnableBtn, 'disabled', '', [] );
        playerPick = -1;
        computerPick = -1;
    }, 500 );

    setTimeout( () => {
        document.getElementById( showKey ).setAttribute( 'style', 'display: flex;' );
    }, 500 );
}
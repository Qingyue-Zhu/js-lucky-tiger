// Import the prompt-sync library to get user input from the console
const prompt = require("prompt-sync")();

// Constants that define the slot machine configuration
const ROWS = 3; // Number of rows in the slot machine
const COLS = 3; // Number of columns in the slot machine

// Define the frequency of each symbol in the slot machine
// This controls how often each symbol appears (rarity)
const SYMBOLS_COUNT = {
    A: 2, // Symbol A appears 2 times (rare)
    B: 4, // Symbol B appears 4 times
    C: 6, // Symbol C appears 6 times
    D: 8  // Symbol D appears 8 times (common)
};

// Define the payout value for each symbol
// Rarer symbols have higher payouts
const SYMBOLS_VALUE = {
    A: 5, // Symbol A pays 5x the bet
    B: 4, // Symbol B pays 4x the bet
    C: 3, // Symbol C pays 3x the bet
    D: 2  // Symbol D pays 2x the bet
};

// Function to handle user deposits
// Uses arrow function syntax: () => {}
const deposit = () => {
    // Keep asking until valid input is provided (infinite loop with conditional break)
    while (true) {
        // Prompt user for deposit amount and store the input
        const depositAmount = prompt("Enter a deposit amount: ");
        // Convert string input to a floating point number
        const numberDepositAmount = parseFloat(depositAmount);
        
        // Validate the input: check if it's not a number or less than or equal to 0
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.")
        } else {
            // Return the valid deposit amount, ending the function
            return numberDepositAmount;
        }
    }
};

// Function to get the number of lines the user wants to bet on
const getNumberOfLines = () => {
    while (true) {
        // Get user input for number of lines
        const lines = prompt("Enter the number of lines you to bet on (1-3): ");
        // Convert string input to a number
        const NumberOfLines = parseFloat(lines);
        
        // Validate input: not a number, less than or equal to 0, or greater than 3
        if (isNaN(NumberOfLines) || NumberOfLines <= 0 || NumberOfLines > 3) {
            console.log("Invalid number of lines, try again.")
        } else {
            return NumberOfLines;
        }
    }
};

// Function to get the bet amount per line
// Takes balance and lines as parameters to validate the bet
const getBet = (balance, lines) => {
    while (true) {
        // Get user input for bet per line
        const bet = prompt("Enter the bet per line: ");
        // Convert string input to a number
        const numberBet = parseFloat(bet);
        
        // Validate input: not a number, less than or equal to 0, or exceeds available balance per line
        if (isNaN(numberBet) || numberBet <= 0 || numberBet > (balance / lines)) {
            console.log("Invalid Bet, try again.")
        } else {
            return numberBet;
        }
    }
};

// Function to generate the random spin result
const spin = () => {
    // Create an array of all symbols based on their defined counts
    const symbols = [];
    // Object.entries() returns an array of [key, value] pairs
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        // Add each symbol to the array 'count' number of times
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    
    // Create the reels (columns of the slot machine)
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        // Add a new column (reel)
        reels.push([]);
        // Create a copy of the symbols array using spread operator
        // This ensures each reel has an independent set of symbols
        const reelSymbols = [...symbols];
        
        for (let j = 0; j < ROWS; j++) {
            // Generate a random index
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            // Select a random symbol
            const selectedSymbol = reelSymbols[randomIndex];
            // Add the selected symbol to the current reel
            reels[i].push(selectedSymbol);
            // Remove the selected symbol from the pool to prevent duplication in the same reel
            reelSymbols.splice(randomIndex, 1);
        }
    }
    
    return reels;
};

// Function to transpose the reels array to make it easier to check rows
// This converts columns (reels) into rows for display and winning check
const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        // Create a new row
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            // Add the symbol from each reel to form complete rows
            rows[i].push(reels[j][i])
        }
    }
    return rows;
};

// Function to print the rows in a human-readable format
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        // entries() returns array of [index, value] pairs allowing access to both
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            // Add separators between symbols but not after the last one
            if (i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString)
    }
};

// Function to calculate winnings based on matched symbols
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    // Check only the number of lines the user bet on
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        
        // Check if all symbols in the row are the same
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        
        // If all symbols are the same, add winnings
        if (allSame) {
            // Multiply bet by the symbol's value
            winnings += bet * SYMBOLS_VALUE[symbols[0]];
        }
    }
    
    return winnings;
};

// Main game function that orchestrates the gameplay
const game = () => {
    // Get initial deposit
    let balance = deposit();
    
    // Game loop
    while (true) {
        console.log("You have a balance of $" + balance.toString());
        
        // Get player's bet configuration
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        
        // Deduct bet amount from balance
        balance -= bet * numberOfLines;
        
        // Generate the spin result
        const reels = spin();
        // Transpose for easier display and win checking
        const rows = transpose(reels);
        // Display the result
        printRows(rows);
        
        // Calculate and add winnings
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());
        
        // Check if player is out of money
        if (balance <= 0) {
            console.log("You ran out of money!");
            break;
        }
        
        // Ask if player wants to continue
        const playAgain = prompt("Do you want to play again (y/n)? ");
        if (playAgain != "y") {
            break;
        }
    }
};

// Start the game
game();
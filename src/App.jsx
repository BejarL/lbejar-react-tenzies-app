import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

// Define the App component.
export default function App() {
  // State for storing the array of die objects.
  const [dice, setDice] = React.useState(allNewDice());
  // State to track whether the Tenzies game has been won.
  const [tenzies, setTenzies] = React.useState(false);
  const [rollCount, setRollCount] = React.useState(0);
  const [startTime, setStartTime] = React.useState(Date.now());
  const [duration, setDuration] = React.useState(null);

  const [bestTime, setBestTime] = React.useState(() => {
    // Get the best time from local storage or return null if not found
    const savedBestTime = localStorage.getItem("bestTime");
    return savedBestTime ? JSON.parse(savedBestTime) : null;
  });

  // Effect hook to check for win condition whenever the dice state changes.
  React.useEffect(() => {
    // Check if all dice are held.
    const allHeld = dice.every((die) => die.isHeld);
    // Get the value of the first die to compare with others.
    const firstValue = dice[0].value;
    // Check if all dice have the same value as the first die.
    const allSameValue = dice.every((die) => die.value === firstValue);
    // If all dice are held and have the same value, set tenzies to true (win condition).
    if (allHeld && allSameValue) {
      setTenzies(true);
      const endTime = Date.now();
      const gameDuration = endTime - startTime; // Calculate duration in milliseconds
      setDuration(gameDuration);
      updateBestTime(gameDuration); // Call to update the best time
    }
  }, [dice]);

  // Function to generate a new die object with random value, not held, and a unique id.
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  // Function to generate an array of 10 new dice using generateNewDie.
  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  // Function to roll all dice that are not held or reset the game if tenzies is true.
  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setRollCount((prevCount) => prevCount + 1); // Step 2: Increment roll count
    } else {
      // Reset the game by setting tenzies to false and generating all new dice.
      setTenzies(false);
      setDice(allNewDice());
      setRollCount(0); // Step 3: Reset roll count for new game
      setStartTime(Date.now()); // Reset start time for the new game
      setDuration(null); // Reset duration for the new game
    }
  }

  // Function to toggle the isHeld state of a die by its id.
  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  // Map each die in the dice state to a Die component.
  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute(s) and ${remainingSeconds} second(s)`;
  }

  function updateBestTime(gameDuration) {
    // Check if there's a best time stored or if the current game's duration is better than the stored best time
    if (bestTime === null || gameDuration < bestTime) {
      setBestTime(gameDuration); // Update the state
      localStorage.setItem("bestTime", JSON.stringify(gameDuration)); // Update local storage
    }
  }
  // Render the application UI.
  return (
    <main>
      {tenzies && <Confetti />}{" "}
      {/* Display confetti animation if tenzies is true. */}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}{" "}
      </button>
      {/* Display roll count and time*/}
      <div className="roll-count">Rolls: {rollCount}</div>{" "}
      {tenzies && (
        <div className="game-duration">Time: {formatDuration(duration)}</div>
      )}
      {bestTime && (
        <div className="best-time">Best Time: {formatDuration(bestTime)}</div>
      )}{" "}
      {/* Display best time */}
    </main>
  );
}

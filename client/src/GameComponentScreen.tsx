import { useEffect, useState } from "react";
import "./App.css";
import { useDojo } from "./dojo/useDojo";
import { Game2Message } from "./Constants";

type GameComponentScreenProps = {
  gameState: number;
  startGame: () => void;
  createGame: () => void;
  joinGame: () => void;
};

function GameState1Components(props: GameComponentScreenProps) {
  return (
    <>
      <div className="controller-container">
        <button onClick={() => props.startGame()}>Start Game</button>
      </div>
    </>
  );
}

function GameState2Components(props: GameComponentScreenProps) {
  return (
    <>
      <div className="controller-column">
        <div className="form-field">
          <label className="label" htmlFor="name">
            Enter your name:{" "}
          </label>
          <input
            placeholder="Please enter your name"
            id="name"
            className="input"
          />
        </div>
        <div className="controller-container">
          <button onClick={() => props.createGame()}>Create Game</button>
          <button onClick={() => props.joinGame()}>Join Game</button>
        </div>
      </div>
    </>
  );
}

function GameComponentScreen(props: GameComponentScreenProps) {
  const [backgroundImage, setBackgroundImage] = useState("./assets/1.png");
  const [gameText, setGameText] = useState("Welcome to Crypto Condundrum");
  const [gameControls, setGameControls] = useState(<></>);
  const [gameState, setGameState] = useState(0);

  function getGameTextBasedOnGameState(gameState: number) {
    switch (gameState) {
      case 1:
        return "Welcome to Crypto Conundrum";
        break;
      case 2:
        return Game2Message;
      default:
        return "Welcome to Crypto Conundrum";
        break;
    }
    return "Welcome to Crypto Conundrum";
  }

  function getGameControls(gameState: number) {
    switch (gameState) {
      case 1:
        return GameState1Components(props);
      case 2:
        return GameState2Components(props);
      default:
        return GameState1Components(props);
        break;
    }
  }

  useEffect(() => {
    setBackgroundImage(`../src/assets/${props.gameState}.png`);
    setGameText(getGameTextBasedOnGameState(props.gameState));
    setGameControls(getGameControls(props.gameState));
  }, [props.gameState]);

  return (
    <>
      <div className="gameComponentScreenClass">
        <div className="imageHolder" style={{ height: "100%", width: "100%" }}>
          <img
            style={{ height: "100%", width: "100%" }}
            src={backgroundImage}
          />
        </div>
        <div className="gameTextPrompt">{gameText}</div>
        <div className="gameControls">{gameControls}</div>
      </div>
    </>
  );
}

export default GameComponentScreen;

// Game flow plan
/*
1. Welcome screen
2. Inputs: Name | Buttons: Create game and Join Game

*/

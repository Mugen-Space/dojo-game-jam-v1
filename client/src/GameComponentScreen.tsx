import { useEffect, useState } from "react";
import "./App.css";
import { useDojo } from "./dojo/useDojo";
import { Account, AccountInterface } from "starknet";

import {
  StartOrCreateMessage,
  WelcomeMessage,
  InterrogationMessage,
  CooperateMessage,
  SingleBetrayalMessage,
  BetrayalMessage,
  CreditsMessage,
} from "./Constants";
import { GameState } from "./GameStateEnum";
// import gameimage from
type GameComponentScreenProps = {
  gameState: GameState;
  startGame: () => void;
  createGame: () => void;
  joinGame: (game_id: number) => void;
  vote: (arg0: number) => void;
  goToCredits: () => void;
  resetGame: () => void;
};

function WelcomeComponents(props: GameComponentScreenProps) {
  return (
    <>
      <div className="controller-container">
        <button onClick={() => props.startGame()}>Start Game</button>
      </div>
    </>
  );
}

function StartOrCreateComponents(props: GameComponentScreenProps) {
  //   const [gameID, setGameID] = useState(0);
  return (
    <>
      <div className="controller-column">
        {/* <div className="form-field">
          <label className="label" htmlFor="name">
            Enter your id:{" "}
          </label>
          <input
            placeholder="Please enter your name"
            id="name"
            className="input"
            inputMode="decimal"
            value={gameID}
            onChange={(e) => setGameID(parseInt(e.target.value))}
          />
        </div> */}
        <div className="controller-container">
          <button onClick={() => props.createGame()}>Create Game</button>
          <button onClick={() => props.joinGame(0)}>Join Game</button>
        </div>
      </div>
    </>
  );
}

function InterrogationComponent(props: GameComponentScreenProps) {
  return (
    <>
      <div className="controller-container">
        <button onClick={() => props.vote(1)}>Vote Split</button>
        <button onClick={() => props.vote(2)}>Vote Steal</button>
      </div>
    </>
  );
}

function GoToCredits(props: GameComponentScreenProps) {
  return (
    <>
      <div className="controller-container">
        <button onClick={() => props.goToCredits()}>End game</button>
      </div>
    </>
  );
}

function CreditsComponent(props: GameComponentScreenProps) {
  return (
    <>
      <div className="controller-container">
        <button onClick={() => props.resetGame()}>Start another theft</button>
      </div>
    </>
  );
}

function GameComponentScreen(props: GameComponentScreenProps) {
  const [backgroundImage, setBackgroundImage] = useState(
    "../src/assets/Welcome.png"
  );
  const [gameText, setGameText] = useState(WelcomeMessage);
  const [gameControls, setGameControls] = useState(<></>);
  const [gameState, setGameState] = useState(0);

  function setGameComponents(gameState: GameState) {
    switch (gameState) {
      case GameState.Welcome:
        setGameControls(WelcomeComponents(props));
        setGameText(WelcomeMessage);
        break;
      case GameState.StartOrCreate:
        setGameControls(StartOrCreateComponents(props));
        setGameText(StartOrCreateMessage);
        break;
      case GameState.Interrogation:
        setGameText(InterrogationMessage);
        setGameControls(InterrogationComponent(props));
        break;
      case GameState.Cooperate:
        setGameText(CooperateMessage);
        setGameControls(GoToCredits(props));
        break;
      case GameState.Betrayal:
        setGameText(BetrayalMessage);
        setGameControls(GoToCredits(props));
        break;
      case GameState.SingleBetrayal:
        setGameText(SingleBetrayalMessage);
        setGameControls(GoToCredits(props));
        break;
      case GameState.Credits:
        setGameText(CreditsMessage);
        setGameControls(CreditsComponent(props));
        break;
    }
  }

  useEffect(() => {
    setBackgroundImage(`../src/assets/${GameState[props.gameState]}.png`);
    setGameComponents(props.gameState);
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

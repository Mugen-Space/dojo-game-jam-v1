import { useEffect, useState } from "react";
import "./App.css";
import { useDojo } from "./dojo/useDojo";
import { Account, AccountInterface } from "starknet";
import { useGameStore } from "./Store";

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
import { stat } from "fs";
// import gameimage from
type GameComponentScreenProps = {
  gameId: number;
  startGame: () => void;
  createGame: () => void;
  joinGame: (gameId: number) => void;
  vote: (arg0: number) => void;
  goToCredits: () => void;
  resetGame: () => void;
};

function WelcomeComponents(props: {startGame: GameComponentScreenProps['startGame']}) {
  return (
    <>
      <div className="controller-container">
        <button onClick={() => props.startGame()}>Start Game</button>
      </div>
    </>
  );
}

function StartOrCreateComponents(props: {gameId: GameComponentScreenProps['gameId'], createGame: GameComponentScreenProps['createGame'], joinGame: GameComponentScreenProps['joinGame']}) {
    const [gameID, setGameID] = useState(`${props.gameId}`);
    const gameId = useGameStore((state) => state.gameId)
  return (
    <>
      <div className="controller-column">
        <div className="form-field">
          <label className="label" htmlFor="name">
            Enter Game Id:{" "}
          </label>
          <input
            placeholder="Please enter Game Id"
            id="name"
            className="input"
            value={gameID}
            onEmptied={() => setGameID("0")}
            onChange={(e) => {
                setGameID(e.target.value)
              }
            }
          />
        </div>
        <div className="controller-container">
          <button onClick={() => props.createGame()}>Create Game</button>
          <button onClick={() => props.joinGame(parseInt(gameID))}>Join Game: {gameID}</button>
        </div>
      </div>
    </>
  );
}

function InterrogationComponent(props: {vote: GameComponentScreenProps['vote']}) {
  return (
    <>
      <div className="controller-container">
        <button onClick={() => props.vote(1)}>Vote Split</button>
        <button onClick={() => props.vote(2)}>Vote Steal</button>
      </div>
    </>
  );
}

function GoToCredits(props: {goToCredits: GameComponentScreenProps['goToCredits']}) {
  return (
    <>
      <div className="controller-container">
        <button onClick={() => props.goToCredits()}>End game</button>
      </div>
    </>
  );
}

function CreditsComponent(props: {resetGame: GameComponentScreenProps['resetGame']}) {
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
  const gameState = useGameStore(state => state.gameState)
  
  function setGameComponents(gameState: GameState) {
    switch (gameState) {
      case GameState.Welcome:
        setGameControls(<WelcomeComponents startGame={props.startGame} />);
        setGameText(WelcomeMessage);
        break;
      case GameState.StartOrCreate:
        setGameControls(<StartOrCreateComponents gameId={props.gameId} createGame={props.createGame} joinGame={props.joinGame} />);
        setGameText(StartOrCreateMessage);
        break;
      case GameState.Interrogation:
        setGameText(InterrogationMessage);
        setGameControls(<InterrogationComponent vote={props.vote}/>);
        break;
      case GameState.Cooperate:
        setGameText(CooperateMessage);
        setGameControls(<GoToCredits goToCredits={props.goToCredits} />);
        break;
      case GameState.Betrayal:
        setGameText(BetrayalMessage);
        setGameControls(<GoToCredits goToCredits={props.goToCredits} />);
        break;
      case GameState.SingleBetrayal:
        setGameText(SingleBetrayalMessage);
        setGameControls(<GoToCredits goToCredits={props.goToCredits} />);
        break;
      case GameState.Credits:
        setGameText(CreditsMessage);
        setGameControls(<CreditsComponent resetGame={props.resetGame} />);
        break;
    }
  }

  useEffect(() => {
    setBackgroundImage(`../src/assets/${GameState[gameState]}.png`);
    setGameComponents(gameState);
  }, [gameState]);

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

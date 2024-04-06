import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useDojo } from "./dojo/useDojo";
import { Account, AccountInterface } from "starknet";
import { useGameStore } from "./Store";
import { useEntityQuery } from "@dojoengine/react";
import { HasValue, getComponentValue } from "@dojoengine/recs";
import {
  StartOrCreateMessage,
  WelcomeMessage,
  InterrogationMessage,
  CooperateMessage,
  StealerMessage,
  SplitterMessage,
  BetrayalMessage,
  CreditsMessage,
} from "./Constants";
import { GameState } from "./GameStateEnum";
import { stat } from "fs";
import { shortString } from "starknet";
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

function WelcomeComponents(props: {
  startGame: GameComponentScreenProps["startGame"];
}) {
  return (
    <>
      <div className="controller-container">
        <button onClick={() => props.startGame()}>Start Game</button>
      </div>
    </>
  );
}

function StartOrCreateComponents(props: {
  gameId: GameComponentScreenProps["gameId"];
  createGame: GameComponentScreenProps["createGame"];
  joinGame: GameComponentScreenProps["joinGame"];
}) {
  const [gameID, setGameID] = useState(`${props.gameId}`);
  const gameId = useGameStore((state) => state.gameId);
  const setGameId = useGameStore((state) => state.updateGameId);
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
            value={gameId}
            onEmptied={() => setGameId(0)}
            onChange={(e) => {
              setGameId(parseInt(e.target.value == "" ? "0" : e.target.value));
              setGameID(e.target.value);
            }}
          />
        </div>
        <div className="controller-container">
          <button onClick={() => props.createGame()}>Create Game</button>
          <button onClick={() => props.joinGame(gameId)}>
            Join Game: {gameId}
          </button>
        </div>
      </div>
    </>
  );
}

function InterrogationComponent(props: {
  game_id: GameComponentScreenProps["gameId"];
  vote: GameComponentScreenProps["vote"];
}) {
  const {
    setup: {
      systemCalls: { spawn, move, create_game, join_game, send_choice },
      clientComponents: { Position, Moves, Game },
    },
    account,
  } = useDojo();
  const setGameState = useGameStore((state) => state.updateGameState);
  const gameEntities: any = useEntityQuery([
    HasValue(Game, {
      game_id: props.game_id,
    }),
  ]);
  const games = useMemo(
    () =>
      gameEntities
        .map((id: any) => getComponentValue(Game, id))
        .sort((a: any, b: any) => a.id - b.id)
        .filter((game: any) => game.game_id !== 0n),
    [gameEntities, Game]
  );
  console.log(games);
  if (games[0]["choice1"] !== 0 && games[0]["choice2"] !== 0) {
    console.log("results are here for the round");
    let currentPlayer1Address = `0x${games[0]["player1"].toString(16)}`;
    let currentPlayer2Address = `0x${games[0]["player2"].toString(16)}`;
    let currentAccountAddress = account.account.address;
    let playerNum;
    if (currentAccountAddress == currentPlayer1Address) playerNum = 1;
    else if (currentAccountAddress == currentPlayer2Address) playerNum = 2;
    if (games[0]["choice1"] === 1 && games[0]["choice2"] === 1) {
      setGameState(GameState.Cooperate);
    } else if (games[0]["choice1"] === 1 && games[0]["choice2"] === 2) {
      if (playerNum == 1) {
        setGameState(GameState.SplitterScreen);
      } else {
        setGameState(GameState.StealerScreen);
      }
    } else if (games[0]["choice1"] === 2 && games[0]["choice2"] === 1) {
      if (playerNum == 1) {
        setGameState(GameState.StealerScreen);
      } else {
        setGameState(GameState.SplitterScreen);
      }
    } else {
      setGameState(GameState.Betrayal);
    }
  }
  return (
    <>
      <div className="controller-container">
        <button onClick={() => props.vote(1)}>Vote Split</button>
        <button onClick={() => props.vote(2)}>Vote Steal</button>
      </div>
    </>
  );
}

function GoToCredits(props: {
  goToCredits: GameComponentScreenProps["goToCredits"];
}) {
  return (
    <>
      <div className="controller-container">
        <button onClick={() => props.goToCredits()}>End game</button>
      </div>
    </>
  );
}

function CreditsComponent(props: {
  resetGame: GameComponentScreenProps["resetGame"];
}) {
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
  const gameState = useGameStore((state) => state.gameState);

  function setGameComponents(gameState: GameState) {
    switch (gameState) {
      case GameState.Welcome:
        setGameControls(<WelcomeComponents startGame={props.startGame} />);
        setGameText(WelcomeMessage);
        break;
      case GameState.StartOrCreate:
        setGameControls(
          <StartOrCreateComponents
            gameId={props.gameId}
            createGame={props.createGame}
            joinGame={props.joinGame}
          />
        );
        setGameText(StartOrCreateMessage);
        break;
      case GameState.Interrogation:
        setGameText(InterrogationMessage);
        setGameControls(
          <InterrogationComponent vote={props.vote} game_id={props.gameId} />
        );
        break;
      case GameState.Cooperate:
        setGameText(CooperateMessage);
        setGameControls(<GoToCredits goToCredits={props.goToCredits} />);
        break;
      case GameState.Betrayal:
        setGameText(BetrayalMessage);
        setGameControls(<GoToCredits goToCredits={props.goToCredits} />);
        break;
      case GameState.StealerScreen:
        setGameText(StealerMessage);
        setGameControls(<GoToCredits goToCredits={props.goToCredits} />);
        break;
      case GameState.SplitterScreen:
        setGameText(SplitterMessage);
        setGameControls(<GoToCredits goToCredits={props.goToCredits} />);
        break;
      case GameState.Credits:
        setGameText(CreditsMessage);
        setGameControls(<CreditsComponent resetGame={props.resetGame} />);
        break;
    }
  }

  useEffect(() => {
    setBackgroundImage(
      `https://raw.githubusercontent.com/Mugen-Space/dojo-game-jam-v1/main/client/src/assets/${GameState[gameState]}.png`
    );
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

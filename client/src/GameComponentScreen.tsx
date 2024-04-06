import { useEffect, useState } from "react";
import "./App.css";
import { useDojo } from "./dojo/useDojo";
import { StartOrCreateMessage, WelcomeMessage, InterrogationMessage, CooperateMessage, SingleBetrayalMessage, BetrayalMessage, CreditsMessage } from "./Constants";
import { GameState } from "./GameStateEnum"

type GameComponentScreenProps = {
    gameState: GameState;
    startGame: () => void;
    createGame: () => void;
    joinGame: () => void;
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

function InterrogationComponent(props: GameComponentScreenProps) {
    return (
        <>
            <div className="controller-container">
                <button onClick={() => props.vote("Split")}>Vote Split</button>
                <button onClick={() => props.vote("Steal")}>Vote Steal</button>
            </div>
        </>
    )
}

function GoToCredits(props: GameComponentScreenProps) {
    return (
        <>
            <div className="controller-container">
                <button onClick={() => props.goToCredits()}>End game</button>
            </div>
        </>
    )
}

function CreditsComponent(props: GameComponentScreenProps) {
    return (
        <>
            <div className="controller-container">
                <button onClick={() => props.resetGame()}>Start another theft</button>
            </div>
        </>
    )
}

function GameComponentScreen(props: GameComponentScreenProps) {
    const [backgroundImage, setBackgroundImage] = useState("./assets/1.png");
    const [gameText, setGameText] = useState(WelcomeMessage);
    const [gameControls, setGameControls] = useState(<></>);
    const [gameState, setGameState] = useState(0);

    function setGameComponents(gameState: GameState) {
        switch (gameStage) {
            case GameState.Welcome:
                setGameComponents(WelcomeComponents())
                setGameText(WelcomeMessage)
                break;
            case GameState.StartOrCreate:
                setGameComponents(StartOrCreateComponents())
                setGameText(StartOrCreateMessage)
                break;
            case GameState.Interrogation:
                setGameText(InterrogationMessage);
                setGameComponents(InterrogationComponent);
                break;
            case GameState.Cooperate:
                setGameText(CooperateMessage);
                setGameComponents(GoToCredits);
                break;
            case GameState.Betrayal:
                setGameText(BetrayalMessage);
                setGameComponents(GoToCredits);
                break;
            case GameState.SingleBetrayal:
                setGameText(SingleBetrayalMessage)
                setGameComponents(GoToCredits);
                break;
            case GameState.CreditsMessage:
                setGameText(CreditsMessage)
                setGameComponents(CreditsComponent);
                break;
        }
    }

    useEffect(() => {
        setBackgroundImage(`../src/assets/${GameState[props.gameState]}.png`);
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

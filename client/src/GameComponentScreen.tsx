import { useEffect, useState } from "react";
import "./App.css";
import { useDojo } from "./dojo/useDojo";

type GameComponentScreenProps = {
    gameState: number
}

function GameComponentScreen(props: GameComponentScreenProps) {
    
    const [backgroundImage, setBackgroundImage] = useState("./assets/1.png")
    const [gameText, setGameText] = useState("Welcome to Crypto Condundrum")
    const [gameState, setGameState] = useState(0);

    function getGameTextBasedOnGameState(gameState: number) {
        switch (gameState) {
            case 1:
                return "Welcome to Crypto Conundrum"
                break;
            default:
                return "Welcome to Crypto Conundrum"
                break;
        }
        return "Welcome to Crypto Conundrum"
    }

    useEffect(() => {
        setBackgroundImage(`./assets/${props.gameState}.png`)
        setGameText(getGameTextBasedOnGameState(props.gameState))
    }, [props.gameState])

    return (
        <>
            <div className="gameComponentScreenClass">
                <div className="imageHolder" style={{"height": "100%", "width": "100%"}}>
                    <img style={{"height": "100%", "width": "100%"}} src={backgroundImage} />
                </div>
                <div className="gameTextPrompt">
                    {gameText}
                </div>
                <div className="gameControls">
                    No actions to perform right now
                </div>
            </div>
        </>
    );
}

export default GameComponentScreen;

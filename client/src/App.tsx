import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Direction } from "./utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import GameComponentScreen from "./GameComponentScreen";
import { GameState } from "./GameStateEnum";
import { useEntityQuery } from "@dojoengine/react";
import { HasValue, getComponentValue } from "@dojoengine/recs";
import { useGameStore } from "./Store";

function App() {
  const {
    setup: {
      systemCalls: { spawn, move, create_game, join_game, send_choice },
      clientComponents: { Position, Moves, GameCreated },
    },
    account,
  } = useDojo();

  const gameState = useGameStore((state) => state.gameState)
  const setGameState = useGameStore((state) => state.updateGameState)
  // const [gameState, setGameState] = useState<GameState>(GameState.Welcome);
  const gameId = useGameStore((state) => state.gameId)
  const updateGameId = useGameStore((state) => state.updateGameId)
  //const [gameId, setGameId] = useState(0);
  

  const [clipboardStatus, setClipboardStatus] = useState({
    message: "",
    isError: false,
  });

  // entity id we are syncing
  const entityId = getEntityIdFromKeys([
    BigInt(account?.account.address),
  ]) as Entity;

  const gameEntities: any = useEntityQuery([
    HasValue(GameCreated, {
      owner: BigInt(account.account.address),
    }),
  ]);
  const games = useMemo(
    () =>
      gameEntities
        .map((id: any) => getComponentValue(GameCreated, id))
        .sort((a: any, b: any) => a.id - b.id)
        .filter((game: any) => game.host !== 0n),
    [gameEntities, GameCreated]
  );
  console.log(games);

  // get current component values
  const position = useComponentValue(Position, entityId);
  const moves = useComponentValue(Moves, entityId);

  const handleRestoreBurners = async () => {
    try {
      await account?.applyFromClipboard();
      setClipboardStatus({
        message: "Burners restored successfully!",
        isError: false,
      });
    } catch (error) {
      setClipboardStatus({
        message: `Failed to restore burners from clipboard`,
        isError: true,
      });
    }
  };

  useEffect(() => {
    if (clipboardStatus.message) {
      const timer = setTimeout(() => {
        setClipboardStatus({ message: "", isError: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [clipboardStatus.message]);

  return (
    <>
      <button onClick={account?.create}>
        {account?.isDeploying ? "deploying burner" : "create burner"}
      </button>
      {account && account?.list().length > 0 && (
        <button onClick={async () => await account?.copyToClipboard()}>
          Save Burners to Clipboard
        </button>
      )}
      <button onClick={handleRestoreBurners}>
        Restore Burners from Clipboard
      </button>
      {clipboardStatus.message && (
        <div className={clipboardStatus.isError ? "error" : "success"}>
          {clipboardStatus.message}
        </div>
      )}

      <div className="card">
        <div>{`burners deployed: ${account.count}`}</div>
        <div>
          select signer:{" "}
          <select
            value={account ? account.account.address : ""}
            onChange={(e) => account.select(e.target.value)}
          >
            {account?.list().map((account, index) => {
              return (
                <option value={account.address} key={index}>
                  {account.address}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <button onClick={() => account.clear()}>Clear burners</button>
          <p>
            You will need to Authorise the contracts before you can use a
            burner. See readme.
          </p>
        </div>
      </div>
      <GameComponentScreen
        gameId={gameId}
        startGame={() => setGameState(GameState.StartOrCreate)}
        createGame={() => create_game(account?.account)}
        joinGame={(game_id) => {
          console.log("Game Id", game_id)
          try {
            updateGameId(game_id)
            join_game(account?.account, game_id);
            setGameState(GameState.Interrogation);
          } catch (err) {
            alert(err)
          }
        }}
        vote={(choice) => {
          try {
            send_choice(account?.account, choice, gameId);
          } catch (err) {
            alert(err)
          }
        }}
        goToCredits={() => console.log("Hello")}
        resetGame={() => console.log("Hello")}
      />
      {/* <div className="card">
                <button onClick={() => spawn(account.account)}>Spawn</button>
                <div>
                    Moves Left: {moves ? `${moves.remaining}` : "Need to Spawn"}
                </div>
                <div>
                    Position:{" "}
                    {position
                        ? `${position.vec.x}, ${position.vec.y}`
                        : "Need to Spawn"}
                </div>
            </div>

            <div className="card">
                <div>
                    <button
                        onClick={() =>
                            position && position.vec.y > 0
                                ? move(account.account, Direction.Up)
                                : console.log("Reach the borders of the world.")
                        }
                    >
                        Move Up
                    </button>
                </div>
                <div>
                    <button
                        onClick={() =>
                            position && position.vec.x > 0
                                ? move(account.account, Direction.Left)
                                : console.log("Reach the borders of the world.")
                        }
                    >
                        Move Left
                    </button>
                    <button
                        onClick={() => move(account.account, Direction.Right)}
                    >
                        Move Right
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => move(account.account, Direction.Down)}
                    >
                        Move Down
                    </button>
                </div>
            </div> */}
    </>
  );
}

export default App;

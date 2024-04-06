import { create } from 'zustand'
import { GameState } from './GameStateEnum'

type State = {
    gameId: number
    username: string
    account: string
    gameState: GameState
}
  
type Action = {
    updateGameId: (gameId: State['gameId']) => void
    updateUsername: (username: State['username']) => void
    updateAccount: (account: State['account']) => void
    updateGameState: (gameState: State['gameState']) => void
}

// Create your store, which includes both state and (optionally) actions
export const useGameStore = create<State & Action>((set) => ({
    gameId: 100,
    username: 'Player 1',
    account: '0',
    gameState: GameState.Welcome,
    updateGameId: (gameId) => set(() => ({gameId: gameId})),
    updateUsername: (username) => set(() => ({username: username})),
    updateAccount: (account) => set(() => ({account: account})),
    updateGameState: (gameState) => set(() => ({gameState: gameState}))
}))

  
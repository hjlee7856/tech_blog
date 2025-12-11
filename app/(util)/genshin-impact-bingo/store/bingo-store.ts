import { create } from 'zustand';

import type { User } from '../lib/auth';
import type { GameState, Player } from '../lib/game';

interface BingoState {
  user: User | null;
  gameState: GameState | null;
  players: Player[];
  isLoading: boolean;
  hasInitialized: boolean;
  hasReportedOnline: boolean;
  setUser: (user: User | null) => void;
  setGameState: (gameState: GameState | null) => void;
  setPlayers: (players: Player[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setInitialized: () => void;
  setHasReportedOnline: () => void;
}

export const useBingoStore = create<BingoState>((set) => ({
  user: null,
  gameState: null,
  players: [],
  isLoading: true,
  hasInitialized: false,
  hasReportedOnline: false,
  setUser: (user) => set({ user }),
  setGameState: (gameState) => set({ gameState }),
  setPlayers: (players) => set({ players }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setInitialized: () => set({ hasInitialized: true }),
  setHasReportedOnline: () => set({ hasReportedOnline: true }),
}));

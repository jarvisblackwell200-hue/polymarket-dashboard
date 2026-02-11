import Database from "better-sqlite3";
import path from "path";

const DB_PATH =
  process.env.DATABASE_PATH ||
  path.join(process.env.HOME || "", "Projects/polymarket-strategies/strategies.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  }
  return db;
}

export interface AgentState {
  bankroll: number;
  total_pnl: number;
  total_api_cost: number;
  is_alive: number;
  updated_at: string;
}

export interface Trade {
  id: number;
  strategy: string;
  market_id: string;
  condition_id: string | null;
  market_question: string;
  side: "YES" | "NO";
  entry_price: number;
  size: number;
  cost_usd: number;
  fair_value_estimate: number;
  edge: number;
  kelly_fraction: number;
  status: "open" | "closed" | "resolved";
  exit_price: number | null;
  pnl: number | null;
  order_id: string | null;
  created_at: string;
  closed_at: string | null;
}

export interface PriceHistory {
  id: number;
  market_id: string;
  condition_id: string | null;
  market_question: string;
  yes_price: number;
  no_price: number;
  volume: number | null;
  liquidity: number | null;
  recorded_at: string;
}

export interface ApiCost {
  id: number;
  service: string;
  cost_usd: number;
  tokens_used: number;
  created_at: string;
}

export interface ScanLog {
  id: number;
  strategy: string;
  markets_scanned: number;
  opportunities_found: number;
  trades_placed: number;
  created_at: string;
}

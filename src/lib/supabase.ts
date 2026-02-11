import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types matching pm_ tables
export interface AgentState {
  id: number;
  bankroll: number;
  total_pnl: number;
  total_api_cost: number;
  is_alive: boolean;
  updated_at: string;
}

export interface Trade {
  id: number;
  strategy: string;
  market_id: string;
  condition_id: string | null;
  market_question: string;
  side: 'YES' | 'NO';
  entry_price: number;
  size: number;
  cost_usd: number;
  fair_value_estimate: number;
  edge: number;
  kelly_fraction: number;
  status: 'open' | 'closed' | 'resolved';
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

import { getDb, AgentState, Trade, PriceHistory, ApiCost } from "./db";

export function getAgentState(): AgentState | null {
  const db = getDb();
  return db.prepare("SELECT * FROM agent_state WHERE id = 1").get() as AgentState | null;
}

export function getTrades(options?: {
  status?: string;
  strategy?: string;
  limit?: number;
  offset?: number;
}): Trade[] {
  const db = getDb();
  const conditions: string[] = [];
  const params: Record<string, unknown> = {};

  if (options?.status) {
    conditions.push("status = @status");
    params.status = options.status;
  }
  if (options?.strategy) {
    conditions.push("strategy = @strategy");
    params.strategy = options.strategy;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = options?.limit || 100;
  const offset = options?.offset || 0;

  return db
    .prepare(`SELECT * FROM trades ${where} ORDER BY created_at DESC LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit, offset }) as Trade[];
}

export function getTradeCount(options?: { status?: string; strategy?: string }): number {
  const db = getDb();
  const conditions: string[] = [];
  const params: Record<string, unknown> = {};

  if (options?.status) {
    conditions.push("status = @status");
    params.status = options.status;
  }
  if (options?.strategy) {
    conditions.push("strategy = @strategy");
    params.strategy = options.strategy;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const row = db.prepare(`SELECT COUNT(*) as count FROM trades ${where}`).get(params) as { count: number };
  return row.count;
}

export function getOpenPositions(): Trade[] {
  return getTrades({ status: "open" });
}

export function getStrategies(): string[] {
  const db = getDb();
  const rows = db.prepare("SELECT DISTINCT strategy FROM trades ORDER BY strategy").all() as { strategy: string }[];
  return rows.map((r) => r.strategy);
}

export function getPriceHistory(marketId: string, limit?: number): PriceHistory[] {
  const db = getDb();
  return db
    .prepare(
      "SELECT * FROM price_history WHERE market_id = @marketId ORDER BY recorded_at DESC LIMIT @limit"
    )
    .all({ marketId, limit: limit || 500 }) as PriceHistory[];
}

export function getLatestPrices(marketIds: string[]): Record<string, PriceHistory> {
  const db = getDb();
  const result: Record<string, PriceHistory> = {};
  for (const marketId of marketIds) {
    const row = db
      .prepare(
        "SELECT * FROM price_history WHERE market_id = @marketId ORDER BY recorded_at DESC LIMIT 1"
      )
      .get({ marketId }) as PriceHistory | undefined;
    if (row) result[marketId] = row;
  }
  return result;
}

export function getApiCosts(): ApiCost[] {
  const db = getDb();
  return db.prepare("SELECT * FROM api_costs ORDER BY created_at DESC LIMIT 100").all() as ApiCost[];
}

export function getTotalExposure(): number {
  const db = getDb();
  const row = db
    .prepare("SELECT COALESCE(SUM(cost_usd), 0) as total FROM trades WHERE status = 'open'")
    .get() as { total: number };
  return row.total;
}

export function getExposureByStrategy(): { strategy: string; exposure: number }[] {
  const db = getDb();
  return db
    .prepare(
      "SELECT strategy, SUM(cost_usd) as exposure FROM trades WHERE status = 'open' GROUP BY strategy"
    )
    .all() as { strategy: string; exposure: number }[];
}

export function getPnlOverTime(): { date: string; pnl: number; cumulative_pnl: number }[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT
        DATE(closed_at) as date,
        SUM(pnl) as pnl
      FROM trades
      WHERE status IN ('closed', 'resolved') AND pnl IS NOT NULL
      GROUP BY DATE(closed_at)
      ORDER BY date`
    )
    .all() as { date: string; pnl: number }[];

  let cumulative = 0;
  return rows.map((r) => {
    cumulative += r.pnl;
    return { ...r, cumulative_pnl: cumulative };
  });
}

export function getWinRateByStrategy(): {
  strategy: string;
  wins: number;
  losses: number;
  total: number;
  win_rate: number;
}[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT
        strategy,
        SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN pnl <= 0 THEN 1 ELSE 0 END) as losses,
        COUNT(*) as total,
        ROUND(100.0 * SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) / COUNT(*), 1) as win_rate
      FROM trades
      WHERE status IN ('closed', 'resolved') AND pnl IS NOT NULL
      GROUP BY strategy`
    )
    .all() as { strategy: string; wins: number; losses: number; total: number; win_rate: number }[];
}

export function getBestWorstTrades(limit: number = 5): { best: Trade[]; worst: Trade[] } {
  const db = getDb();
  const best = db
    .prepare(
      "SELECT * FROM trades WHERE pnl IS NOT NULL ORDER BY pnl DESC LIMIT @limit"
    )
    .all({ limit }) as Trade[];
  const worst = db
    .prepare(
      "SELECT * FROM trades WHERE pnl IS NOT NULL ORDER BY pnl ASC LIMIT @limit"
    )
    .all({ limit }) as Trade[];
  return { best, worst };
}

export function getRecentActivity(): Trade[] {
  return getTrades({ limit: 10 });
}

export function getDashboardSummary() {
  const state = getAgentState();
  const exposure = getTotalExposure();
  const openCount = getTradeCount({ status: "open" });
  const closedCount = getTradeCount({ status: "closed" }) + getTradeCount({ status: "resolved" });
  const exposureByStrategy = getExposureByStrategy();
  const recentTrades = getRecentActivity();
  const strategies = getStrategies();

  return {
    state,
    exposure,
    openCount,
    closedCount,
    exposureByStrategy,
    recentTrades,
    strategies,
  };
}

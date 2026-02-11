import { supabase, AgentState, Trade, PriceHistory, ApiCost } from './supabase';

export async function getAgentState(): Promise<AgentState | null> {
  const { data } = await supabase
    .from('pm_agent_state')
    .select('*')
    .eq('id', 1)
    .single();
  return data;
}

export async function getTrades(options?: {
  status?: string;
  strategy?: string;
  limit?: number;
  offset?: number;
}): Promise<Trade[]> {
  let query = supabase.from('pm_trades').select('*');

  if (options?.status) query = query.eq('status', options.status);
  if (options?.strategy) query = query.eq('strategy', options.strategy);

  query = query.order('created_at', { ascending: false });
  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 100) - 1);

  const { data } = await query;
  return data || [];
}

export async function getTradeCount(options?: { status?: string; strategy?: string }): Promise<number> {
  let query = supabase.from('pm_trades').select('*', { count: 'exact', head: true });

  if (options?.status) query = query.eq('status', options.status);
  if (options?.strategy) query = query.eq('strategy', options.strategy);

  const { count } = await query;
  return count || 0;
}

export async function getOpenPositions(): Promise<Trade[]> {
  return getTrades({ status: 'open' });
}

export async function getStrategies(): Promise<string[]> {
  const { data } = await supabase
    .from('pm_trades')
    .select('strategy')
    .order('strategy');

  const unique = [...new Set(data?.map(r => r.strategy) || [])];
  return unique;
}

export async function getPriceHistory(marketId: string, limit?: number): Promise<PriceHistory[]> {
  const { data } = await supabase
    .from('pm_price_history')
    .select('*')
    .eq('market_id', marketId)
    .order('recorded_at', { ascending: false })
    .limit(limit || 500);

  return data || [];
}

export async function getLatestPrices(marketIds: string[]): Promise<Record<string, PriceHistory>> {
  const result: Record<string, PriceHistory> = {};

  for (const marketId of marketIds) {
    const { data } = await supabase
      .from('pm_price_history')
      .select('*')
      .eq('market_id', marketId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();

    if (data) result[marketId] = data;
  }
  return result;
}

export async function getApiCosts(): Promise<ApiCost[]> {
  const { data } = await supabase
    .from('pm_api_costs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return data || [];
}

export async function getTotalExposure(): Promise<number> {
  const { data } = await supabase
    .from('pm_trades')
    .select('cost_usd')
    .eq('status', 'open');

  return data?.reduce((sum, t) => sum + Number(t.cost_usd), 0) || 0;
}

export async function getExposureByStrategy(): Promise<{ strategy: string; exposure: number }[]> {
  const { data } = await supabase
    .from('pm_trades')
    .select('strategy, cost_usd')
    .eq('status', 'open');

  const grouped: Record<string, number> = {};
  data?.forEach(t => {
    grouped[t.strategy] = (grouped[t.strategy] || 0) + Number(t.cost_usd);
  });

  return Object.entries(grouped).map(([strategy, exposure]) => ({ strategy, exposure }));
}

export async function getPnlOverTime(): Promise<{ date: string; pnl: number; cumulative_pnl: number }[]> {
  const { data } = await supabase
    .from('pm_trades')
    .select('closed_at, pnl')
    .in('status', ['closed', 'resolved'])
    .not('pnl', 'is', null)
    .order('closed_at');

  const byDate: Record<string, number> = {};
  data?.forEach(t => {
    const date = t.closed_at?.split('T')[0];
    if (date) byDate[date] = (byDate[date] || 0) + Number(t.pnl);
  });

  let cumulative = 0;
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, pnl]) => {
      cumulative += pnl;
      return { date, pnl, cumulative_pnl: cumulative };
    });
}

export async function getWinRateByStrategy(): Promise<{
  strategy: string;
  wins: number;
  losses: number;
  total: number;
  win_rate: number;
}[]> {
  const { data } = await supabase
    .from('pm_trades')
    .select('strategy, pnl')
    .in('status', ['closed', 'resolved'])
    .not('pnl', 'is', null);

  const byStrategy: Record<string, { wins: number; losses: number }> = {};
  data?.forEach(t => {
    if (!byStrategy[t.strategy]) byStrategy[t.strategy] = { wins: 0, losses: 0 };
    if (Number(t.pnl) > 0) byStrategy[t.strategy].wins++;
    else byStrategy[t.strategy].losses++;
  });

  return Object.entries(byStrategy).map(([strategy, { wins, losses }]) => ({
    strategy,
    wins,
    losses,
    total: wins + losses,
    win_rate: Math.round((100 * wins) / (wins + losses) * 10) / 10,
  }));
}

export async function getBestWorstTrades(limit: number = 5): Promise<{ best: Trade[]; worst: Trade[] }> {
  const { data: best } = await supabase
    .from('pm_trades')
    .select('*')
    .not('pnl', 'is', null)
    .order('pnl', { ascending: false })
    .limit(limit);

  const { data: worst } = await supabase
    .from('pm_trades')
    .select('*')
    .not('pnl', 'is', null)
    .order('pnl', { ascending: true })
    .limit(limit);

  return { best: best || [], worst: worst || [] };
}

export async function getRecentActivity(): Promise<Trade[]> {
  return getTrades({ limit: 10 });
}

export async function getDashboardSummary() {
  const [state, exposure, openCount, closedCount, resolvedCount, exposureByStrategy, recentTrades, strategies] =
    await Promise.all([
      getAgentState(),
      getTotalExposure(),
      getTradeCount({ status: 'open' }),
      getTradeCount({ status: 'closed' }),
      getTradeCount({ status: 'resolved' }),
      getExposureByStrategy(),
      getRecentActivity(),
      getStrategies(),
    ]);

  return {
    state,
    exposure,
    openCount,
    closedCount: closedCount + resolvedCount,
    exposureByStrategy,
    recentTrades,
    strategies,
  };
}

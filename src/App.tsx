/**
 * BlueCrew CostLab - Main Application Component
 * AI-Powered Construction Estimating Platform
 */

import React, { useEffect } from 'react';
import { useEstimateStore } from './store/estimateStore';
import { EstimateHeader } from './components/EstimateHeader';
import { TradePanel } from './components/TradePanel';
import { ReviewPanel } from './components/ReviewPanel';
import { TRADE_LIST } from './data/trades';
import type { TradeCategory } from './types/estimate';
import './App.css';

function App() {
  const estimate = useEstimateStore((state) => state.estimate);
  const createEstimate = useEstimateStore((state) => state.createEstimate);

  // Initialize with a sample estimate on first load
  useEffect(() => {
    if (!estimate) {
      createEstimate('Sample Pool Project', 'John Smith', '123 Main St, Phoenix, AZ');
    }
  }, [estimate, createEstimate]);

  if (!estimate) {
    return <div className="loading">Loading...</div>;
  }

  // Group line items by trade
  const lineItemsByTrade = new Map<TradeCategory, typeof estimate.lineItems>();
  TRADE_LIST.forEach((trade) => {
    lineItemsByTrade.set(
      trade.id,
      estimate.lineItems.filter((item) => item.tradeId === trade.id)
    );
  });

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <h1>BlueCrew CostLab</h1>
          <span className="tagline">AI-Powered Construction Estimating</span>
        </div>
        <nav className="nav">
          <button className="nav-btn active">Estimate</button>
          <button className="nav-btn">Review</button>
          <button className="nav-btn">Proposal</button>
        </nav>
      </header>

      <main className="main-content">
        <EstimateHeader />

        <div className="estimate-content">
          <section className="trades-section">
            <h2>Trade Modules</h2>
            <p className="section-description">
              Toggle trades on/off and add line items. Trades below minimum margin will be flagged.
            </p>

            <div className="trades-list">
              {TRADE_LIST.map((trade) => {
                const summary = estimate.trades.get(trade.id);
                const items = lineItemsByTrade.get(trade.id) || [];

                if (!summary) return null;

                return (
                  <TradePanel
                    key={trade.id}
                    tradeId={trade.id}
                    summary={summary}
                    lineItems={items}
                  />
                );
              })}
            </div>
          </section>

          <aside className="review-section">
            <ReviewPanel />
          </aside>
        </div>
      </main>

      <footer className="app-footer">
        <p>BlueCrew CostLab v0.1.0 - Hybrid AI + Human Estimating</p>
        <p className="disclaimer">All AI-generated values require human approval</p>
      </footer>
    </div>
  );
}

export default App;

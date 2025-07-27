// src/utils/indicators.js
import axios from "axios";

// Simple Moving Average (SMA)
const calculateSMA = (data, period) => {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const avg = slice.reduce((a, b) => a + b, 0) / period;
    result.push(avg);
  }
  return result;
};

// Relative Strength Index (RSI)
const calculateRSI = (prices, period = 14) => {
  let gains = 0, losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  const rsiValues = [];

  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
    rsiValues.push(rsi);
  }

  return rsiValues;
};

// Fetch price history and compute indicators
export const getIndicators = async (coinId) => {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=inr&days=30`;
    const res = await axios.get(url);
    const prices = res.data.prices.map(p => p[1]); // p = [timestamp, price]

    const sma7 = calculateSMA(prices, 7).at(-1);
    const sma21 = calculateSMA(prices, 21).at(-1);
    const rsi = calculateRSI(prices).at(-1);

    return {
      sma7: Number(sma7?.toFixed(2)),
      sma21: Number(sma21?.toFixed(2)),
      rsi: Number(rsi?.toFixed(2)),
    };
  } catch (err) {
    console.error("Failed to fetch indicators:", err.message);
    return { sma7: null, sma21: null, rsi: null };
  }
};
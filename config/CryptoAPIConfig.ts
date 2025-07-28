// Crypto Configuration
export const CRYPTO_CONFIG = {
  // WebSocket API endpoint
  WEBSOCKET_URL: 'wss://stream.binance.com:9443/ws/!ticker@arr',

  // Reconnection settings
  RECONNECT_DELAY: 5000, // 5 seconds

  // Popular cryptocurrencies to display
  POPULAR_SYMBOLS: [
    'BTCUSDT',  // Bitcoin
    'ETHUSDT',  // Ethereum
    'BNBUSDT',  // Binance Coin
    'ADAUSDT',  // Cardano
    'SOLUSDT',  // Solana
    'DOTUSDT',  // Polkadot
    'MATICUSDT', // Polygon
    'LINKUSDT', // Chainlink
  ],
  
  // Price formatting
  PRICE_DECIMAL_PLACES: 2,
  PERCENTAGE_DECIMAL_PLACES: 2,
};

// API response field mappings
export const API_FIELDS = {
  SYMBOL: 's',           // Symbol field
  CURRENT_PRICE: 'c',    // Current price field
  PRICE_CHANGE: 'P',     // Price change percentage field
  PRICE_CHANGE_AMOUNT: 'p', // Price change amount field
  HIGH_24H: 'h',         // 24h high
  LOW_24H: 'l',          // 24h low
  VOLUME: 'v',           // Volume
}; 
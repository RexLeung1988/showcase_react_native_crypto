import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import {CRYPTO_CONFIG, API_FIELDS} from '../config/CryptoAPIConfig';
import {PRICE_COLORS} from '../config/CryptoUIConfig';

interface CryptoData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  lastUpdate: Date;
}

const CryptoPrice: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    let ws: WebSocket | null = null;

    const connectWebSocket = () => {
      try {
        // Using Binance WebSocket API (free and reliable)
        ws = new WebSocket(CRYPTO_CONFIG.WEBSOCKET_URL);

        ws.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          setError(null);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Filter for popular cryptocurrencies
            const filteredData = data
              .filter((item: any) => CRYPTO_CONFIG.POPULAR_SYMBOLS.includes(item[API_FIELDS.SYMBOL]))
              .map((item: any) => ({
                symbol: item[API_FIELDS.SYMBOL],
                price: parseFloat(item[API_FIELDS.CURRENT_PRICE]).toFixed(CRYPTO_CONFIG.PRICE_DECIMAL_PLACES),
                priceChange: parseFloat(item[API_FIELDS.PRICE_CHANGE_AMOUNT]).toFixed(CRYPTO_CONFIG.PRICE_DECIMAL_PLACES),
                priceChangePercent: parseFloat(item[API_FIELDS.PRICE_CHANGE]).toFixed(CRYPTO_CONFIG.PERCENTAGE_DECIMAL_PLACES),
                lastUpdate: new Date(),
              }));

            setCryptoData(filteredData);
          } catch (parseError) {
            console.error('Error parsing WebSocket data:', parseError);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('Connection error. Please check your internet connection.');
          setIsConnected(false);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          // Attempt to reconnect after configured delay
          setTimeout(connectWebSocket, CRYPTO_CONFIG.RECONNECT_DELAY);
        };
      } catch (err) {
        console.error('Error creating WebSocket:', err);
        setError('Failed to connect to crypto data service.');
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const getPriceChangeColor = (change: string) => {
    const changeValue = parseFloat(change);
    if (changeValue > 0) return PRICE_COLORS.POSITIVE;
    if (changeValue < 0) return PRICE_COLORS.NEGATIVE;
    return isDarkMode ? '#ccc' : PRICE_COLORS.NEUTRAL;
  };

  const formatSymbol = (symbol: string) => {
    return symbol.replace('USDT', '');
  };

  if (error) {
    return (
      <View style={[styles.container, {backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'}]}>
        <Text style={[styles.errorText, {color: isDarkMode ? '#ff6b6b' : '#d32f2f'}]}>
          {error}
        </Text>
        <Text style={[styles.retryText, {color: isDarkMode ? '#ccc' : '#666'}]}>
          Retrying connection...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#000'}]}>
          📈 Live Crypto Prices
        </Text>
        <View style={styles.connectionStatus}>
          <View style={[styles.statusDot, {backgroundColor: isConnected ? '#4CAF50' : '#FF9800'}]} />
          <Text style={[styles.statusText, {color: isDarkMode ? '#ccc' : '#666'}]}>
            {isConnected ? 'Live' : 'Connecting...'}
          </Text>
        </View>
      </View>

      {!isConnected && cryptoData.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
          <Text style={[styles.loadingText, {color: isDarkMode ? '#ccc' : '#666'}]}>
            Connecting to crypto data...
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {cryptoData.map((crypto, index) => (
            <View
              key={crypto.symbol}
              style={[
                styles.cryptoCard,
                {
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
                  borderColor: isDarkMode ? '#444' : '#e0e0e0',
                },
              ]}>
              <View style={styles.cryptoHeader}>
                <Text style={[styles.cryptoSymbol, {color: isDarkMode ? '#fff' : '#000'}]}>
                  {formatSymbol(crypto.symbol)}
                </Text>
                <Text style={[styles.cryptoName, {color: isDarkMode ? '#ccc' : '#666'}]}>
                  {crypto.symbol}
                </Text>
              </View>
              
              <View style={styles.priceContainer}>
                <Text style={[styles.price, {color: isDarkMode ? '#fff' : '#000'}]}>
                  ${crypto.price}
                </Text>
                <View style={styles.changeContainer}>
                  <Text
                    style={[
                      styles.priceChange,
                      {color: getPriceChangeColor(crypto.priceChangePercent)},
                    ]}>
                    {parseFloat(crypto.priceChangePercent) > 0 ? '+' : ''}
                    {crypto.priceChangePercent}%
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.lastUpdate, {color: isDarkMode ? '#999' : '#888'}]}>
                Updated: {crypto.lastUpdate.toLocaleTimeString()}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  cryptoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cryptoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cryptoSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cryptoName: {
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  changeContainer: {
    alignItems: 'flex-end',
  },
  priceChange: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastUpdate: {
    fontSize: 12,
    textAlign: 'right',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CryptoPrice; 
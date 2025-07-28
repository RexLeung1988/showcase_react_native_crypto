/**
 * ShowcaseCrypto React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import CryptoPrice from './components/CryptoPrice';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState<'hello' | 'crypto'>('hello');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  const renderHelloWorld = () => (
    <NewAppScreen templateFileName="App.tsx" />
  );

  const renderTabBar = () => (
    <View style={[styles.tabBar, {backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8'}]}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'hello' && {
            backgroundColor: isDarkMode ? '#333' : '#e0e0e0',
          },
        ]}
        onPress={() => setActiveTab('hello')}>
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'hello' 
                ? (isDarkMode ? '#fff' : '#000') 
                : (isDarkMode ? '#ccc' : '#666'),
            },
          ]}>
          🌍 Hello World
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'crypto' && {
            backgroundColor: isDarkMode ? '#333' : '#e0e0e0',
          },
        ]}
        onPress={() => setActiveTab('crypto')}>
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'crypto' 
                ? (isDarkMode ? '#fff' : '#000') 
                : (isDarkMode ? '#ccc' : '#666'),
            },
          ]}>
          📈 Crypto Prices
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      
      {renderTabBar()}
      
      {activeTab === 'hello' ? renderHelloWorld() : <CryptoPrice />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default App;

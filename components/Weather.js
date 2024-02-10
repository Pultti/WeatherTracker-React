import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Replace with your own API URL and key in the env file
const api = {
 url: process.env.EXPO_PUBLIC_API_URL,
 key: process.env.EXPO_PUBLIC_API_KEY,
 icons: process.env.EXPO_PUBLIC_ICONS_URL
};

export default function Weather({ latitude, longitude }) {
  const [temp, setTemp] = useState(0);
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      if (latitude && longitude) {
        const url = `${api.url}lat=${latitude}&lon=${longitude}&appid=${api.key}&units=metric`;
        try {
          const response = await fetch(url);
          const json = await response.json();
          if (response.ok) {
            setTemp(json.main.temp);
            setDescription(json.weather[0].description);
            setIcon(api.icons + json.weather[0].icon + '@2x.png');
          } else {
            setErrorMessage(json.message || 'Error fetching weather');
          }
        } catch (error) {
          console.error(error);
          setErrorMessage('Error fetching weather data');
        }
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

 return (
  <View style={styles.container}>
    {errorMessage ? (
      <Text style={styles.error}>{errorMessage}</Text>
    ) : (
      <View>
        <Text style={styles.temp}>{temp}°C</Text>
        {icon ? (
          <Image source={{ uri: icon }} style={styles.icon} />
        ) : (
          <Text>Loading icon...</Text> // Or you can render a placeholder image or nothing
        )}
        <Text style={styles.description}>{description}</Text>
      </View>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  temp: {
    fontSize: 18,
    color: '#000',
    marginTop: 5,
  },
  description: {
    fontSize: 18,
    color: '#000',
    
  },
  icon: {
    width: 100,
    height: 100
  },
  error: {
    color: 'red',
    fontSize: 18
  }
});
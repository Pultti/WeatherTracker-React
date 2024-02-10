import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import Weather from './Weather';

export default function Position() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [cityName, setCityName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Retrieving location...');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setMessage("Location not permitted.");
        setIsLoading(false);
        return;
      }
  
      try {
        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
  
        // Call getCityName function and update state
        const nameOfCity = await getCityName(position.coords.latitude, position.coords.longitude);
        setCityName(nameOfCity);
        setMessage('');
      } catch (error) {
        setMessage("Error retrieving location.");
        console.log(error);
      }
      setIsLoading(false);
    })();
  }, []);

  const getCityName = async (lat, lon) => {
    
    const geocodeAPI = 'http://api.openweathermap.org/geo/1.0/reverse?'; // Correct API endpoint for reverse geocoding
    const apiKey = 'Your own api key'; // Replace with your actual API key
  
    try {
      // Ensure lat and lon are numbers and not undefined or null
      if (typeof lat !== 'number' || typeof lon !== 'number') {
        throw new Error('Invalid coordinates provided for geocoding.');
      }
  
      const url = `${geocodeAPI}lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
      const response = await fetch(url);
      const json = await response.json();
  
      if (!response.ok) {
        throw new Error(json.message || 'Failed to get city name');
      }
  
      // Accessing the name of the first result if it exists
      const cityName = json[0]?.name;
  
      return cityName;
    } catch (error) {
      console.error('Error getting city name:', error);
      return ''; // Return an empty string or handle accordingly
    }
  };

  return (
    <View style={styles.container}>
      {!isLoading ? (
        <>
          <Text style={styles.header}>Current Weather</Text>
          <View style={styles.leftAlignedContainer}>
          <Text style={styles.coords}>
            {latitude.toFixed(3)}, {longitude.toFixed(3)} {cityName && `- ${cityName}`}
          </Text>
          <Text style={styles.message}>Location retrieved</Text>
          <Weather latitude={latitude} longitude={longitude} />
          </View>
        </>
      ) : (
        <Text style={styles.message}>{message}</Text>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
    leftAlignedContainer: {
        alignSelf: 'stretch', // Ensures the container takes full width of the parent
        alignItems: 'flex-start', // Aligns children to the start (left)
        marginLeft: 20, // Adds some margin to the left
        padding: 10, // Adds some padding to the container
      },
    coords: {
      fontSize: 18, // Smaller font size for coordinates
      marginBottom: 4, // Reduced space below coordinates
    },
    message: {
      fontSize: 18, // Smaller font size for location retrieved message
      fontWeight: 'bold',
    },
    // Add any other styles that you need
  });
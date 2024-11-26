import { useState, useEffect } from 'react';
import './App.css';
import { BDC_API_KEY } from '../config';

function App() {
  const [location, setLocation] = useState("Default");
  const [landmarks, setLandmarks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Mock landmark data for different cities
  const landmarksData = {
    "Enugu": [
      { name: "Nike Lake Resort", hotels: 8, imgSrc: "images/Landmarks/Enu/nike_lake_resort.jpeg" },
      { name: "Polo Park Mall", hotels: 5, imgSrc: "images/Landmarks/Enu/polo_park_mall.jpeg" },
      { name: "Ngwo Pine Forest", hotels: 10, imgSrc: "images/Landmarks/Enu/ngwo_pine_forest.jpeg" },
    ],
    "Abuja": [
      { name: "National Mosque", hotels: 12, imgSrc: "images/Landmarks/Abj/mosque.jpeg" },
      { name: "Aso Rock", hotels: 15, imgSrc: "images/Landmarks/Abj/aso_rock.jpeg" },
      { name: "Jabi Lake", hotels: 9, imgSrc: "images/Landmarks/Abj/jabi_lake.jpeg" },
    ],
    "Kaduna": [
      { name: "Barnawa Market Square", hotels: 7, imgSrc: "images/Landmarks/Kaduna/barnawa_market_square.jpeg" },
      { name: "Command Junction", hotels: 11, imgSrc: "images/Landmarks/Kaduna/command_junction.jpeg" },
      { name: "Kaduna Refinery", hotels: 8, imgSrc: "images/Landmarks/Kaduna/kaduna_refinery.jpeg" },
    ],
    "Ekiti": [
      { name: "Fayose_market", hotels: 7, imgSrc: "images/Landmarks/Ekiti/fayose_market_correct.jpeg" },
      { name: "Green and Grills", hotels: 11, imgSrc: "images/Landmarks/Ekiti/green_and_grills.jpeg" },
      { name: "Prince Supermarket", hotels: 8, imgSrc: "images/Landmarks/Ekiti/prince_supermarket.jpeg" },
    ],
    "Default": [
      { name: "Lekki", hotels: 19, imgSrc: "images/hive1.png" },
      { name: "Victoria Island", hotels: 28, imgSrc: "images/hive2.png" },
      { name: "Bon Hotel", hotels: 42, imgSrc: "images/hive5.png" },
    ]
  };

  // Effect to automatically request geolocation on page load
  useEffect(() => {
    findMyCoordinates();
    // updateLandmarksBasedOnLocation("Kaduna");

  }, []);

  // Function to fetch and handle geolocation
  function findMyCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const bdcAPI = `https://api-bdc.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=${BDC_API_KEY}`;
          getAPI(bdcAPI);
        //   console.log("Generated API URL:", bdcAPI);

        // console.log("Latitude:", position);
        },
        (err) => {
          console.error("Geolocation error:", err.message);
          setErrorMessage("Location access denied. Default location will be shown.");
          updateLandmarksBasedOnLocation("Default");
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by your browser");
      updateLandmarksBasedOnLocation("Default");
    }
  }

  // Function to get the API response
  function getAPI(bdcAPI) {
    fetch(bdcAPI)
      .then(response => response.json())
      .then(data => {
        const userLocation = data.principalSubdivision || "Lagos"; // Default to "Lagos" if location info isn't available
        updateLandmarksBasedOnLocation(userLocation);
      })
      .catch(error => {
        console.error("Error fetching API:", error);
        setErrorMessage("Error fetching location data.");
        updateLandmarksBasedOnLocation("Default");
      });
  }

  // Function to update landmarks based on location
  function updateLandmarksBasedOnLocation(location) {
    setLocation(location);
    setLandmarks(landmarksData[location] || landmarksData["Default"]);
  }

  return (
    <div>
      <button id="share">Share my location</button>

      <pre id="result">{errorMessage}</pre>

      <h2 id="landmarks-title">Landmarks in {location} near you</h2>

      <div id="landmarks">
        {landmarks.map(landmark => (
          <div className="landmark-card" key={landmark.name}>
            <img src={landmark.imgSrc} alt={landmark.name} />
            <p className="location-name">{landmark.name}</p>
            <p className="hotel-count">{landmark.hotels} hotels recommended</p>
          </div>
        ))}
      </div>

      <div id="map" style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
}

export default App;

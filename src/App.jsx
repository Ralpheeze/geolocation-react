import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const [location, setLocation] = useState("Default");
  const [landmarks, setLandmarks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  // const [coordinates, setCoordinates] = useState({ lat: 6.5244, lon: 3.3792 }); // Default to Lagos

  const landmarksData = {
    "Enugu State": [
      { name: "Nike Lake Resort", hotels: 8, imgSrc: "images/Landmarks/Enu/nike_lake_resort.jpeg" },
      { name: "Polo Park Mall", hotels: 5, imgSrc: "images/Landmarks/Enu/polo_park_mall.jpeg" },
      { name: "Ngwo Pine Forest", hotels: 10, imgSrc: "images/Landmarks/Enu/ngwo_pine_forest.jpeg" },
    ],
    "Abuja": [
      { name: "National Mosque", hotels: 12, imgSrc: "images/Landmarks/Abj/mosque.jpeg" },
      { name: "Aso Rock", hotels: 15, imgSrc: "images/Landmarks/Abj/aso_rock.jpeg" },
      { name: "Jabi Lake", hotels: 9, imgSrc: "images/Landmarks/Abj/jabi_lake.jpeg" },
    ],
    "Plateau": [
      { name: "Shebby Hills", hotels: 12, imgSrc: "images/Landmarks/Jos/shebby_hills.jpeg" },
      { name: "Ten Commandments", hotels: 15, imgSrc: "images/Landmarks/Jos/ten_commandments.jpeg" },
      { name: "Wild Life Park", hotels: 9, imgSrc: "images/Landmarks/Jos/wild_life_park.jpeg" },
      
    ],
    "Kaduna": [
      { name: "Barnawa Market Square", hotels: 7, imgSrc: "images/Landmarks/Kaduna/barnawa_market_square.jpeg" },
      { name: "Command Junction", hotels: 11, imgSrc: "images/Landmarks/Kaduna/command_junction.jpeg" },
      { name: "Kaduna Refinery", hotels: 8, imgSrc: "images/Landmarks/Kaduna/kaduna_refinery.jpeg" },
    ],
    "Ekiti": [
      { name: "Fayose Market", hotels: 7, imgSrc: "images/Landmarks/Ekiti/fayose_market_correct.jpeg" },
      { name: "Green and Grills", hotels: 11, imgSrc: "images/Landmarks/Ekiti/green_and_grills.jpeg" },
      { name: "Prince Supermarket", hotels: 8, imgSrc: "images/Landmarks/Ekiti/prince_supermarket.jpeg" },
    ],
    "Edo": [
      { name: "Kada Cinema", hotels: 7, imgSrc: "images/Landmarks/Edo/kada_cinema.jpeg" },
      { name: "Ring Road", hotels: 11, imgSrc: "images/Landmarks/Edo/ring_road.jpeg" },
      { name: "St. Paul Anglican Church", hotels: 8, imgSrc: "images/Landmarks/Edo/st_paul.jpeg" },
    ],
    "Lagos": [
      { name: "Lekki Peninsula Scheme 1", hotels: 19, imgSrc: "images/hive1.png" },
      { name: "Victoria Island", hotels: 28, imgSrc: "images/hive2.png" },
      { name: "Bon Hotel", hotels: 42, imgSrc: "images/hive5.png" },
      { name: "Bon Hotel", hotels: 42, imgSrc: "images/hive5.png" },
    ]
  };

  useEffect(() => {
    findMyCoordinates();
  }, []);

  function findMyCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          // setCoordinates({ lat: latitude, lon: longitude });
          setLocationBasedOnCoordinates(latitude, longitude);
          // console.log("Accurate GPS coordinates:", latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setErrorMessage("Location access denied. Default location will be shown.");
          updateLandmarksBasedOnLocation("Default");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }  // Force GPS refresh

      );
    } else {
      setErrorMessage("Geolocation is not supported by your browser");
      updateLandmarksBasedOnLocation("Default");
    }
  }

  function setLocationBasedOnCoordinates(lat, lon) {
    const nominatimAPI = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    axios
      .get(nominatimAPI)
      .then(response => {
        const userLocation = response.data.address?.state || "Lagos";
        updateLandmarksBasedOnLocation(userLocation);
        // console.log("data", response.data);
      })
      .catch(error => {
        console.error("Error fetching location data:", error);
        setErrorMessage("Error fetching location data.");
        updateLandmarksBasedOnLocation("Default");
      });
  }

  function updateLandmarksBasedOnLocation(location) {
    console.log("location", location);
    setLocation(location);
    // setLandmarks(landmarksData["Plateau"] || []);

    // setLandmarks( landmarksData[location]);
    // if (location && landmarksData.hasOwnProperty(location)) {
    //   setLandmarks(landmarksData[location]);
    // } else {
    //   console.warn(`Location "${location}" not found. Defaulting to "Lagos".`);
    //   setLandmarks(landmarksData["Lagos"]);
    // }

    if (location && landmarksData && Object.prototype.hasOwnProperty.call(landmarksData, location)) {
      setLandmarks(landmarksData[location]);
    } else {
      console.warn(`Location "${location}" not found. Defaulting to "Lagos".`);
      setLandmarks(landmarksData["Lagos"]);
    }
  }

  return (
    <div>
      <button onClick={findMyCoordinates}>Share my location</button>
      <pre id="result">{errorMessage}</pre>

      <h2 id="landmarks-title">Landmarks in {location} Near You</h2>
      <div id="landmarks">
        {landmarks.map((landmark) => (
          <div className="landmark-card" key={landmark.name}>
            <img src={landmark.imgSrc} alt={landmark.name} />
            <p className="location-name">{landmark.name}</p>
            <p className="hotel-count">{landmark.hotels} hotels recommended</p>
          </div>
        ))}
      </div>

      {/* Leaflet Map */}
      {/* <MapContainer
        center={[coordinates.lat, coordinates.lon]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; 
          <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[coordinates.lat, coordinates.lon]}>
          <Popup>You are here: {location}</Popup>
        </Marker>
      </MapContainer> */}
    </div>
  );
}

export default App;




// import { useState, useEffect } from 'react';
// import './App.css';
// import axios from 'axios';
// // import { BDC_API_KEY } from '../config';

// function App() {
//   const [location, setLocation] = useState("Default");
//   const [landmarks, setLandmarks] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');

//   // Mock landmark data for different cities
//   const landmarksData = {
//     "Enugu State": [
//       { name: "Nike Lake Resort", hotels: 8, imgSrc: "images/Landmarks/Enu/nike_lake_resort.jpeg" },
//       { name: "Polo Park Mall", hotels: 5, imgSrc: "images/Landmarks/Enu/polo_park_mall.jpeg" },
//       { name: "Ngwo Pine Forest", hotels: 10, imgSrc: "images/Landmarks/Enu/ngwo_pine_forest.jpeg" },
//     ],
//     "Abuja": [
//       { name: "National Mosque", hotels: 12, imgSrc: "images/Landmarks/Abj/mosque.jpeg" },
//       { name: "Aso Rock", hotels: 15, imgSrc: "images/Landmarks/Abj/aso_rock.jpeg" },
//       { name: "Jabi Lake", hotels: 9, imgSrc: "images/Landmarks/Abj/jabi_lake.jpeg" },
//     ],
//     "Plateau": [
//       { name: "Shebby Hills", hotels: 12, imgSrc: "images/Landmarks/Jos/shebby_hills.peg" },
//       { name: "Ten Commandments", hotels: 15, imgSrc: "images/Landmarks/Jos/ten_commandments.jpeg" },
//       { name: "Wild Life Park", hotels: 9, imgSrc: "images/Landmarks/Jos/wild_life_park.jpeg" },
//     ],
//     "Kaduna": [
//       { name: "Barnawa Market Square", hotels: 7, imgSrc: "images/Landmarks/Kaduna/barnawa_market_square.jpeg" },
//       { name: "Command Junction", hotels: 11, imgSrc: "images/Landmarks/Kaduna/command_junction.jpeg" },
//       { name: "Kaduna Refinery", hotels: 8, imgSrc: "images/Landmarks/Kaduna/kaduna_refinery.jpeg" },
//     ],
//     "Ekiti": [
//       { name: "Fayose Market", hotels: 7, imgSrc: "images/Landmarks/Ekiti/fayose_market_correct.jpeg" },
//       { name: "Green and Grills", hotels: 11, imgSrc: "images/Landmarks/Ekiti/green_and_grills.jpeg" },
//       { name: "Prince Supermarket", hotels: 8, imgSrc: "images/Landmarks/Ekiti/prince_supermarket.jpeg" },
//     ],
//     "Edo": [
//       { name: "Kada Cinema", hotels: 7, imgSrc: "images/Landmarks/Edo/kada_cinema.jpeg" },
//       { name: "Ring Road", hotels: 11, imgSrc: "images/Landmarks/Edo/ring_road.jpeg" },
//       { name: "St. Paul Anglican Church", hotels: 8, imgSrc: "images/Landmarks/Edo/st_paul.jpeg" },
//     ],
//     "Lagos": [
//       { name: "Lekki", hotels: 19, imgSrc: "images/hive1.png" },
//       { name: "Victoria Island", hotels: 28, imgSrc: "images/hive2.png" },
//       { name: "Bon Hotel", hotels: 42, imgSrc: "images/hive5.png" },
//     ]
//   };

//   // Effect to automatically request geolocation on page load
//   useEffect(() => {
//     findMyCoordinates();
//     // updateLandmarksBasedOnLocation("Kaduna");

//   }, []);

//   // Function to fetch and handle geolocation
//   function findMyCoordinates() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
//           const nominatimAPI = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
//           getAPI(nominatimAPI);
//           // const bdcAPI = `https://api-bdc.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=${BDC_API_KEY}`;
//           // getAPI(bdcAPI);
//           console.log("Generated API URL:", nominatimAPI);

//         // console.log("Latitude:", position);
//         },
//         (err) => {
//           console.error("Geolocation error:", err.message);
//           setErrorMessage("Location access denied. Default location will be shown.");
//           updateLandmarksBasedOnLocation("Default");
//         }
//       );
//     } else {
//       setErrorMessage("Geolocation is not supported by your browser");
//       updateLandmarksBasedOnLocation("Default");
//     }
//   }

//   // Function to get the API response
//   // function getAPI(bdcAPI) {
//   //   fetch(bdcAPI)
//   //     .then(response => response.json())
//   //     .then(data => {
//   //       const userLocation = data.principalSubdivision || "Lagos"; // Default to "Lagos" if location info isn't available
//   //       updateLandmarksBasedOnLocation(userLocation);
//   //     })

//   function getAPI(apiURL) {
//     axios
//       .get(apiURL)
//       .then(response => {
//         const data = response.data;
//         const userLocation = data.address?.state || "Lagos"; // Use state or default to "Lagos"
//         console.log("User location:", data);
//         // console.log("User location:", userLocation);
//         updateLandmarksBasedOnLocation(userLocation);
//       })
//       .catch(error => {
//         console.error("Error fetching API:", error);
//         setErrorMessage("Error fetching location data.");
//         updateLandmarksBasedOnLocation("Default");
//       });
//   }

//   // Function to update landmarks based on location
//   function updateLandmarksBasedOnLocation(location) {
//     console.log("Updating landmarks for:", location); //for debugging
//     setLocation(location);
//     setLandmarks( landmarksData[location]);
//     // if (landmarksData.hasOwnProperty(location)) {
//     //   setLandmarks(landmarksData[location]);
//     // } else {
//     //   console.warn(`Location "${location}" not found. Defaulting to "Lagos".`); // Warn if location isn't found
//     //   setLandmarks(landmarksData["Lagos"]);
//     // }
//   }

//   // Instead of directly using object.hasOwnProperty(), use
//   //  Object.prototype.hasOwnProperty.call() which is safer
//   //  and avoids potential prototype issues.



//   return (
//     <div>
//       <button id="share">Share my location</button>

//       <pre id="result">{errorMessage}</pre>

//       <h2 id="landmarks-title">Landmarks in {location} near you</h2>

//       <div id="landmarks">
//         {landmarks.map(landmark => (
//           <div className="landmark-card" key={landmark.name}>
//             <img src={landmark.imgSrc} alt={landmark.name} />
//             <p className="location-name">{landmark.name}</p>
//             <p className="hotel-count">{landmark.hotels} hotels recommended</p>
//           </div>
//         ))}
//       </div>

//       <div id="map" style={{ height: "400px", width: "100%" }}></div>
//     </div>
//   );
// }

// export default App;

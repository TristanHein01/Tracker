
class Tracker {
    constructor() {
        this.previousCoords = null; // Vorherige Koordinaten
    }

    // Funktion zum Abrufen der Geschwindigkeit über die Geolocation-API
    getSpeed() {
        if ("geolocation" in navigator) {
            var geoOptions = {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            };
            navigator.geolocation.watchPosition(successCallback, errorCallback, geoOptions);

            function successCallback(position) {
                var speed = position.coords.speed;
                var speedKmph = (speed * 3.6).toFixed(2);
                document.getElementById("kmhslider").value = speedKmph;
                console.log(speedKmph)
            }

            function errorCallback(error) {
                console.error('Error occurred: ' + error.code + ' - ' + error.message);
            }
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

    // Funktion zum Starten und Stoppen des GPS-Kilometerzählers
    startStopTracker() {
        let watchId; // ID für die GPS-Positionswatch
        let distance = 0; // Zurückgelegte Entfernung in Kilometern

        // Startet die GPS-Positionswatch und den Kilometerzähler
        function startTracker() {
            watchId = navigator.geolocation.watchPosition(updateDistance, handleError);
        }

        // Stoppt die GPS-Positionswatch
        function stopTracker() {
            navigator.geolocation.clearWatch(watchId);
        }

        // Berechnet die Entfernung basierend auf zwei Positionen
        function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Erdradius in Kilometern
            const dLat = deg2rad(lat2 - lat1);
            const dLon = deg2rad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c; // Entfernung in Kilometern
            return d;
        }

        // Konvertiert Grad in Radian
        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }

        // Aktualisiert die Entfernung basierend auf der aktuellen Position
        const updateDistance = (position) => {
            const { coords } = position;
            const { latitude, longitude } = coords;
            if (this.previousCoords) {
                const { latitude: prevLat, longitude: prevLon } = this.previousCoords;
                distance += calculateDistance(prevLat, prevLon, latitude, longitude);
            }
            this.previousCoords = { latitude, longitude };
            const distanceElement = document.getElementById('valueshow');
            distanceElement.innerHTML = distance.toFixed(2); // Anzeige der Entfernung auf zwei Dezimalstellen
        };

        // Behandelt Fehler bei der GPS-Positionswatch
        function handleError(error) {
            console.error('Error getting GPS position:', error);
        }

        // Event-Listener für Start- und Stop-Buttons
        const startButton = document.getElementById('startButton');
        startButton.addEventListener('click', startTracker);

        const stopButton = document.getElementById('stopButton');
        stopButton.addEventListener('click', stopTracker);
    }
}

const tracker = new Tracker();

tracker.getSpeed();
tracker.startStopTracker(); 

// kmh gauge script
var basegradient = "repeating-conic-gradient(from 270deg, black  0deg 0.3deg, var(--color) 0.7deg 1.3deg, black  1.7deg 2deg)"

//input values
var total_kilometers = 172312;
var totalkm = total_kilometers;
var trip1_km = 352.7;
var trip2_km = 124.1;
var kmh = 0;
kmh = Math.max(0, Math.min(kmh, 270));

//log styles
var green = "color: seagreen; background-color: black; border: 1px solid seagreen; padding: 4px;";
var blue = "color: darkcyan; background-color: black; border: 1px solid darkcyan; padding: 4px;";
var orange = "color: orange; background-color: black; border: 1px solid orange; padding: 4px;";
var red = "color: red; background-color: black; border: 2px solid red; padding: 3px;";

window.onload = function () {
  console.clear();
  console.log("%cInitialisation", green);
};

//initial sweep
var sweepProgress = 0;
var InitialSweepInterv = setInterval(initialSweep, 20);
function initialSweep() {
  if (sweepProgress < 54) {
    kmh = kmh + 5;
    sweepProgress++;
    totalkm = 0;
    km = 0;
  }
  else if (sweepProgress < 108) {
    kmh = kmh - 5;
    sweepProgress++;
    totalkm = 999999;
    km = 9999;
    deci = 9;
  }
  else {
    console.log("%cInitial Sweep Complete", green);
    clearInterval(InitialSweepInterv);
    //check if below is null to do things after initial sweep
    InitialSweepInterv = null;
    totalkm = total_kilometers;
    trip = 2;
    switchTrip();
  }
};

//updating the gaug each frame
var ScreenUpdateInterv = setInterval(screenUpdate, 20);
function screenUpdate() {
  //ensuring no half bars are displayed (1 bar = 2kmh)
  if (kmh % 2 == 0) {
    movescale();
    updateOdometer();
    updateTripmeter();
  } else {
    kmh--;
    movescale();
    updateOdometer();
    updateTripmeter();
    kmh++;
  };
};



function movescale() {
  document.getElementById("gauge").style = "background: " + basegradient + ", conic-gradient(from 270deg, white 0deg " + kmh + "deg, black " + kmh + "deg);"
};

function updateOdometer() {
  document.getElementById("km_total").innerHTML = totalkm.toString().padStart(6, '0');
}

function updateTripmeter() {
  document.getElementById("km_trip").innerHTML = km.toString().padStart(4, '0');
  document.getElementById("km_trip_decimal").innerHTML = ". "+deci;

}

var km = 0;
var deci = 0;
var trip = 1;
function switchTrip() {
  switch (trip) {
    case 1:
      km = Math.floor(trip2_km);
      deci = (trip2_km % 1).toFixed(1).substring(2);
      trip = 2;
      document.getElementById("tripswitch_2").style = "border: 1px solid var(--darkcolor); background-color: var(--color);"
      document.getElementById("tripswitch_1").style = "border: 1px solid #022; background-color: #022;"
      break;
    case 2:
      km = Math.floor(trip1_km);
      deci = (trip1_km % 1).toFixed(1).substring(2);
      trip = 1;
      document.getElementById("tripswitch_1").style = "border: 1px solid var(--darkcolor); background-color: var(--color);"
      document.getElementById("tripswitch_2").style = "border: 1px solid #022; background-color: #022;"
      break;
    default:
      console.error("%ctrip switch state broken", red);
      break;
  }
  console.log("%cswitching trip - "+trip+" - "+km+"."+deci, blue);
};
/*
document.addEventListener('DOMContentLoaded', function () {
  gauge.style = "background: " + basegradient + ", conic-gradient(from 270deg, white 0deg " + kmh + "deg, black " + kmh + "deg);"
  slider.value = kmh;
  output.innerHTML = slider.value;
}, false);

*/
document.getElementById("kmhslider").oninput = function () {
  if (InitialSweepInterv == null) {
    kmh = this.value;
  };
  document.getElementById("valueshow").innerHTML = kmh;
};




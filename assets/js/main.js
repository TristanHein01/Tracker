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
                document.getElementById("geschw").textContent = speedKmph;
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
            const distanceElement = document.getElementById('distance');
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
tracker.getSpeed(); // Funktion zum Abrufen der Geschwindigkeit
tracker.startStopTracker(); // Funktion zum Starten und Stoppen des GPS-Kilometerzählers

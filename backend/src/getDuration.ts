const https = require('https');

export function getDuration(address1: string, address2: string) {
  const apiKey = 'AIzaSyCvjN6Fe_tf7S-c8VGVfuQQOIJxBPU92zU';
  const data = JSON.stringify({
    origin: {
      address: address1,
    },
    destination: {
      address: address2,
    },
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_AWARE',
    departureTime: '2024-06-17T15:01:23.045123456Z',
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false,
    },
    languageCode: 'en-US',
    units: 'IMPERIAL',
  });

  const options = {
    hostname: 'routes.googleapis.com',
    path: '/directions/v2:computeRoutes',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
    },
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(typeof JSON.parse(data).routes[0].duration);
      return JSON.parse(data).routes[0].duration;
    });
  });

  req.on('error', (error) => {
    console.error('Error fetching directions:', error);
  });

  req.write(data);
  req.end();
}

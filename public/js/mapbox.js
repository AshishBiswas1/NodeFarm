export const displayMap = () => {
  // Check if we are on the page with the map element (example: /tour.html)
  if (!window.location.pathname.includes('tour')) {
    console.log('Not on the tour page, skipping map initialization.');
    return; // Exit early if not on the correct page
  }

  // Wait for the window to fully load (after all elements are rendered)
  window.addEventListener('load', () => {
    // Ensure the page scrolls to the top
    window.scrollTo(0, 0); // Immediately scroll to the top after the page is loaded

    // Check if the map element exists on the current page
    const mapElement = document.getElementById('map');

    if (!mapElement) {
      console.log('Map element not found on this page.');
      return; // Exit early if the map element doesn't exist
    }

    // Make sure no part of the page focuses on the map automatically
    // Disable auto-scrolling behavior by setting the scroll position after everything loads
    setTimeout(() => {
      window.scrollTo(0, 0); // Scroll to top after everything is fully loaded
    }, 100); // Delay just in case

    // Check if Mapbox GL JS is already loaded
    if (typeof mapboxgl === 'undefined') {
      console.log('Mapbox GL JS not found, dynamically loading the library...');

      // If not loaded, add the script dynamically and wait for it to load
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.10.0/mapbox-gl.js';
      script.onload = () => {
        initializeMap(mapElement); // Once the script is loaded, initialize the map
      };
      document.head.appendChild(script);
    } else {
      // If already loaded, directly initialize the map
      initializeMap(mapElement);
    }
  });
};

function initializeMap(mapElement) {
  // Ensure the map element has locations data
  const locations = JSON.parse(mapElement.dataset.locations);

  if (!locations || locations.length === 0) {
    console.error('No locations data found.');
    return;
  }

  // Your Mapbox access token
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYXNoaXNoYmlzd2FzMSIsImEiOiJjbTdsamd1NHIwZGh0MnFzYTY5YnE1OG5kIn0.DPk1s988uoYpx7PYrts89w';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ashishbiswas1/cm7ll9wv1000a01qzft0nbcxg',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend the map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
}

// Google Earth Engine script to collect forest and non-forest data
// This script uses the Hansen Global Forest Change dataset

// Define your region of interest (ROI) for Sidi Abdallah, Rahmania, Algeria
// Using the coordinates provided: Lat 36.6802202, Long 2.8921599
// Creating a buffer around the point to analyze the surrounding area
var centerPoint = ee.Geometry.Point([2.8921599, 36.6802202]);
// Create a 5km buffer around the point (adjust radius as needed)
var roi = centerPoint.buffer(5000);

// Load the Hansen Global Forest Change dataset
var gfc = ee.Image('UMD/hansen/global_forest_change_2021_v1_9');

// Get the tree cover for the year 2000
var treeCover2000 = gfc.select(['treecover2000']);

// Get forest loss and gain
var lossYear = gfc.select(['lossyear']);
var gain = gfc.select(['gain']);

// Define forest as areas with tree cover > 20% (lowered threshold for Mediterranean vegetation)
var forestThreshold = 20;
var forest2000 = treeCover2000.gte(forestThreshold);

// Calculate current forest cover (2000 forest minus loss plus gain)
var loss = lossYear.gt(0);
var currentForest = forest2000.and(loss.not()).or(gain);

// Create a forest/non-forest classification
var forestNonForest = currentForest.rename('forest_nonforest');

// Set visualization parameters
var forestPalette = ['red', 'green'];
var forestVis = {
  min: 0,
  max: 1,
  palette: forestPalette
};

// Add high-resolution imagery for better context
var sentinel = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(roi)
  .filterDate(ee.Date(Date.now()).advance(-6, 'month'), ee.Date(Date.now()))
  .sort('CLOUD_COVERAGE_ASSESSMENT')
  .first();
  
var sentinelVis = {
  min: 0,
  max: 3000,
  bands: ['B4', 'B3', 'B2']
};

// Add layers to the map
Map.centerObject(roi, 12);
Map.addLayer(sentinel, sentinelVis, 'Sentinel-2 Imagery', false);
Map.addLayer(forestNonForest.clip(roi), forestVis, 'Forest/Non-Forest');
Map.addLayer(centerPoint, {color: 'yellow'}, 'Center Point');
Map.addLayer(roi, {color: 'blue', fillColor: '00000000'}, 'Region of Interest (5km buffer)');

// Calculate area statistics
var forestArea = ee.Image.pixelArea().multiply(forestNonForest).rename('forest_area');
var nonForestArea = ee.Image.pixelArea().multiply(forestNonForest.not()).rename('nonforest_area');

// Compute total areas
var stats = forestArea.addBands(nonForestArea).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: roi,
  scale: 30,
  maxPixels: 1e9
});

// Convert area to hectares
var forestAreaHa = ee.Number(stats.get('forest_area')).divide(10000);
var nonForestAreaHa = ee.Number(stats.get('nonforest_area')).divide(10000);

// Print results
print('Forest area (hectares):', forestAreaHa);
print('Non-forest area (hectares):', nonForestAreaHa);

// Export the forest/non-forest map
// Export the forest/non-forest map
Export.image.toDrive({
  image: forestNonForest.clip(roi),
  description: 'Sidi_Abdallah_Forest_Classification',
  scale: 30,
  region: roi,
  maxPixels: 1e9
});

// Also export the Sentinel-2 imagery for reference
Export.image.toDrive({
  image: sentinel.select(['B4', 'B3', 'B2']).clip(roi),
  description: 'Sidi_Abdallah_Sentinel_Imagery',
  scale: 10,
  region: roi,
  maxPixels: 1e9
});

// Export statistics as a CSV
var statsForExport = ee.FeatureCollection([
  ee.Feature(null, {
    'forest_area_ha': forestAreaHa,
    'nonforest_area_ha': nonForestAreaHa
  })
]);

Export.table.toDrive({
  collection: statsForExport,
  description: 'Sidi_Abdallah_Forest_Statistics',
  fileFormat: 'CSV'
});

// Additional code to get NDVI data for vegetation health assessment
var ndvi = sentinel.normalizedDifference(['B8', 'B4']).rename('NDVI');
Map.addLayer(ndvi.clip(roi), {min: -0.2, max: 0.8, palette: ['brown', 'yellow', 'green']}, 'NDVI', false);

// Export NDVI data
Export.image.toDrive({
  image: ndvi.clip(roi),
  description: 'Sidi_Abdallah_NDVI',
  scale: 10,
  region: roi,
  maxPixels: 1e9
});
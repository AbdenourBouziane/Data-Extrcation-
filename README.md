# Forest Classification Analysis for Sidi Abdallah

## Overview
This project uses Google Earth Engine to analyze and classify forest areas within a 5km radius of Sidi Abdallah. The analysis provides:
- Forest/non-forest classification map
- Current satellite imagery
- NDVI (Normalized Difference Vegetation Index) assessment
- Statistical data on forest coverage

![Google Earth Engine Editor](images/image1.png)


## Results
The analysis found:
- **Forest area:** 0.79 hectares
- **Non-forest area:** 121.46 hectares

![Task Manager showing completed analysis tasks](images/image3.png)\

*Completed tasks in Google Earth Engine Task Manager*

![Console output showing forest statistics](images/image2.png)

*Statistical results displayed in the console*

## How to Use This Script

### Step-by-Step Instructions

1. **Access Google Earth Engine**
   - Go to the [Google Earth Engine Code Editor](https://code.earthengine.google.com/)
   - Sign in with your Google account

2. **Run the Analysis**
   - Copy the script code and paste it into the Code Editor
   - Click the "Run" button to execute the analysis
   - View the results on the map interface

3. **Export Data**
   - Click on the "Tasks" tab in the right panel
   - For each export task (classification, NDVI, imagery, statistics):
     - Click the "Run" button next to the task
     - Configure the export settings if needed
     - Confirm to start the export

4. **View Results**
   - Processed data will appear in your Google Drive
   - Console outputs will display statistical information

## What You'll Get

1. **Forest/Non-Forest Classification Map**
   - Visual representation of forested vs. non-forested areas
   - Color-coded for easy interpretation

2. **Current Satellite Imagery**
   - Latest available Sentinel imagery of the area
   - High-resolution visual reference

3. **NDVI Assessment**
   - Vegetation health analysis
   - Values range from -1 to 1 (higher values indicate healthier vegetation)

4. **Statistical Data**
   - Precise area measurements in hectares
   - Breakdown of forest vs. non-forest coverage

## Technical Notes
- Analysis uses Sentinel-2 satellite imagery
- NDVI is calculated using near-infrared and red bands
- Forest classification uses a threshold-based approach
- All area calculations are in hectares (1 hectare = 10,000 m²)

For questions or issues with the script, please consult the Google Earth Engine documentation or developer forums.
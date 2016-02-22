# Change Log

22/02/16 - Longtime due an update
====================================
- Script creates a single parent folder of Hybris where all the images go
  and no longer use the product code from the origin image file. The code
  for that is commented out for future use.

18/01/16 - Refactored, added custom resizing for colorSwatch
===================================================
- Renamed colorswatch to SKU (folder_name) + colorswatch
- Created functions for image Options and unsharp mask for
  future use and cleaner code
- Indented better
- Removed resize.js and renamed to hybris-resize.jsx


14/01/16 - Added Hybris for loop and sub folder:
===================================================
- Removed Hybris loop, pushing working to master, setting up new
  dev branch
- Added Hybris loop and resizeCanvas
  


13/01/16 - Added Hybris for loop and sub folder:
===================================================
- Created Hybris for loop (b) to select only the Hybris folder and then create a
  sub folder for Hybris where we can make custom changes to the canvas size rather 
  than image size for the rest of the sub folders


08/01/16 - Re-wrote large parts of the application:
===================================================
- Added save options
- Close document once finished
- doc closed top open each file after the previous


07/01/16 - Re-wrote large parts of the application:
===================================================

- Removed if/else if/else statement to remove _v1/_v2 suffixes
- Removed .tif file suffix 
- Set top level folder name from first file.
- Split up !if statement for clarity. 
- Corrected issue where sub folders wouldn't go into the top level folder because
  the for loop wasn't correctly nested










TO DO
============

- Crop Hybris to correct width

- Marketing 3000 x 3000 x 300 DPI (ONLY DEFAULT IMAGE).

- Sliver needs to use _9 file only. 

- Sliver for Hybris needs to be renamed from _9 to _colorswatch. 


# Change Log



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
var FILE_TYPE = ".tif"; // The type of files that this script works on -- you can change
var SEARCH_MASK = "*" + FILE_TYPE; // Image file filter to find only those files

// Save current dialog preferences
var startDisplayDialogs = app.displayDialogs;
var startRulerUnits = app.preferences.rulerUnits;

// Don't display dialogs, and set the units used to be pixels
app.displayDialogs = DialogModes.NO;
app.preferences.rulerUnits = Units.PIXELS;

// Setup the array of folder names
var folders = [
  { 'name' : 'zoom',
    'width' : 1500,
    'height' : 1500
  },
  { 'name' : 'thumb',
    'width' : 90,
    'height' : 90
  },
  { 'name' : 'product',
    'width' : 480,
    'height' : 480
  },
  { 'name' : 'optional',
    'width' : 60,
    'height' : 60
  },
  { 'name' : 'medium',
    'width' : 116,
    'height' : 116
  },
  { 'name' : 'checkout_thumb',
    'width' : 70,
    'height' : 70
  },
  { 'name' : 'additional',
    'width' : 230,
    'height' : 230
  },
  { 'name' : 'marketing',
    'width' : 2000,
    'height' : 2000
  },
  { 'name' : 'sliver',
    'width' : 20,
    'height' : 20
  },
  { 'name' : 'hybris',
    'width' : 2250,
    'height' : 3000
  }
];


function compare(a,b) {
  if (a.height*a.width < b.height*b.width)
     return 1;
  if (a.height*a.width > b.height*b.width)
    return -1;
  return 0;
}

folders.sort(compare);



try {
    // Ask for folder
    var inputFolder = Folder.selectDialog("Select a folder to process (test)");
    
    // Throw an err if user is an idiot
    if (inputFolder === null) {
        throw new Error("These aren't the files we're looking for...");
    }
    
    // Make selected folder curernt
    Folder.current = inputFolder;

    // Get all files from input folder
    var fileList = inputFolder.getFiles(SEARCH_MASK);

    // Loop through all files
    for (var i = 0; i < fileList.length; i++){
        // Get file's name 
        var fileName = fileList[i].name.toUpperCase().replace(/\..+$/, '');  

        // Removes suffix and sets folder name to file name.
        var folder_name = ""
              if(fileName.indexOf('_') >= 0){
                   folder_name = fileName.toUpperCase().substring( 0, fileName.indexOf( "_" ) );
            } else {
                folder_name = fileName.toUpperCase();
            }                   
        // Create folder to contain output
        var newFolder = new Folder(folder_name);

        // If Folder doesn't exist, create it
        if(!newFolder.exists){ newFolder.create(); }

        // If folder doesn't exist despite it should have been,
        // throw error
        if(!newFolder.exists){
            throw new Error("Folder could not be created");
        } else {
            
              // Get only Hybris SubFolder
              for(var b = 0; b < folders.length -9; b++){
                
                // Create Hybris Subfolder
                var subFolder = new Folder(newFolder.toString( ) + "/" + folders[b].name);

                // Create Hybris SubFolder if it doesn't exist
                if(!subFolder.exists){ subFolder.create(); }

                // If subFolder not created, throw err
                if(!subFolder.exists){
                  throw new Error( subFolder.toString( ) + " could not be created.");
                } else {
                      var doc = open(fileList[i]);

                      if(doc == null){
                        throw new Error("Could not create folder " + subFolder.toString( ));
                      } else {
                        doc.resizeCanvas(folders[b].width, folders[b].height);
                        doc.flatten();

                        var duplicate = doc.activeLayer.duplicate();
                            duplicate.applyUnSharpMask(40,1,0);

                          // Export for web
                          var output = new File(subFolder.toString( ) + "/" + fileName.toUpperCase() + '.jpg');

                          // Create var for save Options
                          var exportOptionsSaveForWeb = new ExportOptionsSaveForWeb();

                          exportOptionsSaveForWeb.format          = SaveDocumentType.JPEG;
                          exportOptionsSaveForWeb.optimized       = false;
                          exportOptionsSaveForWeb.quality         = 60;
                          exportOptionsSaveForWeb.interlaced      = true;
                          exportOptionsSaveForWeb.includeProfile  = false;
                          exportOptionsSaveForWeb.blur            = 0;

                          // Export options with arguments
                          doc.exportDocument(output, ExportType.SAVEFORWEB, exportOptionsSaveForWeb); 

                          // Remove duplicate layer
                          duplicate.remove();
                      }
                  }
              }

              for(var j = 1; j < folders.length; j++){
                  // Create sub folder
                  var subFolder = new Folder(newFolder.toString( ) + "/" + folders[j].name);

                  // Create Sub Folder if it doesn't exist
                  if(!subFolder.exists){ subFolder.create(); }

                  // If sub folder wasn't created, throw err
                  if(!subFolder.exists){
                      throw new Error("Could not create folder " + subFolder.toString( ));
                  } else {
                      // Open document
                      var doc = open(fileList[i]);

                      // Throw err if doc is bad
                      if(doc == null){
                        throw new Error(fileName + " Failed to properly open. Try again.");
                      } else {
                          // Resize The image
                          doc.resizeImage(folders[j].width, folders[j].height);
                          doc.flatten();

                          // Add UnSharpMask
                          var duplicate = doc.activeLayer.duplicate();
                              duplicate.applyUnSharpMask(40,1,0);

                          // Export for web
                          var output = new File(subFolder.toString( ) + "/" + fileName.toUpperCase() + '.jpg');

                          // Create var for save Options
                          var exportOptionsSaveForWeb = new ExportOptionsSaveForWeb();

                          exportOptionsSaveForWeb.format          = SaveDocumentType.JPEG;
                          exportOptionsSaveForWeb.optimized       = false;
                          exportOptionsSaveForWeb.quality         = 60;
                          exportOptionsSaveForWeb.interlaced      = true;
                          exportOptionsSaveForWeb.includeProfile  = false;
                          exportOptionsSaveForWeb.blur            = 0;

                          // Export options with arguments
                          doc.exportDocument(output, ExportType.SAVEFORWEB, exportOptionsSaveForWeb); 

                          // Remove duplicate layer
                          duplicate.remove();
                      }
                  }
              }
              //Close the file outside ready to re-run loop to open the next file
              doc.close(SaveOptions.DONOTSAVECHANGES);
          } 
     }
}

catch (err) {
        // Catch them pesky errors
        alert("Houston, we've had a problem" + ": " + err.message);
}

finally {
        // Brighten users day
        alert("You're looking amazing, enjoy the day!");
        // Restore application preferences
        app.displayDialogs = startDisplayDialogs;
        app.preferences.rulerUnits = startRulerUnits;   
    }
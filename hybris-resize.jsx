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


// Flatten and add unsharp
function flattenDupe(){
  doc.flatten();
  var duplicate = doc.activeLayer.duplicate();
  duplicate.applyUnSharpMask(40,1,0);
}

// Remove Unsharp
function removeDupe () {
  var duplicate = doc.activeLayer.duplicate();
  duplicate.remove();
}

// Export Options
function exportOpts(){
  var exportOptionsSaveForWeb = new ExportOptionsSaveForWeb();

  exportOptionsSaveForWeb.format          = SaveDocumentType.JPEG;
  exportOptionsSaveForWeb.optimized       = false;
  exportOptionsSaveForWeb.quality         = 60;
  exportOptionsSaveForWeb.interlaced      = true;
  exportOptionsSaveForWeb.includeProfile  = false;
  exportOptionsSaveForWeb.blur            = 0;

  // Export options with arguments
  doc.exportDocument(output, ExportType.SAVEFORWEB, exportOptionsSaveForWeb); 
  //}
}


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
        var folder_name = "hybris";             
        // Create folder to contain output
        var newFolder = new Folder(folder_name);

        // If Folder doesn't exist, create it
        if(!newFolder.exists){ newFolder.create(); }

        // If folder doesn't exist despite it should have been,
        // throw error
        if(!newFolder.exists){
            throw new Error("Folder could not be created");
        } else {
          // Rename _9 to folder_name + colorswatch for Hybris
              if(fileName.substring(11,13) == "_9"){
                var colorSwatch = "_colourswatch";
                fileName = colorSwatch;
                //fileName.toLowerCase();
              }
              // Get only Hybris SubFolder
              for(var b = 0; b < folders.length -9; b++){
                
                // Create Hybris Subfolder
                //var subFolder = new Folder(newFolder.toString( ) + "/" + folders[b].name);

                // Create Hybris SubFolder if it doesn't exist
                //if(!subFolder.exists){ subFolder.create(); }

                // If subFolder not created, throw err
                //if(!subFolder.exists){
                  //throw new Error( subFolder.toString( ) + " could not be created.");
                //} else {
                      var doc = open(fileList[i]);

                      if(doc == null){
                          throw new Error("Could not create folder " + folder_name.toString( ));
                      } else if(fileName == colorSwatch){

                          // Resize Image
                          doc.resizeImage(35,35);
                          
                          // Flatten and add unsharp
                          flattenDupe();
                          // Set Output File name
                          var output = new File(folder_name.toString() + "/" + folder_name + colorSwatch.toLowerCase() + '.jpg');

                          // Set Export Options
                          exportOpts();

                          // Remove duplicate layer
                          removeDupe();

                      } else {
                            // Resize Canvas
                            doc.resizeCanvas(folders[b].width, folders[b].height);
                            
                            // Flatten and unsharp
                            flattenDupe();

                            // Set Output File Name
                            var output = new File(folder_name.toString( ) + "/" + fileName.toUpperCase() + '.jpg');;
                            
                            // Export Options 
                            exportOpts();

                            // Remove duplicate layer
                            removeDupe();
                      }
                  //}
              //}
              //Close the file outside ready to re-run loop to open the next file
              doc.close(SaveOptions.DONOTSAVECHANGES);
          } 
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
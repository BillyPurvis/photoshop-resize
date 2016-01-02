// File Types
var FILE_TYPE   = ".tif",
    SEARCH_MASK = "*" + FILE_TYPE;


// Set to pixels
app.preferences.rulerUnits = Units.PIXELS;

// Setup the array of folder names
var folders = [
	{	'name' : 'zoom',
		'width' : 1500,
		'height' : 1500
	},
	{	'name' : 'thumb',
		'width' : 90,
		'height' : 90
	},
	{ 	'name' : 'product',
		'width' : 480,
		'height' : 480
	},
	{	'name' : 'optional',
		'width' : 60,
		'height' : 60
	},
	{	'name' : 'medium',
		'width' : 116,
		'height' : 116
	},
	{	'name' : 'checkout_thumb',
		'width' : 70,
		'height' : 70
	},
	{	'name' : 'additional',
		'width' : 230,
		'height' : 230
	},
	{	'name' : 'marketing',
		'width' : 2000,
		'height' : 2000
	},
	{	'name' : 'sliver',
		'width' : 20,
		'height' : 20
	},
    {
        'name': 'hybris',
        'width': 2350,
        'heigh': 3000
    }
];

try {
    // Ask for folder
    var inputFolder = Folder.selectDialog("Select a folder to process (test)");
    // Throw an err if user is an idiot
    if (inputFolder === null) {
        throw "No Folder Selected";
    }
    
    // Make selected folder curernt
    Folder.current = inputFolder;

    // Get all files from input folder
    var fileList = inputFolder.getFiles(SEARCH_MASK),
        fileListLength = fileList.length;

    // Loop through all files
    for (var i = 0; i < fileListLength; i++){
        // Remove suffix
        var fileName = fileList[i].name.toLowerCase().replace(/\..+$/, '');
        
        var folderName = fileName;
        
        // Create folder from fileName 
        var newFolder = new Folder(folderName);
        
        // If folder exists, alert
        if(!newFolder.exists){ 
            newFolder.create();
        } else {
            alert("Folder " + folderName + " exists");
        }
        
        // Count through amount of imgs
        var imgCount = folders.length;
        
        // Make sub directory from folders array loop
        for( var j = 0; j < imgCount; j++){
            var subFolder = new Folder ( newFolder + "/" + folders[j].name);
            
            if (!subFolder.exists){
                subFolder.create();
            } else {
                throw "Could not create sub folder. Sub folder already exists";                
            }
            
            // Open files for Photoshop
            var document = open(fileList[i]);
            
            if (document == null){
                throw "Failed to open file, unsure why";
            } else {
                
                // Do the stuff to the files
                
                document.resizeImage(folders[j].width, folders[j].height);
                document.flatten();
                
                var dupe = document.activeLayer.duplicate();
                dupe.applyUnSharpMask(40,1,0);
                
                var outputFile = new File( subFolder + "/" + fileName + '.jpg');        
                var exportOpt = new ExportOptionsSaveForWeb();
                
                exportOpt.format = SaveDocumentType.JPEG;
                exportOpt.optimized = false;
                exportOpt.quality = 60;
                exportOpt.interlaced = true;
                exportOpt.includeProfile = false;
                exportOpt.blur = 0;
                
                // Export for web
                document.exportDocument(outputFile,ExportType.SAVEFORWEB, exportOpt);
            }
            // Brighten users day
            alert("You're looking amazing today \n Your files are done!");
            // Close File
            document.close(SaveOptions.DONOTSAVECHANGES);
        }
    }
}


    catch (exception) {
        
        // Catch them pesky errors
        alert(exception);
    }

    finally {
        // Reset preferrances
        app.preferances.rulerUnits = startRulerUnits;
    }
// Import the watching library
var watchr = require('watchr')
var path = require('path')

// Define our watching parameters
var watchPath = path.join(process.cwd(), 'scrape', 'output', 'delta');
console.log(watchPath);
function listener (changeType, fullPath, currentStat, previousStat) {
    switch ( changeType ) {
        case 'update':
            console.log('the file', fullPath, 'was updated', currentStat, previousStat)
            break
        case 'create':
            console.log('the file', fullPath, 'was created', currentStat)
	    
            break
        case 'delete':
            console.log('the file', fullPath, 'was deleted', previousStat)
            break
    }
}
function next (err) {
    if ( err )  return console.log('watch failed on', path, 'with error', err)
    console.log('watch successful on', path)
}

// Watch the path with the change listener and completion callback
var stalker = watchr.open(watchPath, listener, next)

// Close the stalker of the watcher

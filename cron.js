var exec = require('child_process').exec;
var CronJob = require('cron').CronJob;
new CronJob('* 0,20,40  * * * *', function() {
exec('casperjs regular-season.js', {
  cwd: './scrape'
}, function(error, stdout, stderr) {
	console.log('STDOUT: ' + stdout);
});

}, null, true, 'America/New_York');

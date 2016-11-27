var casper = require('casper').create({
  viewportSize: {
    width: 1280,
    height: 768
  }
});

var fs = require('fs');
var gameResults = 'tournamentResults.json';
var teamResults = 'teamResults.json';
var saveGameResults = fs.pathJoin(fs.workingDirectory, 'output', gameResults);
var saveTeamResults = fs.pathJoin(fs.workingDirectory, 'output', teamResults);
var savePickeringGameResults = fs.pathJoin(fs.workingDirectory, 'output', 'pickeringResults.json');
var saveStCatherinesGameResults = fs.pathJoin(fs.workingDirectory, 'output', 'stCatherinesResults.json');

var today = new Date();
var deltaPath = fs.pathJoin(fs.workingDirectory, 'output', 'delta', 'delta_' + today.getTime() + '.json');

var allResults = [];
var matrix = {};
var captureCompleted = false;


function readResults(filename) {
  'use strict';
  var data = [];
  if (fs.exists(filename)) {
    data = fs.read(filename);
    return JSON.parse(data);
  } else {
    return data;
  }


}



function convertSouthernNames(teamName) {
  'use strict';
  //self.echo('teamName' + teamName);
  var result = '';
  switch (teamName.trim()) {
    case 'Caledonia Lightning':
      result = 'Caledonia';
      break;
    case 'Burlington Blast':
      result = 'Burlington';
      break;
    case 'St. Catharines Comets':
      result = 'St. Catharines';
      break;
    case 'Paris -':
      result = 'Paris';
      break;
    case 'Cambridge Turbos':
      result = 'Cambridge';
      break;
    case 'Mississauga Mustangs':
      result = 'Mississauga';
      break;
    case 'Etobicoke Stingers':
      result = 'Etobicoke';
      break;
    case 'Barrie Blizzard':
      result = 'Barrie';
      break;
    case 'Richmond Hill Lightning':
      result = 'Richmond Hill';
      break;
    case 'Newmarket Rays':
      result = 'Newmarket';
      break;
    case 'Markham Bears':
      result = 'Markham';
      break;
    default:
      result = teamName;

  }

  return result;
}

function convertScoreToStatsNames(teamName) {
  'use strict';
  if (teamName.indexOf('(') > -1) {
    teamName = teamName.substring(0, teamName.indexOf('('));
  }
  teamName = teamName.trim();
  var result = '';
  switch (teamName) {
    case 'Elora-Fergus':
      result = 'Elora Fergus';
      break;
    case 'GCRA':
      result = 'Gloucester Cumberland';
      break;
    case 'Gloucester-Cumberland':
      result = 'Gloucester Cumberland';
      break;
    case 'Sault Ste. Marie':
      result = 'Sault Ste Marie';
      break;
    default:
      result = teamName;

  }

  return result;
}


function convertWoraNames(teamName) {
  'use strict';
  //self.echo('teamName' + teamName);
  var result = '';
  switch (teamName.trim()) {
    case 'Elora/Fergus':
      result = 'Elora Fergus';
      break;
    default:
      result = teamName;

  }

  return result;
}

function convertOcrrllNames(teamName) {
  'use strict';

  var result = '';
  switch (teamName.trim()) {
    case 'Whitby Wild':
      result = 'Whitby';
      break;
    case 'Richmond Hill Lightning':
      result = 'Richmond Hill'
      break;
    case 'Newmarket Rays':
      result = 'Newmarket'
      break;
    case 'Markham Bears':
      result = 'Markham'
      break;
    case 'Barrie Blizzard':
      result = 'Barrie'
      break;
    case 'Sunderland Stingerz':
      result = 'Sunderland'
      break;
    case 'Ajax Shooting Stars':
      result = 'Ajax'
      break;

    default:
      result = '';

  }

  return result;
}

function convertNcrllNames(teamName) {
  'use strict';
  //self.echo('teamName' + teamName);
  var result = '';
  switch (teamName.trim()) {
    case 'Ottawa (Wippel)':
      result = 'City of Ottawa';
      break;
    case 'Metcalfe (Burrows)':
      result = 'Metcalfe'
      break;
    case 'Arnprior (Phillips)':
      result = 'Arnprior'
      break;
    case 'Nepean (White)':
      result = 'Nepean'
      break;
    case 'West Ottawa (Moore)':
      result = 'West Ottawa'
      break;
    case 'GCRA (Maheux)':
      result = 'Gloucester Cumberland'
      break;

    default:
      result = '';

  }

  return result;
}



function getSouthernRegionResults() {
  'use strict';
  var rows = document.querySelectorAll('.league_1019.group_11913');
  var jobs = [];

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var type = 'RS';

    var gameId = row.id;
    var home = row.cells[5].innerText;
    //home = this.convertNcrllNames(home);

    var visitor = row.cells[3].innerText;
    var score = row.cells[4].innerText.split('-');
    var gameDate = row.cells[1].innerText.trim();

    if (score && score.length > 1) {
      var visitorScore = score[0];
      var homeScore = score[1];
      var job = {};
      job.type = type;
      job.gameId = gameId;
      job.home = home;
      job.homeScore = Number(homeScore);
      job.visitor = visitor;
      job.visitorScore = Number(visitorScore);
      job.association = 'Southern';
      job.gameDate = gameDate ? new Date(gameDate).toISOString() : undefined;
      jobs.push(job);
    }


  }



  return jobs;

}


function getOcrrlResults() {
  'use strict';
  var rows = document.querySelectorAll('tr.league_1020.group_11880');
  var jobs = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var type = 'RS';
    if (row.cells.length > 3) {
      var result = row.cells[4].innerText;
      if (result.indexOf('-') > -1) {
        var split = result.split('-');
        var homeSplit = split[1];
        var home = row.cells[5].innerText
        var homeScore = homeSplit.trim();


        var visitorSplit = split[0];
        var visitor = row.cells[3].innerText

        var visitorScore = visitorSplit.trim();
        var gameId = row.cells[0].innerText;

        var gameDate = row.cells[1].innerText;

        if (homeScore && visitorScore) {
          var job = {};
          job.type = type;
          job.gameId = gameId;
          job.home = home;
          job.homeScore = homeScore;
          job.visitor = visitor;
          job.visitorScore = visitorScore;
          job.association = 'Central';
          job.gameDate = gameDate ? new Date(gameDate).toISOString() : undefined;
          jobs.push(job);
        }

      }

    }






  }



  return jobs;

}

function getWesternRegionResults() {
  'use strict';
  var rows = document.querySelector('thead + tbody').children;
  var jobs = [];

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var type = 'RS';

    var gameId = row.cells[0].innerText;
    var home = row.cells[4].innerText;
    //home = this.convertNcrllNames(home);
    var homeScore = row.cells[5].innerText.trim();
    var visitor = row.cells[2].innerText;

    var visitorScore = row.cells[3].innerText.trim();
    var gameDate = row.cells[6].innerText.trim();
    if (homeScore && visitorScore) {
      var job = {};
      job.type = type;
      job.gameId = gameId;
      job.home = home;
      job.homeScore = Number(homeScore);
      job.visitor = visitor;
      job.visitorScore = Number(visitorScore);
      job.association = 'Western';
      job.gameDate = gameDate ? new Date(gameDate).toISOString() : undefined;
      jobs.push(job);
    }


  }



  return jobs;

}

function getNcrllFirstHalfResults() {
  'use strict';
  var rows = document.querySelector('h3 + table tbody').children;
  var jobs = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var type = 'RS';

    var gameId = row.cells[0].innerText;
    var home = row.cells[6].innerText;

    //home = this.convertNcrllNames(home);
    var homeScore = row.cells[7].innerText.trim();
    var visitor = row.cells[4].innerText;
    var gameDate = row.cells[1].innerText.trim();
    var visitorScore = row.cells[5].innerText.trim();
    if (homeScore && visitorScore) {
      var job = {};
      job.type = type;
      job.gameId = gameId;
      job.home = home;
      job.homeScore = Number(homeScore);
      job.visitor = visitor;
      job.visitorScore = Number(visitorScore);
      job.association = 'Eastern';
      job.gameDate = gameDate ? new Date(gameDate).toISOString() : undefined;
      jobs.push(job);
    }


  }



  return jobs;
}

function getPickeringResults() {
  'use strict';
  var rows = document.querySelectorAll('.pnlGame.division_1262');
  var jobs = [];

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var type = 'RR';
    var status = 'Official';
    if ((type === 'RR' || type === 'SRR') && status === 'Official') {
      var result = row.cells[4].innerText.split('-');
      var home = row.cells[5].innerText;
      var homeScore = result[1];
      var visitor = row.cells[3].innerText;

      var visitorScore = result[0];

      var job = {};
      job.type = type;
      job.gameId = 'pickering' + row.cells[0].innerText.trim();
      job.home = home;
      job.homeScore = homeScore;
      job.visitor = visitor;
      job.visitorScore = visitorScore;
      job.tournament = 'Pickering';
      job.gameDate = new Date('Dec 4 2015').toISOString();
      jobs.push(job);

    }

  }

  return jobs;

}

function getResults(tournament) {
  'use strict';
  var rows = document.querySelectorAll('table#MainContent_GridViewSchedule tr');
  var jobs = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var type = row.cells[1].innerText;
    var status = row.cells[9].innerText;
    if (status === 'Official') {
      var homeCell = row.cells[7];
      var home = homeCell.querySelector('a').innerText;

      var homeScore = row.cells[8].innerText;
      var visitorCell = row.cells[5];
      var visitor = visitorCell.querySelector('a').innerText;



      var visitorScore = row.cells[6].innerText;
      var gameDate = row.cells[2].innerText.trim() + ' ' + tournament.year;

      var job = {};
      job.type = type;
      job.gameId = tournament.name + row.cells[0].innerText.trim();
      job.home = home;
      job.homeScore = homeScore;
      job.visitor = visitor;
      job.visitorScore = visitorScore;
      job.tournament = tournament.name;
      job.division = 'U14A';
      job.gameDate = gameDate ? new Date(gameDate).toISOString() : undefined;
      jobs.push(job);

    }

  }

  return jobs;
}

var IS_COMPLETE_DEFAULT=true;

var tournaments = [{
    url: 'http://www.score2stats.com/s2s_new/user/Schedules.aspx?eu=185&du=1930&pool=+&dn=18++A++++++++++++++++++++&yu=11',
    name: 'Oshawa',
    complete: IS_COMPLETE_DEFAULT,
    year: 2016
  }, {
    url: 'http://www.score2stats.com/s2s_new/user/Schedules.aspx?eu=187&du=1962&pool=+&dn=18++A++++++++++++++++++++&yu=11',
    name: 'London & Dorchester',
    complete: IS_COMPLETE_DEFAULT,
    year: 2016
  },{
    url: 'http://www.score2stats.com/s2s_new/User/Schedules.aspx?eu=186&du=1944&pool=All+Pools&dn=&yu=11',
    name: 'Nepean',
    complete: IS_COMPLETE_DEFAULT,
    year: 2016
  },
  {
    url: 'http://www.score2stats.com/s2s_new/User/Schedules.aspx?eu=189&du=1976&pool=All+Pools&dn=&yu=11',
    name: 'Arnprior',
    complete: false,
    year: 2016
  },
  {
    url: 'http://www.score2stats.com/s2s_new/User/Schedules.aspx?eu=191&du=1997&pool=All+Pools&dn=&yu=11,',
    name: 'St Marys',
    complete: false,
    year: 2016
  }






];

var associations = [{
    name: 'Eastern',
    urls: ['http://montreal.sibername.com/~errancrr/game_schedule.pl?Sched%201h%20U14%20A',
      'http://montreal.sibername.com/~errancrr/game_schedule.pl?Sched%202h%20U14%20A'
    ],
    parse: getNcrllFirstHalfResults,
    convert: convertNcrllNames,
    output: fs.pathJoin(fs.workingDirectory, 'output', 'ncrllResults.json'),
    deltaOutput: fs.pathJoin(fs.workingDirectory, 'output', 'ncrllResults_' + today.getTime() + '.json'),
    division: 'U14A'

  }, {
    name: 'Western',
    urls: ['http://www.wrra.ca/alweb/Tweens_11.php'],
    parse: getWesternRegionResults,
    convert: convertWoraNames,
    output: fs.pathJoin(fs.workingDirectory, 'output', 'woraResults.json'),
    deltaOutput: fs.pathJoin(fs.workingDirectory, 'output', 'woraResults_' + today.getTime() + '.json'),
    division: 'U14A'

  }, {
    name: 'Central',
    urls: ['http://centralregionringette.ca/Groups/1013/Schedule/'],
    parse: getOcrrlResults,
    convert: convertOcrrllNames,
    output: fs.pathJoin(fs.workingDirectory, 'output', 'ocrrlResults.json'),
    deltaOutput: fs.pathJoin(fs.workingDirectory, 'output', 'ocrrlResults_' + today.getTime() + '.json'),
    division: 'U14A'

  }, {
    name: 'Southern',
    urls: ['http://southernregionringette.ca/Groups/1028/Schedule/'],
    parse: getSouthernRegionResults,
    convert: convertSouthernNames,
    output: fs.pathJoin(fs.workingDirectory, 'output', 'southernResults.json'),
    deltaOutput: fs.pathJoin(fs.workingDirectory, 'output', 'southernResults_' + today.getTime() + '.json'),
    division: 'U14A'
  }

];
var myDelta = [];
casper.on('remote.message', function(msg) {
  this.echo('remote: ' + msg);
})
casper.start().then(function() {
  'use strict';
  if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
      if (this === null) {
        throw new TypeError('Array.prototype.findIndex called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return i;
        }
      }
      return -1;
    };
  }


  tournaments.forEach(function(tournament) {
    if (captureCompleted || !tournament.complete) {
      this.echo(tournament.url);
      casper.thenOpen(tournament.url);
      casper.then(function() {
        this.echo(this.getTitle());

      });


      casper.waitForSelector('select[name="ctl00$DropDownListDivisions"]', function() {
        this.captureSelector('screenshot/' + tournament.name + '.png', 'html');
      });



      casper.then(function() {
        this.captureSelector('screenshot/' + tournament.name + '_selected.png', 'html');
        var jobs = this.evaluate(getResults, tournament);
        jobs.forEach(function(game) {
          game.tournament = tournament.name;
          game.homeId = convertScoreToStatsNames(game.home);
          game.visitorId = convertScoreToStatsNames(game.visitor);
        });
        allResults = allResults.concat(jobs);
        console.log(JSON.stringify(jobs, null, 4));
      });

    }


  }, this);

  casper.then(function() {
    'use strict';
    var oldResults = readResults(saveGameResults);
    var delta = allResults.filter(function(elm) {
      var oldIndex = oldResults.findIndex(function(oldElem) {
        return elm.gameId === oldElem.gameId;
      });
      return oldIndex === -1;
    });

    myDelta = myDelta.concat(delta);

    //fs.write(saveStCatherinesGameResults, JSON.stringify(jobs, null, 4), 'w');
    fs.write(saveGameResults, JSON.stringify(allResults, null, 4), 'w');

  });

  associations.forEach(function(association) {
    this.echo('parsing association ' + association.name);
    var myResults = [];
    casper.then(function() {
      association.urls.forEach(function(url) {
        casper.thenOpen(url);
        casper.then(function() {
          this.echo('scraping ' + association.name + ' regular season results');
          this.captureSelector('screenshot/' + association.name + '.png', 'html');
        });

        casper.then(function() {

          var associationGames = this.evaluate(association.parse);

          associationGames.forEach(function(game) {
            if (association.convert) {
              game.homeId = association.convert(game.home);

              game.visitorId = association.convert(game.visitor);

            } else {
              game.homeId = game.home;

              game.visitorId = game.visitor;
            }
            game.association = association.name;
            game.division = association.division;
            var gameIndex = myResults.findIndex(function(element) {
              return element.gameId === game.gameId;
            });
            if (gameIndex === -1) {
              myResults.push(game);
            }
          });



        });

      }, this);

    });

    casper.then(function() {

      var oldResults = readResults(association.output);
      var delta = myResults.filter(function(elm) {
        var oldIndex = oldResults.findIndex(function(oldElem) {
          return elm.gameId === oldElem.gameId;
        });
        return oldIndex === -1;
      });

      myDelta = myDelta.concat(delta);
      allResults = allResults.concat(myResults);

      fs.write(association.output, JSON.stringify(myResults, null, 4), 'w');


      //fs.write(association.deltaOutput, JSON.stringify(delta, null, 4), 'w');
    });





  }, this);



});









casper.then(function() {
  'use strict';


  if (myDelta.length > 0) {
    fs.write(deltaPath, JSON.stringify(myDelta, null, 4), 'w');

  } else {
    console.log('No new results found.');
  }




});




casper.run();

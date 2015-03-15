var express = require('express');
var path    = require('path');
var favicon = require('static-favicon');
var logger  = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var File = require('File');
// var FileReader = require('FileReader');



var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var routes = require('./routes/index')(io);
var users = require('./routes/users');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCrossDomain);

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err     = new Error('Not Found');
    err.status  = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if ( app.get('env') === 'development' ) {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var userData = {
    name: "",
    flightNum: "",
    declineNum: 0,
    reports: []
};

io.on('connection', function(socket) {
    socket.emit('connection started', "Connection started successfully.");
    socket.on('connection confirmed', function (data) {
        userData.name       = data.name;
        userData.flightNum  = (data.flightNum === "") ? (socket.emit("no flight num", "")) : data.flightNum;
    });
    socket.on('report', function (report) {
        var user = {
            deviceId: 1,
            name: "Lu Bili",
            flight: {
              flightNo: "EK01",
              flightTime: "2015-04-23T13:00:00.000+08:00"
            },
            location: {
              lat: 25.244515300668223,
              long: 55.37045352788945,
              floor: 1
            },
            boardingGate: 'A1',
            status: 'idle',
            statusTime: 12
        };
        

        console.log('report sent');
        userData.reports.push(report);
        sendOffer(socket, report);
    });
    
    socket.on('register', function (req) {
        socket.emit('register user', '');
    });

    socket.on('offer decision', function (offer) {
        if (offer.hasAccepted) {
            // voucher
            userData.declineNum = -1;
            sendVoucher(socket, offer.id);
        } else {
            userData.declineNum++;
            sendRejectConfirmation(socket);
        }
    });
    socket.on('send alert', function (offer) {
        socket.emit('late person');
    });

    socket.on('request all users', function(req) {
        var userCollection = [{
            deviceId: 2,
            name: "Adola Fazli",
            flight: {
              flightNo: "EK02",
              flightTime: "2015-03-15T13:00:00.000+08:00"
            },
            location: {
              lat: 25.24282729711983,
              long: 55.37245461207174,
              floor: 1
            },
            boardingGate: 'A1',
            status: 'agent',
            statusTime: 23
          },
          {
            deviceId: 3,
            name: "Mrunal Kumar",
            flight: {
              flightNo: "EK03",
              flightTime: "2015-03-15T13:00:00.000+08:00"
            },
            location: {
              lat: 25.243092514556807,
              long: 55.37219699963714,
              floor: 1
            },
            boardingGate: 'A1',
            status: 'alert',
            statusTime: 10
          },
          {
            deviceId: 4,
            name: "Spongebob Squarepants",
            flight: {
              flightNo: "EK03",
              flightTime: "2015-03-15T13:00:00.000+08:00"
            },
            location: {
              lat: 25.243192514556807,
              long: 55.37129699963714,
              floor: 1
            },
            boardingGate: 'A1',
            status: 'agent',
            statusTime: 10
          },
          {
            deviceId: 5,
            name: "Patrick Star",
            flight: {
              flightNo: "EK03",
              flightTime: "2015-03-15T13:00:00.000+08:00"
            },
            location: {
              lat: 25.243192514556807,
              long: 55.37209699963714,
              floor: 1
            },
            boardingGate: 'A1',
            status: 'alert',
            statusTime: 10
          },
          {
            deviceId: 6,
            name: "Chuck Norris",
            flight: {
              flightNo: "EK03",
              flightTime: "2015-03-15T13:00:00.000+08:00"
            },
            location: {
              lat: 25.242902514556807,
              long: 55.37229699963714,
              floor: 1
            },
            boardingGate: 'A1',
            status: 'alert',
            statusTime: 10
          },
          {
            deviceId: 7,
            name: "Justin Bieber",
            flight: {
              flightNo: "EK03",
              flightTime: "2015-03-15T13:00:00.000+08:00"
            },
            location: {
              lat: 25.243122514556807,
              long: 55.37239699963714,
              floor: 1
            },
            boardingGate: 'A1',
            status: 'agent',
            statusTime: 10
          },
          {
            deviceId: 8,
            name: "Bill Gates",
            flight: {
              flightNo: "EK03",
              flightTime: "2015-03-15T13:00:00.000+08:00"
            },
            location: {
              lat: 25.243392514556807,
              long: 55.37209699963714,
              floor: 1
            },
            boardingGate: 'A1',
            status: 'idle',
            statusTime: 10
          },
          {
            deviceId: 9,
            name: "Ryan Gosling",
            flight: {
              flightNo: "EK03",
              flightTime: "2015-03-15T13:00:00.000+08:00"
            },
            location: {
              lat: 25.243302514556807,
              long: 55.37330699963714,
              floor: 1
            },
            boardingGate: 'A1',
            status: 'idle',
            statusTime: 10
          },
          {
            deviceId: 10,
            name: "Steve Jobs",
            flight: {
              flightNo: "EK03",
              flightTime: "2015-03-15T13:00:00.000+08:00"
            },
            location: {
              lat: 25.243202514556807,
              long: 55.37219699963714,
              floor: 1
            },
            boardingGate: 'A1',
            status: 'alert',
            statusTime: 10
          },
          {
            deviceId: 11,
            name: "Mr Pringles",
            flight: {
              flightNo: "EK03",
              flightTime: "2015-03-15T13:00:00.000+08:00"
            },
            location: {
              lat: 25.243292514556807,
              long: 55.37239699963714,
              floor: 1
            },
            boardingGate: 'A1',
            status: 'alert',
            statusTime: 10
          },
          {
            deviceId: 11,
            name: "LeBron James",
            flight: {
              flightNo: "EK03",
              flightTime: "2015-03-15T13:00:00.000+08:00"
            },
            location: {
              lat: 25.243392514556807,
              long: 55.37219699963714,
              floor: 1
            },
            boardingGate: 'A1',
            status: 'idle',
            statusTime: 10
          }];
        socket.emit('all users', userCollection);
    });
});

// Listen on port
var port = Number(process.env.PORT || 3000);
server.listen(port, function() {
    console.log('Socket listening on port ' + port + '...');
});

// Alerts the user that he/she is late for the flight
// app.get('/alert', function(req, res) {
//     console.log("sending alert");
//     res.send({
//         status: true
//     });
//     socket.emit("late person");
// });

/*
// Returns the idlers 
app.get('/idlers', function(req, res) {
  res.send({
    users: [
      {
        deviceId: 1,
        name: "Lu Bili",
        flight: {
          flightNo: "EK01",
          flightTime: "2015-04-23T20:00:00.000+08:00"
        },
        location: {
          lat: 25.244515300668223,
          long: 55.37045352788945,
          floor: 1
        },
        boardingGate: 'A1',
        status: 'agent',
        statusTime: 12
      },
      {
        deviceId: 2,
        name: "Adola Fazli",
        flight: {
          flightNo: "EK02",
          flightTime: "2015-04-23T20:00:00.000+08:00"
        },
        location: {
          lat: 25.24282729711983,
          long: 55.37245461207174,
          floor: 1
        },
        boardingGate: 'A1',
        status: 'idle',
        statusTime: 23
      },
      {
        deviceId: 3,
        name: "Mrunal Kumar",
        flight: {
          flightNo: "EK03",
          flightTime: "2015-04-23T20:00:00.000+08:00"
        },
        location: {
          lat: 25.243092514556807,
          long: 55.37219699963714,
          floor: 1
        },
        boardingGate: 'A1',
        status: 'alert',
        statusTime: 10
      }
    ],
    requestTime: "2015-04-23T20:00:00.000+08:00"
  });
});
*/

/**
* Helper functions
*/
function setAlarm(socket) {
    // TODO: Set hour and minutes
    // var flightTime = getFlightTime(userData.flightNum);
    // socket.emit('SET_ALARM', flightTime);
}

function getFlightTime(flightNum) {
    // TODO: use api to find time of departure
    /*
    var hour    = 0;
    var minute  = 0;

    return {
        "hour": hour,
        "minute": minute
    };
    */
}

function sendOffer(socket, report) {
    var offer = 'burgerking';
    
    socket.emit('send offer', offer);
}

function sendVoucher(socket, offerID) {
    /*
    var voucherID = getVoucher(offerID);
    socket.emit('OFFER_VOUCHER', voucherID);
    */
}

function sendRejectConfirmation(socket) {
    // socket.emit('REJECT_CONFIRMED', "");
}

module.exports = app;

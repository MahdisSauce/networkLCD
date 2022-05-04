var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
const Lcd = require('lcd');
const lcd = new Lcd({rs: 17, e: 27, data: [22, 10, 9, 11], cols: 16, rows: 2});

http.listen(8080); //listen to port 8080

function handler (req, res) { //create server
  fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });}

  lcd.on('ready', _ => {
    io.sockets.on('connection', function (socket) {
      socket.on('sauce', function(data) {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print(data.substring(0, 16), err => {
          if (err) {
            throw err;
          }
      lcd.setCursor(0, 1);
      lcd.print(data.substring(16), err => {
          if (err) {
            throw err;
          }
          });
        });
      });
    });
  });
  
  
process.on('SIGINT', _ => {
  lcd.close();
  process.exit();
});
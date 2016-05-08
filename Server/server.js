"use strict";
var Server = {
  clients: [], 
	tickRate: 100,
	init: function() {
		s.loop = setInterval(s.tick, (1000 / s.tickRate))
		s.WebSocketServer = require('websocket').server
		s.http =  require("http") 
		s.server = s.http.createServer(function(res, req){}).listen(7664)
		s.wsServer = new s.WebSocketServer({
			httpServer: s.server,
			autoAcceptcons: false
		})
		s.wsServer.on('request', function(r) {
			var con = r.accept('echo-protocol', r.origin)
			s.clients.push(con)
			con.keys = {
				w: false,
				s: false
			}
			con.y = 260
			con.on('message', function(message) {
				var m = JSON.parse(message.utf8Data)
        m.type = m.type.toLowerCase()
        console.log("Got Message: (" + m.data + " :: " + m.type + ")")
				var typeFunc = {
					connect: function(data, con){
						if(s.nameValid(data)){
						  con.name = data
						  s.send(con, "Connected", con.name)
						  s.updateLobby()
						}
						else{
						  s.send(con, "FatalError", "Your Username was invalid!")
						}
					},
					pass: function(forwardMessage, con){
						s.clients.forEach(function(a){
              if(a.name == con.pair){
                s.send(a, forwardMessage.type, forwardMessage.data)
              }
						})
					},
					pair: function(data, con){
            //Set sender's pair to their new pair
						con.pair = data
            //Set the new pair's pair to the sender
            s.clients.forEach(function(a){if(a.name == data){a.pair = con.name}})
					},
					key: function(data, con) {
						con.keys[data[0]] = data[1]
						console.log(con.keys)
					}
				}
				if (typeFunc[m.type]) {
					typeFunc[m.type](m.data, con)
				}
			})
			con.on('close', function(r, desc) {
				for (var i in s.clients) {
					if (s.clients[i] == con) {
						s.clients.splice(i, 1)
						s.updateLobby()
					}
				}
			})
		})
	},
	sendAll: function(t, m) {
		s.clients.forEach(function(a){
			a.sendUTF(JSON.stringify({type : t, data : m}))
		})
	},
	send: function(c, t, m) {
    console.log("Sending message: (" + m + " :: " + t + ") to client " + c.name)
  	c.sendUTF(JSON.stringify({type : t, data : m}))
	},
	updateLobby: function(){
		s.sendAll("lobby", s.clients.map(function(a){return a.name}))
	},
	nameValid: function(name) {
    // indexOf == -1 means not found
    return s.clients.indexOf(name) == -1 && name.length < 26
	},
	tick: function() {
		s.clients.forEach(function(a){
			if (a.keys.w && !a.keys.s && a.y > 0) {
				a.y--
				console.log(a.y)
			}
			if (!a.keys.w && a.keys.s && a.y < 520) {
				a.y++
				console.log(a.y)
			}
		})
	}
}

function decode(string) {
	r = ""
	for (var i in string) {
		r += (string.charAt(i) == "+" ? " " : string.charAt(i))
	}
	return decodeURIComponent(r)
}

var s = Server

s.init()

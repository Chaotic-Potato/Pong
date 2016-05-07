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
			con.on('message', function(message) {
				var m = JSON.parse(message.utf8Data)
				var typeFunc = {
					connect: function(data, con){
						if(s.nameValid(data)){
						  con.name = data
						  s.send(con, "connected", con.name)
						  s.updateLobby()
						}
						else{
						  s.send(con, "fatalError", "Your Username was invalid!")
						}
					},
					pass: function(data, con){
						for(i in s.clients){
						if(s.clients[i].name == con.pair){
							s.send(s.clients[i], "pairMessage", data)
						}
						}
					},
					pair: function(data, con){
						con.pair = data
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
		for (var x in s.clients){
			s.clients[x].sendUTF(JSON.stringify({type : t, data : m}))
		}
	},
	send: function(c, t, m) {
  	c.sendUTF(JSON.stringify({type : t, data : m}))
	},
	updateLobby: function(){
		s.sendAll("lobby", s.clients)
	},
	nameValid: function(name) {
		for (var i in s.clients) {
			if (s.clients[i].name == name || name.length > 25) {
				return false
			}
		}
		return true
	},
	tick: function() {}
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

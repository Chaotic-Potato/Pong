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
			con.on('message', function(message) {
				var m = JSON.parse(message.utf8Data)
				typeFunc = {
					
				}
				if (typeFunc[m.type]) {
					typeFunc[m.type](m.data, con)
				}
			})
			con.on('close', function(r, desc) {
				for (i in s.clients) {
					if (s.clients[i] == con) {
						s.send("disconnect", s.clients[i].name)
						s.clients.splice(i, 1)
					}
				}
				
			})
		})
	},
	send: function(t, m) {
		for (x in s.clients){
			s.clients[x].sendUTF(JSON.stringify({type : t, data : m}))
		}
	},
	tick: function() {}
}

function decode(string) {
	r = ""
	for (i in string) {
		r += (string.charAt(i) == "+" ? " " : string.charAt(i))
	}
	return decodeURIComponent(r)
}

var s = Server

s.init()

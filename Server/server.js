"use strict";
var Server = {
	clients: [], 
	tickRate: 100,
	init: function() {
		s.loop = setInterval(s.tick, (1000 / s.tickRate))
		s.WebSocketServer = require('websocket').server
		s.http = require("http") 
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
					pass: function(data, con){
            var forwardMessage = {}
            forwardMessage.data = data.data
            forwardMessage.type = data.type
						s.clients.forEach(function(a){
							if(a.name == con.pair){
								s.send(a, "pairMessage", forwardMessage)
							}
						})
					},
					pair: function(data, con){
						var partner = s.getPlayer(data)
						if(partner && !partner.pair && con.name != partner.name){
							//Set sender's pair to their new pair
							con.pair = partner.name
							//Set the new pair's pair to the sender
							partner.pair = con.name 
							s.send(partner,"paired",con.name)
							s.send(con,"paired",partner.name)
              s.updateLobby()
						}
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
		s.sendAll("lobby", s.clients.filter(function(a){return a.pair == undefined}).map(function(a){return a.name}))
	},
	nameValid: function(name) {
		return !s.getPlayer(name) && name.length > 0 && name.length < 26
	},
	getPlayer: function(name){
		for(var i in s.clients){
			if(s.clients[i].name == name){
				return s.clients[i]
			}
		}
		return null
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

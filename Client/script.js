"use strict";

var Client = {
	tickRate: 100,
	connect: function() {
		c.loop = setInterval(c.tick, (1000 / c.tickRate))
		if (c.sock == undefined){
			c.sock = new WebSocket("ws://potatobox.no-ip.info:7664", 'echo-protocol')
			c.sock.onmessage = function (evt) { 
				var m = JSON.parse(evt.data)
				typeFunc = {
					
				}
				if (typeFunc[m.type] != undefined) {
					typeFunc[m.type](m.data)
				}
			}
			c.sock.onopen = function() {
				c.send("init", c.name)
			}
			c.sock.onclose = function() { 
				alert("Disconnected from Server")
			}
		}
	},
	send: function(t, m) {
		c.sock.send(JSON.stringify({type : t, data : m}))
	},
	tick: function() { }
}
var c = Client

var get = function(id) {return document.getElementById(id)}

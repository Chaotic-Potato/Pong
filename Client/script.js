"use strict";

var Client = {
	tickRate: 100,
	y: 260,
	connect: function() {
		if (c.sock == undefined){
			c.loop = setInterval(c.tick, (1000 / c.tickRate))
			c.sock = new WebSocket("ws://potatobox.no-ip.info:7664", 'echo-protocol')
			c.name = get("name").value
			get("connect").style.visibility = "hidden"
			get("canvas").style.visibility = "visible"
			c.sock.onmessage = function (evt) { 
				var m = JSON.parse(evt.data)
				typeFunc = {
					
				}
				if (typeFunc[m.type]) {
					typeFunc[m.type](m.data)
				}
			}
			c.sock.onopen = function() {
				c.send("connect", c.name)
			}
			c.sock.onclose = function() { 
				alert("Disconnected from Server")
			}
		}
	},
	send: function(t, m) {
		c.sock.send(JSON.stringify({type : t, data : m}))
	},
	tick: function() {
		r.tick()
	}
}

var Render = {
	cvs: document.getElementById("canvas"),
	ctx: document.getElementById("canvas").getContext("2d"),
	tick: function() {
		r.ctx.clearRect(0, 0, 1280, 720)
		r.ctx.fillStyle = "white"
		r.ctx.fillRect(100, c.y, 50, 200)
	}
}

var c = Client
var r = Render

var get = function(id) {return document.getElementById(id)}

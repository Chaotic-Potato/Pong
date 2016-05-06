var Client = {
	tickRate: 100,
	y: 0,
	connect: function() {
		c.loop = setInterval(c.tick, (1000 / c.tickRate))
		if (c.sock == undefined){
			c.sock = new WebSocket("ws://potatobox.no-ip.info:7664", 'echo-protocol')
			c.name = get("name")
			c.sock.onmessage = function (evt) { 
				var m = JSON.parse(evt.data)
				typeFunc = {
					
				}
				if (typeFunc[m.type] != undefined) {
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
	}
}

var Render = {
	cvs: document.getElementById("canvas"),
	ctx: document.getElementById("canvas").getContext("2d")
	tick: function() {
		r.context.clearRect(0, 0, r.canvas.width, r.canvas.height)
	}
}

var c = Client
var r = Render

var get = function(id) {return document.getElementById(id)}
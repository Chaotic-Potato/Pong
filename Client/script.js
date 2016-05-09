var Client = {
	tickRate: 100,
	y: 260,
	lobby: [],
	keys: {
		w : false,
		s : false
	},
	connect: function(master) {
		if (c.sock == undefined){
			c.loop = setInterval(c.tick, (1000 / c.tickRate))
			c.sock = new WebSocket("ws://" + master + ":7664", 'echo-protocol')
			c.name = get("name").value
			get("connect").style.visibility = "hidden"
			get("canvas").style.visibility = "visible"
			c.sock.onmessage = function (evt) { 
				var m = JSON.parse(evt.data)
				console.log("Got Message: " + m.data + " with type " + m.type)
				var typeFunc = {
					lobby: function(data) {
						c.lobby = data
					}
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
	},
	keyDown: function(evt) {
		var key = String.fromCharCode(evt.keyCode).toLowerCase()
		if (c.keys[key] != undefined) {
			if (!c.keys[key]) {
				c.keys[key] = true
				c.send("key", [key, true])
			}
		}

	},
	keyUp: function(evt) {
		var key = String.fromCharCode(evt.keyCode).toLowerCase()
		if (c.keys[key] != undefined) {
			if (c.keys[key]) {
				c.keys[key] = false
				c.send("key", [key, false])
			}
		}

	},
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

document.onkeydown = c.keyDown
document.onkeyup = c.keyUp

var get = function(id) {return document.getElementById(id)}

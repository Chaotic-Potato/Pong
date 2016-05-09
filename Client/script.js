var Client = {
	pair: {y:260, name: ""},
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
				m.type = m.type.toLowerCase()
				console.log("Got Message: (" + m.data + " :: " + m.type + ")")
				var typeFunc = {
					fatalerror: function(data){
						alert(data)
						setTimeout(location.reload(true), 3000)
					},
					move: function(data){
						c.pair.y = data
					},
					lobby: function(data){
						var lobbyList = document.getElementById("lobby")
						lobbyList.innerHTML = ""
						data.forEach(function(a){
							var newelem = document.createElement("li")
							newelem.innerHTML = "<button onclick = \"c.pair('" + a + "')\">" + a + "</button>"
							lobbyList.appendChild(newelem)
						})
					},
					paired: function(data){
						c.move(c.y)
						document.getElementById("lobby").style.visibility = "hidden"
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
		console.log("Sending Message: (" + m + " :: " + t + ")")
		c.sock.send(JSON.stringify({type : t, data : m}))
	},
	//Nest an extra layer when we pass
	pairSend: function(t, m) {
		c.send("pass", {type: t, data: m})
	},
	tick: function() {
		r.tick()
		c.processMove()
	},
	processMove: function(){
		if(c.keys.w && !c.keys.s){c.move(c.y - 3)}
		if(!c.keys.w && c.keys.s){c.move(c.y + 3)}
	},
	keyDown: function(evt) {
		var key = String.fromCharCode(evt.keyCode).toLowerCase()
		if (c.keys[key] === false) {c.keys[key] = true}
	},
	keyUp: function(evt) {
		var key = String.fromCharCode(evt.keyCode).toLowerCase()
		if (c.keys[key] === true) {c.keys[key] = false}
	},
	move: function(newy){
		c.pairSend("move", newy)
		c.y = newy
	},
	pair: function(name){
		c.send('pair',name)
		c.move(c.y)//Update initial position
		document.getElementById("lobby").style.visibility = "hidden"
	}
}

var Render = {
	cvs: document.getElementById("canvas"),
	ctx: document.getElementById("canvas").getContext("2d"),
	tick: function() {
		r.ctx.clearRect(0, 0, 1280, 720)
		r.ctx.fillStyle = "white"
		r.ctx.fillRect(100, c.y, 50, 200)
		r.ctx.fillRect(1180, c.pair.y, 50, 200)
	}
}

var c = Client
var r = Render

document.onkeydown = c.keyDown
document.onkeyup = c.keyUp

var get = function(id) {return document.getElementById(id)}

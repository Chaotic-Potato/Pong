var Client = {
	pair: {y:260, name: ""},
  ball: {x: 615, y: 335, angle: 0},
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
			get("connectContainer").style.visibility = "hidden"
			get("game").style.visibility = "visible"
			get("lobby").style.visibility = "visible"
			c.sock.onmessage = function (evt) { 
				var m = JSON.parse(evt.data)
				m.type = m.type.toLowerCase()
				console.log("Got Message: (" + m.data + " :: " + m.type + ")")
				var typeFunc = {
					fatalerror: function(data){
						alert(data)
						setTimeout(location.reload(true), 3000)
					},
          pairmessage: function(data){
            var actions = {
              move: function(data){c.pair.y = data},
              ball: function(data){
                ball.y     = data.newball.y
                ball.x     = data.newball.x
                ball.angle = data.newball.angle
                if(data.type = "hit"){
                  //Play sound
                }
              }
            }
            actions[data.type](data.data)
          },
					lobby: function(data){
						var lobbyList = document.getElementById("lobby")
						lobbyList.innerHTML = "<span>PLAYERS</span>"
						data.forEach(function(a){
							if (a != c.name) {
								var newelem = document.createElement("li")
								newelem.innerHTML = "<button onclick = \"c.pairMessage('" + a + "')\">" + a + "</button>"
								lobbyList.appendChild(newelem)
							}
						})
					},
					paired: function(data){
						c.move(c.y)
						document.getElementById("lobby").style.visibility = "hidden"
					}
				}
				if (typeFunc[m.type]) {typeFunc[m.type](m.data)}
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
		c.moveBall()
		r.tick()
		c.processMove()
		c.moveBall()
	},
	processMove: function(){
		if(c.keys.w && !c.keys.s && c.y > 2){c.move(c.y - 3)}
		if(!c.keys.w && c.keys.s && c.y < 518){c.move(c.y + 3)}
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
	pairMessage: function(name){
		c.send('pair',name)
		c.move(c.y)//Update initial position
	},
	moveBall: function() {
		if (c.ball.y < 1 || c.ball.y > 669) {
			c.ball.angle = (360 - c.ball.angle)
		}
		c.ball.x += Math.cos(c.ball.angle / 180 * Math.PI)
		c.ball.y -= Math.sin(c.ball.angle / 180 * Math.PI)
    //TODO: Check for ball hit
    //if(c.ball.x < something && c.ball.y < c.y + something2 && c.ball.y > c.y - something3 && c.ball.angle < 270 && c.ball.angle > 90){
    //  
    //  Invert angle
    //  c.ball.angle = something(based on where it hit)
    //
    //  Update other client on hit
    //  c.send("ball", {type: "hit", newball: c.ball})
    //
    //  Play a sound
    //}
	}
}

var Render = {
	cvs: document.getElementById("canvas"),
	ctx: document.getElementById("canvas").getContext("2d"),
	tick: function() {
		r.ctx.clearRect(0, 0, 1280, 720)
		r.ctx.fillStyle = "white"
		r.ctx.fillRect(100, c.y, 50, 200)
		r.ctx.fillRect(1130, c.pair.y, 50, 200)
		r.ctx.fillRect(c.ball.x, c.ball.y, 50, 50)
	}
}

var c = Client
var r = Render

document.onkeydown = c.keyDown
document.onkeyup = c.keyUp

var get = function(id) {return document.getElementById(id)}

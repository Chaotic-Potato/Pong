#API Messages

##Client -> Server
- Connect
  - Send when connecting to the server
  - Data is the user's selected name
- Pass
  - Pass message to paired client
  - Data is message
- Pair
  - Pair the client that sent the message with the client in the data of the message

##Server -> Client
- Lobby
  - Send to update client's players in lobby list
  - Data is list of player names
- FatalError
  - Reports fatal error, and tells client to disconnect
  - The server closes the connection after sending this
  - Data is user-presentable string telling what went wrong
- Paired
  - Sent when you get chosen by someone else as their pair
  - Do NOT send pair message back or you will infinitely loop

##Client -> Client
- Move
  - Client has moved to a new y-value
  - Data is new y-value

#API Messages

##Client -> Server
- Init
  - Send when connecting to the server
  - Data is the user's selected name
- Move
  - Send when the user moves the paddle
  - Data is the new y position as percentage

##Server -> Client
- Connect
  - Pong for Init
  - Data is the user's name given in Init
- FatalError
  - Reports fatal error, and tells client to disconnect
  - The server closes the connection after sending this
  - Data is user-presentable string telling what went wrong

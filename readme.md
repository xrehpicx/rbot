# Simpler mineflyer bot

## api references

## Bot(options)
options : Object

properties:
- name(required): name of the bot
- password: password for the bot login (not needed on cracked servers)
- host(required): hostname or ip of server
- port: server port
- onspawn: callback function that runs when bot spawns
- onmessage: callback function that runs when anyone messages in global chat
- onend: callback function that runs when bot leaves the server

## example:
first install simpler-minecraft-bot by

    npm i simpler-minecraft-bot
```
const Bot = require('simpler-minecraft-bot')

const mybot = Bot({
    name: 'rbot',
    host: 'abc.aternos.me',
    port: '25555',
    onspawn: () => console.log('bot has spawned')
    onmessage: (username, message) => console.log(username+" messaged: "+message)
    onend: (reason) => console.log('bot left server due to:'+reason)
})
```
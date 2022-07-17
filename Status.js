const { Battlefield } = require ("./src/Battlefield")
const { Client, Intents } = require ("discord.js")
const fs = require ('fs')

var Config = JSON.parse(fs.readFileSync('./Config.json', 'utf8'))

const client = new Client({intents: [Intents.FLAGS.GUILDS] });

Battlefield.connect({ 
    host: Config.host,
    port: Config.port,
    password: Config.password
  }).then(async bf3 => {
    client.login(Config.discord.token)

    async function setServerStatus(error) {
      if (error) {
        client.user?.setActivity(`Server Offline`, {
          type: "WATCHING"
        });
      }

        setInterval(async () => {
            const info = await bf3.serverInfo()

            const map = info.map
            const playerCount = info.slots
            const maxPlayers = info.totalSlots
            const name = info.name
    
            client.user?.setActivity(`${playerCount}/${maxPlayers} playing ${map} on ${name}`, {
                type: "WATCHING"
              });
        }, 10 * 1000)
    }

    client.on('ready', () => {
        setServerStatus()
    })
  })


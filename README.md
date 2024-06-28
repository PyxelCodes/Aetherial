# Aetherial

Usage

You will need a token and a public key from the discord developer platform

```
  const Aetherial = require('aetherial');

  const client = new Aetherial.client(token, publicKey);

  client.on('ready', () => console.log('Bot is online!'))

  client.on('interactionCreate', (interaction) => {
      interaction.reply({
          content: "Hello, World!";
      })
  })
```

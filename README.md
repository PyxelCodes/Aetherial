# Aetherial

## Usage

You will need a token and a public key from the discord developer platform

```js
  const Aetherial = require('aetherial');

  const client = new Aetherial.Client(token, publicKey);

  client.on('ready', () => console.log('Bot is online!'))

  client.on('interactionCreate', (interaction) => {
      interaction.reply({
          content: "Hello, World!";
      })
  })
```

### Using Commands

Individual Command file located in `./commands/COMMAND_NAME.js`
```js
module.exports = {
    name: 'hello',
    run: ({ interaction }) => {
        interaction.reply({ content: "Hello, World!" })
    }
}
```

```js
// Appending this to the initial file will load the commands
Aetherial.loadCommands(client.commands);
```

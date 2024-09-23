# Aetherial

## Usage

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

This also works with Components

```js
  client.on('interactionCreate', (interaction) => {
    if(interaction.isButton()) {
      interaction.reply({
          content: "Hello, World!";
      })
    }
  })
```

### Using Commands

Individual Command file located in `./commands/COMMAND_NAME.js`

```js
module.exports = {
    name: "hello",
    run: ({ interaction }) => {
        interaction.reply({ content: "Hello, World!" });
    },
};
```

Using the in-built command loader which loads every command file in a subdirectory

-   index.js
-   commands
    -   info
        -   ping.js

```js
Aetherial.loadCommands(client.commands);
```

Using the in-built command registering function automatically registers the slash commands with discords API.

This function should only be called when there is a change to the command name list
Calling this once every bot start is okay but not ideal.

```js
Aetherial.loadCommands(client.commands);
Aetherial.registerCommands(client.commands, client.token);
```

Running the bot locally requires a Software called ngrok.
ngrok tunnels local http requests to a static url you can enter on the discord developer page under "INTERACTIONS ENDPOINT URL"

make sure to add the /interactions at the end of the URL.

for example: https://name.ngrok-free.app/interactions

### Using Embeds

```js
interaction.reply({
    embeds: [
        new Aetherial.MessageEmbed()
            .setDescription(`This is an Embed!`)
            .setColor(0xff0000),
    ],
});
```

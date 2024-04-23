import { Client, CommandInteractionOptionResolver, GatewayIntentBits, Message } from "discord.js";
import env from "./config/server_config";
const { TOKEN } = env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
  if(interaction.commandName === "verify") {
    let options = interaction.options;
    console.log(options.getString("url"))
    
  }
});

// client.on("messageCreate", (message: Message) => {
//   console.log(message);
// });

client.login(TOKEN);

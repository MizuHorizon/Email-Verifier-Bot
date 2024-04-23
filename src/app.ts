import { Client, CommandInteractionOptionResolver, GatewayIntentBits, Message } from "discord.js";
import env from "./config/server_config";
import { extractData } from "./services/spreadsheetservice";
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
    const sheetUrl = options.getString("url") as string;
    console.log(await extractData(sheetUrl));
  }
});

client.login(TOKEN);

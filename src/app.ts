import { Client, GatewayIntentBits,AttachmentBuilder } from "discord.js";
import env from "./config/server_config";
import { extractData } from "./services/spreadsheetservice";
import fs from "fs/promises";
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

    try{
    let options = interaction.options;
    const sheetUrl = options.getString("url") as string;
    await interaction.deferReply({ ephemeral: true })
    
    const sheetId = await extractData(sheetUrl);
    console.log("sheetId",sheetId);
    const fileContent = await fs.readFile(`D:/Project/Email Verifer Bot/src/out/${sheetId}.txt`, 'utf-8');
    // Create an AttachmentBuilder instance
    const attachmentBuilder = new AttachmentBuilder(Buffer.from(fileContent), { name: `${sheetId}.txt` });
   
    await interaction.editReply({ content: "Here's the file:", files: [attachmentBuilder] });
    } catch(error){
      console.log(error);
      await interaction.reply('An error occurred while sending the file.');
    }
  }
});

client.login(TOKEN);

import { REST, Routes } from 'discord.js';
import env from "./config/server_config";
const {TOKEN,CLIENT_ID} = env;

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name : "verify",
    description : "This will verify for email list!",
    options: [
        {
            name: "url",
            description: "The URL to verify",
            type: 3,
            required: true
        }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(TOKEN as string);

(async()=>{
    try {
        console.log('Started refreshing application (/) commands.');
      
        await rest.put(Routes.applicationCommands(CLIENT_ID as string), { body: commands });
      
        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error(error);
      }
})();


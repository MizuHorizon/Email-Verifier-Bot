import {google} from "googleapis";
import env from "../config/server_config";
import fs from 'fs/promises';
import { validateEmail } from "./verifymail";
const client = new google.auth.JWT(
    env.CLIENT_EMAIL,
    "",
    env.PRIVATE_KEY,
    ['https://www.googleapis.com/auth/spreadsheets']
);


export async function extractData(sheetUrl:string) {
    try {
        // Authorize the client
        await client.authorize();

        // Create Google Sheets API instance
        const sheets = google.sheets({ version: 'v4', auth: client });

        // Extract the Sheet ID from the URL
        const sheetId = sheetUrl!.match(/[-\w]{25,}/)![0];
        

        // Get the values from the sheet
        const response = await sheets.spreadsheets.values.get({
            auth:client,
            spreadsheetId: sheetId,
            range: 'Sheet1' 
        });
        
        const rows = response.data.values!;
        const promises = rows.map(async (column, index) => {
            if (index === 0) {
                column.push("Status");
            } else {
                let email = column[0];
                const valid = await validateEmail(email);
              //  console.log(email,valid);
                valid[1] ? column.push("Valid") : column.push("Not Valid");
            }
        });
    
        await Promise.all(promises); // Wait for all promises to resolve      
        (async () => {
            console.time("writeMany");
            const fileHandle = await fs.open(`./src/out/${sheetId}.txt`, "w");
        
            const stream = fileHandle.createWriteStream();
        
            for (let i = 0; i < rows.length; i++) {
              const buff = Buffer.from( rows[i].join("\t") +"\n", "utf-8");
              stream.write(buff);
            }
            console.timeEnd("writeMany");
            fileHandle.close();
          })();
          
          
          return sheetId
    } catch (error) {
        console.error('Error updating Google Sheet:', error);
    }
}

// const sheetUrl = "https://docs.google.com/spreadsheets/d/1datrnWPmlVf5eKvLe8pSBB8hMIfOmtTNFQop2hwsOD8/edit?usp=sharing";
import {google} from "googleapis";
import env from "../config/server_config"
const client = new google.auth.JWT(
    env.CLIENT_EMAIL,
    "",
    env.PRIVATE_KEY,
    ['https://www.googleapis.com/auth/spreadsheets']
);

async function main(sheetUrl:string) {
    try {
        // Authorize the client
        await client.authorize();

        // Create Google Sheets API instance
        const sheets = google.sheets({ version: 'v4', auth: client });

        // Extract the Sheet ID from the URL
        const sheetId = sheetUrl!.match(/[-\w]{25,}/)![0];
        console.log(sheetId);

        // Get the values from the sheet
        const response = await sheets.spreadsheets.values.get({
            auth:client,
            spreadsheetId: sheetId,
            range: 'Sheet1' // Change 'Sheet1' to the desired sheet name
        });

        const rows = response.data.values!;
        console.log(rows);

        // // Example: Add a new row with some data
        // rows.push(['New Data 1', 'New Data 2']);

        // // Write the updated values back to the sheet
        // const writeResponse = await sheets.spreadsheets.values.update({
        //     spreadsheetId: sheetId,
        //     range: 'Sheet1', // Change 'Sheet1' to the desired sheet name
        //     valueInputOption: 'USER_ENTERED',
        //     requestBody: {
        //         values: rows
        //     }
        // });

        console.log('Sheet updated successfully!');
    } catch (error) {
        console.error('Error updating Google Sheet:', error);
    }
}







const sheetUrl = "https://docs.google.com/spreadsheets/d/1datrnWPmlVf5eKvLe8pSBB8hMIfOmtTNFQop2hwsOD8/edit?usp=sharing";
main(sheetUrl)
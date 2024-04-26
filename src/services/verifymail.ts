import dns from 'dns';
import net from 'net';

export async function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false; // Invalid syntax
    }
    const [localPart, domain] = email.split('@');
    return new Promise<any>((resolve, reject) => {
        dns.resolveMx(domain, (err, addresses) => {
            if (err || !addresses || addresses.length === 0) {
                resolve([email,false]);
            } else {
                const mxRecord = addresses[0].exchange;
                const socket = net.createConnection({ port: 25, host: mxRecord }, () => {
                    // Provide the domain of the email address in the HELO command
                    socket.write(`HELO ${domain}\r\n`);
                    socket.write(`MAIL FROM: <bcabncanshuman2020@gmail.com>\r\n`);
                    socket.write(`RCPT TO: <${email}>\r\n`);
                    socket.write(`QUIT\r\n`);
                });
                
                let response = ''; // Variable to store server responses
                socket.on('data', (data: Buffer) => {
                    response += data.toString("utf-8"); // Append incoming data to response
                });

                socket.on("close",()=>{
                   // console.log(response); 
                    if (response.includes('550')||response.includes("553") || response.includes("The email account that you tried to reach does not exist")|| response.includes("Service unavailable")) {
                        resolve([email,false]);
                    } else if (response.includes('250')) {
                        resolve([email,true]);
                    } else {
                        // If no clear response is received, consider it as invalid
                        resolve([email,false]);
                    }
                });

                socket.on('error', (error) => {
                    console.log("Got error:", error);
                    resolve([email,false]);
                });
            }
        });
    });
}



// const emails = ["cattox7383@gmail.com",
//     "priyamboi09@gmail.com",
//     "hello@ycharts.com",
//     "hello@tadiig.co.uk",
//     "Ricky@iFireMonkey.net",
//     "MrJayPlaysBusiness@gmail.com",
//     "INFO@CHRONOSMEDIAGROUP.COM",
//     "MBMMLLC@gmail.com",
//     "partner@athletia.net",
//     "eric.lecuyer@smallscreenmarketing.com",
//     "kyle@audiouniversityonline.com",
//     "couchpotatotheatre@gmail.com",
//     "ariannevallieres10@gmail.com",
//     "wyattzworld@gmail.com",
//     "ceo.teligenz@gmail.com",
//     "awaz.me@gmail.com",
//     "gige82663727hdhd@gmail.com",
//     "bhdga2u28whwuuwgv@yahoo.com",
//     "hshsnnnsnsnsmsix828162@outlook.com",]



// // Test the function

// emails.forEach((email)=>{
//     validateEmail(email)
//     .then(valid => {
//         if (valid) {
//             console.log(email,"Email is valid.");
//         } else {
//             console.log(email,"Email is not valid.");
//         }
//     })
//     .catch(err => {
//         console.error("Error validating email:", err);
//     });
// });


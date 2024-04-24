import dns from 'dns';
import net from 'net';

export async function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false; // Invalid syntax
    }
    const [localPart, domain] = email.split('@');
    return new Promise<boolean>((resolve, reject) => {
        dns.resolveMx(domain, (err, addresses) => {
            if (err || !addresses || addresses.length === 0) {
                resolve(false);
            } else {
                const mxRecord = addresses[0].exchange;
                const socket = net.createConnection({ port: 25, host: mxRecord }, () => {
                    // Provide your hostname in the HELO command
                    socket.write(`HELO yourdomain.com\r\n`);
                    socket.write(`MAIL FROM: <youraddress@yourdomain.com>\r\n`);
                    socket.write(`RCPT TO: <${email}>\r\n`);
                    socket.write(`QUIT\r\n`);
                });
                
                let response = ''; // Variable to store server responses
                socket.on('data', (data: Buffer) => {
                    response += data.toString("utf-8"); // Append incoming data to response
                    
                });
                socket.on("close",()=>{
                    console.log("close",response);
                    if (response.includes('550') || response.includes("The email account that you tried to reach does not exist")) {
                     
                        resolve(false);
                    } else if (response.includes('250')) {
                        resolve(true);
                    }
                })
                socket.on('error', (error) => {
                    console.log("Got error:", error);
                    resolve(false);
                });
            }
        });
    });
}

// Test the function
// const email = 'anshuman9998@gmail.com';
// validateEmail(email)
//     .then(valid => {
//         if (valid) {
//             console.log("Email is valid.");
//         } else {
//             console.log("Email is not valid.");
//         }
//     })
//     .catch(err => {
//         console.error("Error validating email:", err);
//     });

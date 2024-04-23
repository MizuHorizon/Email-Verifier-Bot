import dns from 'dns';
import net from 'net';

// Function to validate email address
async function validateEmail(email:string) {
    // Syntax validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false; // Invalid syntax
    }
    
    // Split email into local part and domain
    const [localPart, domain] = email.split('@');

    // Domain validation using DNS queries
    return new Promise<boolean>((resolve, reject) => {
        dns.resolveMx(domain, (err, addresses) => {
            if (err || !addresses || addresses.length === 0) {
                // Domain doesn't exist or has no MX records
                resolve(false);
            } else {
                // Domain exists, now check mailbox (optional)
                // Connect to the SMTP server and attempt to verify mailbox existence
                const mxRecord = addresses[0].exchange;
                const socket = net.createConnection({ port: 25, host: mxRecord }, () => {
                    // Connection successful, send SMTP commands
                    socket.write(`HELO example.com\r\n`);
                    socket.write(`MAIL FROM: verification@example.com\r\n`);
                    socket.write(`RCPT TO: <${email}>\r\n`);
                    socket.write(`QUIT\r\n`);
                });
                
                let response = '';
                socket.on('data', (data: Buffer) => {
                    response += data.toString();
                    // Check the response from the server
                    if (response.includes('250')) {
                        // Mailbox exists
                        resolve(true);
                    } else if (response.includes('550')) {
                        // Mailbox does not exist
                        resolve(false);
                    }
                });

                socket.on('end', () => {
                    // Connection ended
                    resolve(false);
                });

                socket.on('error', (error) => {
                    // Error connecting to SMTP server
                    resolve(false);
                });
            }
        });
    });
}

// Test the function
const email = 'anshuman123123123123123123131212312@gmail.com';
validateEmail(email)
    .then(valid => {
        if (valid) {
            console.log("Email is valid.");
        } else {
            console.log("Email is not valid.");
        }
    })
    .catch(err => {
        console.error("Error validating email:", err);
    });

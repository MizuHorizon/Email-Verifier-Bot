import dns from 'dns';
import net from 'net';


async function validateEmail(email:string) {

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
                    socket.write(`HELO example.com\r\n`);
                    socket.write(`MAIL FROM: <anshuman9998@gmail.com>\r\n`);
                    socket.write(`RCPT TO: <${email}>\r\n`);
                    socket.write(`QUIT\r\n`);
                });
                
                let response = '';
                socket.on('data', (data: Buffer) => {
                 console.log(data.toString("utf-8"));
                    if (response.includes('250')) {
                        resolve(true);
                    } else if (response.includes('550')) {
                        resolve(false);
                    }
                });

                socket.on('end', () => {
                    resolve(false);
                });
                socket.on('error', (error) => {
                    resolve(false);
                });
            }
        });
    });
}

// Test the function
const email = 'bcabncans312human2020@gmail.com';
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

import dotenv from "dotenv";
dotenv.config()


const env = {
    TOKEN : process.env.TOKEN,
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_EMAIL:process.env.CLIENT_EMAIL,
    PRIVATE_KEY : process.env.PRIVATE_KEY!.toString().replace(/\\n/g, '\n'),
}

export default env;
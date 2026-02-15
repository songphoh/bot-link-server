import Redis from 'ioredis';

// Connect to Redis using the Environment Variable
// If running locally or if REDIS_URL is not set, this might fail, so ensure Env Var is set in Vercel
const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export default async function handler(request, response) {
    // Allow simple CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    const { method } = request;

    try {
        if (method === 'POST') {
            let command = null;
            if (request.body && request.body.command) command = request.body.command;
            else if (request.query && request.query.command) command = request.query.command;

            if (!command) {
                return response.status(400).json({ error: 'Missing command' });
            }

            const data = JSON.stringify({ cmd: command, time: Date.now() });
            await client.set('bot_command', data);

            return response.status(200).json({ status: 'OK', saved: command });
        }

        else if (method === 'GET') {
            const result = await client.get('bot_command');

            if (!result) {
                return response.status(200).send('WAIT');
            }

            const data = JSON.parse(result);

            // Check Expiration (30 seconds)
            if (Date.now() - data.time > 30000) {
                return response.status(200).send('WAIT');
            }

            return response.status(200).send(data.cmd);
        }

        return response.status(405).send('Method Not Allowed');
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.message });
    }
}

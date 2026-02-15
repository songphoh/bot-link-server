import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    // Allow simple CORS just in case
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    const { method } = request;

    try {
        if (method === 'POST') {
            // Try to get command from body (JSON) or query string
            let command = null;
            if (request.body && request.body.command) command = request.body.command;
            else if (request.query && request.query.command) command = request.query.command;

            if (!command) {
                return response.status(400).json({ error: 'Missing command' });
            }

            // Save command with timestamp (Lazy Expiration)
            // We store it as a JSON object inside Redis (KV)
            await kv.set('bot_command', { cmd: command, time: Date.now() });

            return response.status(200).json({ status: 'OK', saved: command });
        }

        else if (method === 'GET') {
            const data = await kv.get('bot_command');

            // 1. If no data found, return WAIT
            if (!data) {
                return response.status(200).send('WAIT');
            }

            // 2. Check Expiration (30 seconds = 30000 ms)
            // Since Vercel is stateless, we check time on retrieval
            if (Date.now() - data.time > 30000) {
                return response.status(200).send('WAIT');
            }

            // 3. Return the active command
            return response.status(200).send(data.cmd);
        }

        return response.status(405).send('Method Not Allowed');
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.message });
    }
}

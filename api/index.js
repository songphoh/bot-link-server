import Redis from 'ioredis';

// Connect to Redis
const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export default async function handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    const { method } = request;

    try {
        // 1. Get Room ID (Default to 'global' if not provided)
        // Supports query param (?room=123) or body ({ "room": "123" })
        let room = 'global';
        if (request.query && request.query.room) room = request.query.room;
        else if (request.body && request.body.room) room = request.body.room;

        // Sanitize room ID (alphanumeric only to be safe)
        room = room.replace(/[^a-zA-Z0-9_\-]/g, '');

        // Redis Key specific to this room
        const REDIS_KEY = `bot_command:${room}`;

        if (method === 'POST') {
            let command = null;
            if (request.body && request.body.command) command = request.body.command;
            else if (request.query && request.query.command) command = request.query.command;

            if (!command) {
                return response.status(400).json({ error: 'Missing command' });
            }

            // Save command with timestamp (Lazy Expiration)
            const data = JSON.stringify({ cmd: command, time: Date.now() });
            await client.set(REDIS_KEY, data);

            // Auto-expire key after 60 seconds (cleanup)
            await client.expire(REDIS_KEY, 60);

            return response.status(200).json({ status: 'OK', saved: command, room: room });
        }

        else if (method === 'GET') {
            const result = await client.get(REDIS_KEY);

            if (!result) {
                return response.status(200).send('WAIT');
            }

            const data = JSON.parse(result);

            // Check Expiration (30 seconds logic)
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

const client = require('./client');
const util = require('util');

// GET - /api/video-games - get all video games
async function getAllVideoGames() {
    try {
        const { rows: videoGames } = await client.query('SELECT * FROM videoGames');
        return videoGames;
    } catch (error) {
        throw new Error("Error fetching all video games.");
    }
}

// GET - /api/video-games/:id - get a single video game by id
async function getVideoGameById(id) {
    try {
        const { rows: [videoGame] } = await client.query(`
            SELECT * FROM videoGames
            WHERE id = $1;
        `, [id]);
        return videoGame;
    } catch (error) {
        throw error;
    }
}

// POST - /api/video-games - create a new video game
async function createVideoGame(body) {
    try {
        const { title, genre, platform, releaseYear } = body;
        const { rows } = await client.query(
            `INSERT INTO videoGames (title, genre, platform, release_year)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`,
            [title, genre, platform, releaseYear]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
}

// PUT - /api/video-games/:id - update a single video game by id
async function updateVideoGame(id, fields = {}) {
    const validFields = Object.keys(fields).filter((field) => fields[field] !== undefined);

    if (validFields.length === 0) {
        throw new Error('No valid fields to update.');
    }

    try {
        const setFields = validFields.map((field, index) => `${field} = $${index + 1}`).join(', ');

        const query = {
            text: `
                UPDATE videoGames
                SET ${setFields}
                WHERE id = $${validFields.length + 1}
                RETURNING *;
            `,
            values: [...validFields.map((field) => fields[field]), id],
        };

        const { rows } = await client.query(query);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

async function deleteVideoGame(id) {
    try {
        const { rows } = await client.query(
            `DELETE FROM videoGames
            WHERE id = $1
            RETURNING *;`,
            [id]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllVideoGames,
    getVideoGameById,
    createVideoGame,
    updateVideoGame,
    deleteVideoGame
}
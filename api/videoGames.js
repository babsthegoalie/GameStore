const express = require('express');
const router = express.Router();




const { getAllVideoGames,
    getVideoGameById,
    createVideoGame,
    updateVideoGame,
    deleteVideoGame } = require('../db/videoGames');

// GET - /api/video-games - get all video games
router.get('/', async (req, res, next) => {
    try {
        const videoGames = await getAllVideoGames();
        res.send(videoGames);
    } catch (error) {
        next(error);
    }
});

// GET - /api/video-games/:id - get a single video game by id
router.get('/:id', async (req, res, next) => {
    try {
        const gameId = req.params.id; // Extract ID from request parameters
        const videoGame = await getVideoGameById(gameId); // Pass ID to getVideoGameById function
        res.send(videoGame);
    } catch (error) {
        next(error);
    }
});

// POST - /api/video-games - create a new video game
router.patch('/', async (req, res, next) => {
    try {
        const { title, genre, platform, releaseYear } = req.body; // Extract game details from request body

        // Check if all required fields are present
        if (!title || !genre || !platform || !releaseYear) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Create a new video game object with the provided details
        const newVideoGame = {
            title,
            genre,
            platform,
            releaseYear
        };

        // Call the createVideoGame function to add the new game to the database
        const createdGame = await createVideoGame(newVideoGame);

        res.status(201).json(createdGame); // Respond with the created game data
    } catch (error) {
        next(error);
    }
});


// PUT - /api/video-games/:id - update a single video game by id
router.put('/:id', async (req, res, next) => {
    try {
        const gameId = req.params.id; // Extract ID from request parameters
        const { title, genre, platform, releaseYear } = req.body; // Extract updated game details from request body

        // Check if any of the fields are provided for update
        if (!title && !genre && !platform && !releaseYear) {
            return res.status(400).json({ message: 'Please provide at least one field to update.' });
        }

        // Create an object with the fields to update
        const updatedFields = {
            title,
            genre,
            platform,
            releaseYear
        };

        // Call the updateVideoGame function to update the game in the database
        const updatedGame = await updateVideoGame(gameId, updatedFields);

        if (!updatedGame) {
            return res.status(404).json({ message: 'Video game not found.' });
        }

        res.json(updatedGame); // Respond with the updated game data
    } catch (error) {
        next(error);
    }
});

// DELETE - /api/video-games/:id - delete a single video game by id
router.delete('/:id', async (req, res, next) => {
    try {
        const gameId = req.params.id; // Extract ID from request parameters

        // Call the deleteVideoGame function to delete the game from the database
        const deletedGame = await deleteVideoGame(gameId);

        if (!deletedGame) {
            return res.status(404).json({ message: 'Video game not found.' });
        }

        res.json({ message: 'Video game deleted successfully.' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;

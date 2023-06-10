const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber');

// GET - Getting all subscribers
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find();
        res.send(subscribers);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// GET - Getting a single subscriber by ID
router.get('/:id', getSubscriber, (req, res) => {
    res.json(res.subscriber);
});

// POST - Creating a new subscriber
router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    });

    try {
        const newSubscriber = await subscriber.save();
        res.status(201).json(newSubscriber);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH - Updating a subscriber by ID
router.patch('/:id', getSubscriber, async (req, res) => {
    if(req.body.name != null) {
        res.subscriber.name = req.body.name;
    }
    if(req.body.subscribedToChannel != null) {
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel;
    }
    try {
        const updatedSubscriber = await res.subscriber.save();
        res.json(updatedSubscriber);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE - Deleting a subscriber by ID
router.delete('/:id', async (req, res) => {
    try {
        const subscriberId = req.params.id;
        await Subscriber.findByIdAndRemove(subscriberId);

        res.json({ message: 'Deleted Subscriber' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get a subscriber by ID
async function getSubscriber(req, res, next) {
    let subscriber;
    try {
        subscriber = await Subscriber.findById(req.params.id);
        if(subscriber == null) {
            // If the subscriber is not found, return a 404 error response
            return res.status(404).json({ message: 'Cannot find subscriber' });
        }
    } catch(err) {
        // If there's an error while querying the database, return a 500 error response
        return res.status(500).json({ message: err.message });
    }
    // If the subscriber is found, attach it to the response object for further use
    res.subscriber = subscriber;
    next();
}

module.exports = router;
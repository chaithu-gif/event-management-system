const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const Event = require('../models/Event');

const router = express.Router();
const socketModule = require('../socket');

// Create event
router.post('/', [auth, body('title').notEmpty(), body('date').notEmpty()], async (req, res) => {
  const { title, description, location, date, capacity, packages, image, price, category } = req.body;
  console.log('[EVENT POST] Received request. req.user:', req.user);
  try {
    // createdBy can be null for admin-secret authenticated requests
    const event = new Event({ title, description, location, date, capacity, packages, image, price, category, createdBy: req.user._id || null });
    await event.save();
    console.log('[EVENT POST] Event saved successfully:', event._id);
    // emit socket update so customers can refresh
    try {
      const io = socketModule.getIo();
      io.emit('eventsUpdated', { action: 'created', event });
      console.log('[EVENT POST] Socket event emitted.');
    } catch (e) {
      // socket not initialized or other error — ignore to keep API working
      console.warn('[EVENT POST] Could not emit socket event:', e.message);
    }

    res.json(event);
  } catch (err) {
    console.error('[EVENT POST] Error saving event:', err.message, err);
    res.status(500).send('Server error: ' + (err.message || 'Unknown'));
  }
});

// Get all events
router.get('/', async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
});

// Get single event by id
router.get('/:id', async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ msg: 'Event not found' });
    res.json(ev);
  } catch (err) {
    console.error('Get event error', err && err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update event
router.put('/:id', [auth, body('title').optional().notEmpty()], async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // apply updates allowed fields
    const allowed = ['title','description','location','date','capacity','packages','image','price','category'];
    allowed.forEach(k => { if (typeof updates[k] !== 'undefined') event[k] = updates[k]; });

    await event.save();
    try { socketModule.getIo().emit('eventsUpdated', { action: 'updated', event }); } catch(e){/*ignore*/}
    res.json(event);
  } catch (err) {
    console.error('Update event error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    const ev = await Event.findByIdAndDelete(id);
    if (!ev) return res.status(404).json({ msg: 'Event not found' });
    try { socketModule.getIo().emit('eventsUpdated', { action: 'deleted', id }); } catch(e){/*ignore*/}
    res.json({ success: true });
  } catch (err) {
    console.error('Delete event error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

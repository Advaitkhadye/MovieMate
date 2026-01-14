import express from 'express';
import { createBooking, getOccupiedSeats, cancelBooking } from '../controllers/bookingController.js';
import { requireAuth } from '@clerk/express';

const bookingRouter = express.Router();


bookingRouter.post('/create', createBooking);
bookingRouter.post('/cancel', cancelBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export default bookingRouter;
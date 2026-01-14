import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js"
import stripe from 'stripe'


// Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId)
        if (!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const authData = req.auth();
        console.log("DEBUG: connection auth data:", JSON.stringify(authData, null, 2));
        let { userId } = authData;
        console.log("DEBUG: createBooking userId:", userId);

        // Confirm User 
        if (!userId) {
            return res.json({ success: false, message: "User ID missing. Try logging in again." })
        }
        const { showId, selectedSeats } = req.body;
        const { origin } = req.headers;

        // Check if the seat is available for the selected show
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats)

        if (!isAvailable) {
            return res.json({ success: false, message: "Selected Seats are not available." })
        }

        // Get the show details
        const showData = await Show.findById(showId).populate('movie');

        // Create a new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');

        await showData.save();

        await showData.save();

        // Create Stripe Checkout Session
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripeInstance.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'inr', // Changed from 'usd' to 'inr' as per context (India region likely) or keep dynamic. Assuming INR for now based on context.
                        product_data: {
                            name: showData.movie.title,
                        },
                        unit_amount: showData.showPrice * 100, // Amount in cents/paise
                    },
                    quantity: selectedSeats.length,
                }
            ],
            mode: 'payment',
            success_url: `${origin}/my-bookings?success=true&bookingId=${booking._id}`,
            cancel_url: `${origin}/my-bookings?success=false&bookingId=${booking._id}`, // Redirect to bookings to show status or handle cancellation
            metadata: {
                bookingId: booking._id.toString()
            }
        })

        // Update booking with payment link (optional, if we want to resume payment later)
        // For now, we return the session URL to frontend for immediate redirect
        booking.paymentLink = session.url;
        await booking.save();

        res.json({ success: true, url: session.url })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {

        const { showId } = req.params;
        const showData = await Show.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.json({ success: true, occupiedSeats })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const userId = req.auth().userId;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.user !== userId) {
            return res.json({ success: false, message: "Unauthorized to cancel this booking" });
        }

        const show = await Show.findById(booking.show);
        if (show) {
            // Remove occupied seats
            booking.bookedSeats.forEach(seat => {
                delete show.occupiedSeats[seat];
            });
            show.markModified('occupiedSeats');
            await show.save();
        }

        await Booking.findByIdAndDelete(bookingId);

        res.json({ success: true, message: "Booking cancelled successfully" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
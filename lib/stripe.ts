import Stripe from 'stripe'

export const stripe = new Stripe(process.env.SECRET_API_KEY!, {
    apiVersion: "2025-04-30.basil",
    typescript: true
})
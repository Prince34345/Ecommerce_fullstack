import Stripe from 'stripe'

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY!, {
    typescript: true
})
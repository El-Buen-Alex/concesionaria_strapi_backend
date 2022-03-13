'use strict';
    
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const stripe = require('stripe')(process.env.STRIPE_KEY)
const MY_DOMAIN = 'https://nuxt-concesionaria-grupo-dawa.netlify.app/cart';
module.exports={
    async create(ctx){
        const { cartDetail, cartTotal } = ctx.request.body
        const line_items = cartDetail.map((cartItem) => {
            const item = {}
            item.price_data = {
                currency: 'usd',
                product_data: {
                    name: cartItem.idUnique,
                },
                unit_amount: (cartItem.precio).toFixed(0),
            },
            item.quantity = 1
            return item;
        })
        

        const orden=await strapi.services.order.create({ item: {cartDetail, cartTotal, Total_items:cartTotal.length}});
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${MY_DOMAIN}?success=true`,
            cancel_url: `${MY_DOMAIN}?canceled=true`,
        })
        console.log(session)
        return { id: session.id}
    }
}
     
   
var stripe = Stripe('pk_test_51JSe6xJEkapOWG0uMvUjdASEMRmuay3yhmeLPLLazRBxhR6WqlAXF1GrpzfFSQzBMMwSHJZffxxcYFv9njK2jnNo00lRkAazE4');
var elements = stripe.elements();

var card = elements.create('card', {
    classes: {
        base: 'form-control',
    },
});
card.mount('#card-element');

var form = document.querySelector('#payment-form');
var card_paiement_loading = document.querySelector('#card-paiement-loading');
var errorElement = document.querySelector('#card-errors');
const stripe = Stripe("pk_test_51SxQASJ7uGufFKhIp92vPaUU3Fx4wN2RsuSYr639oSIcw8PXbsFfhAssEAnegVDBYmommSyQk8RKTv0KGzGoegcW00BuzIUHwH"); // clé publique
const elements = stripe.elements();

const emailInput = document.querySelector('#email')
const card = elements.create("card");
card.mount("#card-element");


const form = document.getElementById("payment-form");
const formDataUser = document.querySelector('.formDataUser');

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(formDataUser);
    const email = emailInput.value;
    
    const { paymentMethod, errorPaymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: card,
      billing_details: {
        email: email,
      },
    });

    
    
    formData.append("paymentMethodId", paymentMethod.id);    
    const formDataObject = Object.fromEntries(formData.entries());
    const formDataString = JSON.stringify(formDataObject);


    // Appel backend pour créer le PaymentIntent
    const response = await fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body : formDataString
    });

    const data = await response.json();
    const clientSecret = data.clientSecret;

    await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: card,
        billing_details: { email : email }
      }
    });

    /*const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card
        }
      }
    );/**/

    if (error) {
      document.getElementById("error-message").textContent = error.message;
    } else if (paymentIntent.status === "succeeded") {
      alert("Paiement réussi 🎉");
    }
});
 const stripe = Stripe("pk_test_51JSe6xJEkapOWG0uMvUjdASEMRmuay3yhmeLPLLazRBxhR6WqlAXF1GrpzfFSQzBMMwSHJZffxxcYFv9njK2jnNo00lRkAazE4"); // clé publique
  const elements = stripe.elements();

  const card = elements.create("card");
  card.mount("#card-element");

  const form = document.getElementById("payment-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Appel backend pour créer le PaymentIntent
    const response = await fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    const clientSecret = data.clientSecret;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card
        }
      }
    );

    if (error) {
      document.getElementById("error-message").textContent = error.message;
    } else if (paymentIntent.status === "succeeded") {
      alert("Paiement réussi 🎉");
    }
  });
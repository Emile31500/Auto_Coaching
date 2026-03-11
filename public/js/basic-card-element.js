  const stripe = Stripe("pk_test_51SxQASJ7uGufFKhIp92vPaUU3Fx4wN2RsuSYr639oSIcw8PXbsFfhAssEAnegVDBYmommSyQk8RKTv0KGzGoegcW00BuzIUHwH"); // clé publique

  const elements = stripe.elements();

  const card = elements.create("card");
  card.mount("#card-element");

  const button = document.getElementById("submit");

  button.addEventListener("click", async () => {
    const email = document.getElementById("email").value;

    // 1️⃣ Créer PaymentMethod
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: card,
      billing_details: {
        email: email,
      },
    });

    if (error) {
      document.getElementById("message").innerText = error.message;
      return;
    }

    // 2️⃣ Envoyer au backend
    const response = await fetch("/create-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        paymentMethodId: paymentMethod.id,
      }),
    });

    const data = await response.json();

    if (data.error) {
      document.getElementById("message").innerText = data.error;
      return;
    }

    // 3️⃣ Confirmer le paiement si nécessaire
    const confirmResult = await stripe.confirmCardPayment(
      data.clientSecret
    );

    if (confirmResult.error) {
      document.getElementById("message").innerText = confirmResult.error.message;
    } else {
      document.getElementById("message").innerText =
        "Abonnement réussi 🎉";
    }
  });
const style = {
  base: {
    height : "30 px",
    color: "#32325d",
    fontFamily: "Arial, sans-serif",
    fontSmoothing: "antialiased",
    fontSize: "18px",
    "::placeholder": {
      color: "#a0aec0"
    }
  },
  invalid: {
    color: "#e53e3e",
    iconColor: "#e53e3e"
  }
};

const stripe = Stripe("pk_test_51SxQASJ7uGufFKhIp92vPaUU3Fx4wN2RsuSYr639oSIcw8PXbsFfhAssEAnegVDBYmommSyQk8RKTv0KGzGoegcW00BuzIUHwH"); // clé publique
const formDataUser = document.querySelector('.formDataUser');
const elements = stripe.elements();
const card = elements.create("card", { style: style });
const paymentProgressBar = document.querySelector('#payment-progress-bar')
const messageElement = document.getElementById("message")
card.mount("#card-element");


const button = document.getElementById("confirmPay");

button.addEventListener("click", async (event) => {
    event.preventDefault();
    paymentProgressBar.classList.remove('d-none')
    const email = document.getElementById("email").value;
    
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
    
    const formData = new FormData(formDataUser);
    formData.append("paymentMethodId", paymentMethod.id);    
    const formDataObject = Object.fromEntries(formData.entries());
    
    const response = await fetch("/create-subscription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObject),
    });

    const data = await response.json();

    if (data.error) {

      paymentProgressBar.classList.add('d-none')
      messageElement.classList.add('alert-danger')
      messageElement.classList.remove('d-none')
      messageElement.innerText = data.error;
      return;

    } else  {

      paymentProgressBar.querySelector('.progress-bar').classList.add('bg-success')
      paymentProgressBar.querySelector('.progress-bar').innerHTML = "Paiement effectué avec succès 🎉 ! Vous allez être regiriger à la page de connexion dans quelque instant.";
      setTimeout(() => {
          window.location.href = "/login";
      }, 3000);

    }

    /*const confirmResult = await stripe.confirmCardPayment(data.clientSecret);*/

  /*  if (confirmResult.error) {
        messageElement.innerText = confirmResult.error.message;
    } else {
        messageElement.innerText =
        "Abonnement réussi 🎉";
    }*/
});
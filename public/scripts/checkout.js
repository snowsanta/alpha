//*******************************
//Stripe Payment
//*******************************

// A reference to Stripe.js initialized with your real test publishable API key.
// var stripe = Stripe("pk_test_51HDZnHL1Ff9f3n19SENlqSyAyCNOJXkjXnnEjp3wfL2JOjeHQdBjfLIV0yVS2t0CZpMISvbhRtVLRdgz02izZHCJ003mx3JOaA");
var stripe = Stripe('pk_live_51HDZnHL1Ff9f3n19ajXLDplcveuyyE9Go1q28Tnv0iBs9SVKj7xUjJ39L4b5m6snU88er8r18vuVWe25aSVSYszQ0066UgY2oB');
// The items the customer wants to buy
var purchase = {
  items: [{ id: "tutordelhi-registration-fee" }],
  currency: "inr"
};
// Disable the button until we have Stripe set up on the page
document.querySelector("button").disabled = true;
fetch("/create-payment-intent", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(purchase)
})
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    var elements = stripe.elements();
    var style = {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };
    var card = elements.create("card", { style: style });
    // Stripe injects an iframe into the DOM
    card.mount("#card-element");
    card.on("change", function (event) {
      // Disable the Pay button if there are no card details in the Element
      document.querySelector("button").disabled = event.empty;
      document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
    });

    var form = document.getElementById("payment-form");
    form.addEventListener("submit", function(event) {
      event.preventDefault();

        changeLoadingState(true);
  
  stripe.createPaymentMethod("card", card)
        .then(function(result) {
          if (result.error) {
            errorHandler(result.error.message);
          } else {
            orderData.paymentMethodId = result.paymentMethod.id;

            return fetch("/pay", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(orderData)
            });
          }
        })
        .then(function(result) {
          return result.json();
        })
        .then(function(response) {
          if (response.error) {
            errorHandler(response.error);
          } else {
            changeLoadingState(false);
            // redirect to /campgrounds with a query string
            // that invokes a success flash message
            window.location.href = '/students?paid=true'
          }
        }).catch(function(err) {
          errorHandler(err.error);
        });

      // Complete payment when the submit button is clicked
      payWithCard(stripe, card, data.clientSecret);

    });
  });
// Calls stripe.confirmCardPayment
// If the card requires authentication Stripe shows a pop-up modal to
// prompt the user to enter authentication details without leaving your page.
var payWithCard = function(stripe, card, clientSecret) {
  loading(true);
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card
      }
    })
    .then(function(result) {
      if (result.error) {
        // Show error to your customer
        showError(result.error.message);
      } else {
        // The payment succeeded!
        purchase.paymentMethodId = result.paymentMethod.id;
        orderComplete(result.paymentIntent.id);
      }
    });
};
/* ------- UI helpers ------- */
// Shows a success message when the payment is complete
var orderComplete = function(paymentIntentId) {
  loading(false);
  document
    .querySelector(".result-message a")
    .setAttribute(
      "href",
      "https://dashboard.stripe.com/test/payments/" + paymentIntentId
    );
  document.querySelector(".result-message").classList.remove("hidden");
  document.querySelector("button").disabled = true;
};
// Show the customer the error from Stripe if their card fails to charge
var showError = function(errorMsgText) {
  loading(false);
  var errorMsg = document.querySelector("#card-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};
// Show a spinner on payment submission
var loading = function(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};
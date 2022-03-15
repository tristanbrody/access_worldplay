var express = require("express");
var router = express.Router();
const axios = require("axios");
const { v4: uuid } = require("uuid");

const config = {
  headers: {
    Authorization: `Basic ${process.env.BASIC_AUTH_STRING}`,
    "Content-Type": "application/vnd.worldpay.payments-v6+json",
    Accept: "application/json",
  },
};

/* GET users listing. */
router.get("/", async function (req, res, next) {
  // query the root resource
  const rootResource = await axios.get(
    "https://try.access.worldpay.com/",
    config
  );
  res.send(rootResource.data);
});

router.post("/authorize", async function (req, res, next) {
  const sampleAuthorizationRequest = JSON.stringify({
    transactionReference: uuid(),
    merchant: {
      entity: "default",
    },
    instruction: {
      narrative: {
        line1: "Mind Palace",
      },
      value: {
        currency: "GBP",
        amount: 250,
      },
      paymentInstrument: {
        type: "card/plain",
        cardNumber: "4444333322221111",
        cardExpiryDate: {
          month: 5,
          year: 2035,
        },
      },
    },
  });
  const authorizationResponse = await axios.post(
    "https://try.access.worldpay.com/payments/authorizations",
    sampleAuthorizationRequest,
    config
  );
  res.send(authorizationResponse.data);
});

module.exports = router;

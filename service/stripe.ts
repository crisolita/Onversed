const stripe = require("stripe")(process.env.SK_TEST);

export const createCheckoutSession = async (
  amount: string,
  orderId: number,
  orderType: string
) => {
  try {
    const price = await stripe.prices.create({
      currency: "eur",
      unit_amount: amount,
      product_data: {
        name: `Compra de ${orderType}`,
      },
    });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: `https://${
        process.env.ENV == "TEST" ? `xperiendv3-dev.netlify.app` : `xperiend.io`
      }/stripe/${orderType}/success/${orderId}`,
      cancel_url: `https://xperiend.com/stripe//${orderType}/cancel/${orderId}`,
    });
    return session;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const validateCheckout = async (checkout_id: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(checkout_id);
    return session;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getBalance = async (acctStpId: string) => {
  try {
    const balance = await stripe.balance.retrieve(acctStpId);
    return balance;
  } catch (e) {
    console.log(e);
    return false;
  }
};

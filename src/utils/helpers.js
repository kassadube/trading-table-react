import _ from "lodash";

export const getInitState = () => ({
  buy_orders: [],
  sell_orders: [],
  matches: []
});

export const getTimestamp = () => new Date().toLocaleTimeString();

export const createMatchRecord = (order_1, order_2, price, quantity) => {
  const orders = [order_1, order_2];
  const buyer = _.chain(orders)
    .filter(["type", "buy"])
    .head()
    .value();
  const seller = _.chain(orders)
    .filter(["type", "sell"])
    .head()
    .value();
  return {
    time: getTimestamp(),
    buyer: JSON.stringify(buyer),
    seller: JSON.stringify(seller),
    price,
    quantity
  };
};

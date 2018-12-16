import _ from "lodash";

export const getTimestamp = () => new Date().toLocaleTimeString();

export const getInitState = () => ({
  buyOrders: [],
  sellOrders: [],
  matches: []
});

export const createMatchRecord = (order1, order2, price, quantity) => {
  const orders = [order1, order2];
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

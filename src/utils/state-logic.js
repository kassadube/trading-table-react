import _ from "lodash";

import { createMatchRecord } from "./helpers";

export const getNewState = (order, state) => {
  process(order, state);
  return state;
};

const getSearchTarget = (type, { sellOrders, buyOrders }) =>
  type === "buy" ? sellOrders : buyOrders;
const getStateStorageByType = (type, { sellOrders, buyOrders }) =>
  type === "buy" ? buyOrders : sellOrders;
const getFilterPredicateForOrder = ({ type, price }) =>
  type === "buy" ? o => o.price <= price : o => o.price >= price;

const findMatches = (order, state) => {
  const searchTarget = getSearchTarget(order.type, state);
  const filterPredicate = getFilterPredicateForOrder(order);
  return _.chain(searchTarget)
    .filter(filterPredicate)
    .orderBy(["price", "id"], ["asc", "desc"])
    .value();
};

const calculateMatch = (order, match) => {
  const matchPrice =
    order.price === match.price
      ? order.price
      : Math.round((order.price + match.price) / 2);
  const matchQuantity = Math.min(order.quantity, match.quantity);
  return [matchPrice, matchQuantity];
};

const assignNewQuantity = (order, match) => {
  const quantity = order.quantity - match.quantity;
  order.quantity = Math.max(0, quantity);
  match.quantity = quantity >= 0 ? 0 : Math.abs(quantity);
  return [order, match];
};

const process = (order, state) => {
  const { type, price } = order;
  const searchTarget = getSearchTarget(type, state);
  const storageForOrder = getStateStorageByType(type, state);

  const matches = findMatches(order, state);
  if (!matches.length) return storageForOrder.push(order);
  const match = _.last(matches);
  _.pull(searchTarget, match);

  const [matchPrice, matchQuantity] = calculateMatch(order, match);
  const matchRecord = createMatchRecord(
    order,
    match,
    matchPrice,
    matchQuantity
  );
  state.matches.push(matchRecord);

  const [updatedOrder, updatedMatch] = assignNewQuantity(order, match);
  if (updatedMatch.quantity) searchTarget.push(updatedMatch);
  if (updatedOrder.quantity) process(updatedOrder, state);
};

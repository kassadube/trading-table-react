import _ from "lodash";

import { createMatchRecord } from "./helpers";

export const calculateNewState = (order, state) => {
  const state_clone = _.cloneDeep(state);
  process(order, state_clone);
  return state_clone;
};

const getSearchTarget = (type, { sell_orders, buy_orders }) =>
  type === "buy" ? sell_orders : buy_orders;
const getStateStorageByType = (type, { sell_orders, buy_orders }) =>
  type === "buy" ? buy_orders : sell_orders;
const getFilterPredicateForOrder = ({ type, price }) =>
  type === "buy" ? o => o.price <= price : o => o.price >= price;

const findMatches = (order, state) => {
  const { type, price } = order;
  const search_target = getSearchTarget(type, state);
  const filterPredicate = getFilterPredicateForOrder(order);
  return _.chain(search_target)
    .filter(filterPredicate)
    .orderBy(["price", "id"], ["asc", "desc"])
    .value();
};

const calculateMatch = (order, match) => {
  const match_price =
    order.price === match.price
      ? order.price
      : Math.round((order.price + match.price) / 2);
  const match_quantity = Math.min(order.quantity, match.quantity);
  return [match_price, match_quantity];
};

const assignNewQuantity = (order, match) => {
  const quantity = order.quantity - match.quantity;
  order.quantity = Math.max(0, quantity);
  match.quantity = quantity >= 0 ? 0 : Math.abs(quantity);
  return [order, match];
};

const process = (order, state) => {
  const { type, price } = order;
  const search_target = getSearchTarget(type, state);
  const storage_for_order = getStateStorageByType(type, state);

  const matches = findMatches(order, state);
  if (!matches.length) return storage_for_order.push(order);
  const match = _.last(matches);
  _.pull(search_target, match);

  const [match_price, match_quantity] = calculateMatch(order, match);
  const match_record = createMatchRecord(
    order,
    match,
    match_price,
    match_quantity
  );
  state.matches.push(match_record);

  const [upd_order, upd_match] = assignNewQuantity(order, match);
  if (upd_match.quantity) search_target.push(upd_match);
  if (upd_order.quantity) process(upd_order, state);
};

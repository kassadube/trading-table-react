import { getInitState, createMatchRecord } from "./helpers";
import { getNewState } from "./state-logic";

it("adding sell order to empty state", () => {
  const sellOrder = { id: 2, type: "sell", quantity: 1, price: 1 };
  const oldState = getInitState();
  const expectedState = getInitState();
  expectedState.sellOrders.push(sellOrder);
  const actualState = getNewState(sellOrder, oldState);

  expect(actualState).toEqual(expectedState);
});

it("adding buy order to empty state", () => {
  const buyOrder = { id: 1, type: "buy", quantity: 1, price: 1 };
  const oldState = getInitState();
  const expectedState = getInitState();
  expectedState.buyOrders.push(buyOrder);
  const actualState = getNewState(buyOrder, oldState);

  expect(actualState).toEqual(expectedState);
});

it("adding sell order to state with dismatching buy order", () => {
  const buyOrder = { id: 1, type: "buy", quantity: 1, price: 1 };
  const sellOrder = { id: 2, type: "sell", quantity: 1, price: 2 };
  const oldState = getInitState();
  oldState.buyOrders.push(buyOrder);
  const expectedState = getInitState();
  expectedState.buyOrders.push(buyOrder);
  expectedState.sellOrders.push(sellOrder);
  const actualState = getNewState(sellOrder, oldState);

  expect(actualState).toEqual(expectedState);
});

it("adding buy order to state with dismatching sell order", () => {
  const buyOrder = { id: 1, type: "buy", quantity: 1, price: 1 };
  const sellOrder = { id: 2, type: "sell", quantity: 1, price: 2 };
  const oldState = getInitState();
  oldState.sellOrders.push(sellOrder);
  const expectedState = getInitState();
  expectedState.buyOrders.push(buyOrder);
  expectedState.sellOrders.push(sellOrder);
  const actualState = getNewState(buyOrder, oldState);

  expect(actualState).toEqual(expectedState);
});

it("adding buy order to state with matching sell order", () => {
  const buyOrder = { id: 1, type: "buy", quantity: 1, price: 1 };
  const sellOrder = { id: 2, type: "sell", quantity: 1, price: 1 };
  const oldState = getInitState();
  oldState.sellOrders.push(sellOrder);
  const expectedState = getInitState();
  const match = createMatchRecord(buyOrder, sellOrder, 1, 1);
  expectedState.matches.push(match);
  const actualState = getNewState(buyOrder, oldState);

  expect(actualState).toEqual(expectedState);
});

it("adding sell order to state with matching buy order", () => {
  const buyOrder = { id: 1, type: "buy", quantity: 1, price: 1 };
  const sellOrder = { id: 2, type: "sell", quantity: 1, price: 1 };
  const oldState = getInitState();
  oldState.buyOrders.push(buyOrder);
  const expectedState = getInitState();
  const match = createMatchRecord(buyOrder, sellOrder, 1, 1);
  expectedState.matches.push(match);
  const actualState = getNewState(sellOrder, oldState);

  expect(actualState).toEqual(expectedState);
});

it("adding buy order to state with matching sell order with more quantity", () => {
  const buyOrder = { id: 1, type: "buy", quantity: 1, price: 1 };
  const sellOrder = { id: 2, type: "sell", quantity: 2, price: 1 };
  const oldState = getInitState();
  oldState.sellOrders.push(sellOrder);
  const expectedState = getInitState();
  const match = createMatchRecord(buyOrder, sellOrder, 1, 1);
  expectedState.matches.push(match);
  expectedState.sellOrders.push({
    id: 2,
    type: "sell",
    quantity: 1,
    price: 1
  });
  const actualState = getNewState(buyOrder, oldState);

  expect(actualState).toEqual(expectedState);
});

it("adding buy order to state with matching sell order with less quantity", () => {
  const buyOrder = { id: 1, type: "buy", quantity: 2, price: 1 };
  const sellOrder = { id: 2, type: "sell", quantity: 1, price: 1 };
  const oldState = getInitState();
  oldState.sellOrders.push(sellOrder);
  const expectedState = getInitState();
  const match = createMatchRecord(buyOrder, sellOrder, 1, 1);
  expectedState.matches.push(match);
  expectedState.buyOrders.push({ id: 1, type: "buy", quantity: 1, price: 1 });
  const actualState = getNewState(buyOrder, oldState);

  expect(actualState).toEqual(expectedState);
});

it("adding sell order to state with matching buy order with more quantity", () => {
  const buyOrder = { id: 1, type: "buy", quantity: 2, price: 1 };
  const sellOrder = { id: 2, type: "sell", quantity: 1, price: 1 };
  const oldState = getInitState();
  oldState.buyOrders.push(buyOrder);
  const expectedState = getInitState();
  const match = createMatchRecord(buyOrder, sellOrder, 1, 1);
  expectedState.matches.push(match);
  expectedState.buyOrders.push({ id: 1, type: "buy", quantity: 1, price: 1 });
  const actualState = getNewState(sellOrder, oldState);

  expect(actualState).toEqual(expectedState);
});

it("adding sell order to state with matching buy order with less quantity", () => {
  const buyOrder = { id: 1, type: "buy", quantity: 1, price: 1 };
  const sellOrder = { id: 2, type: "sell", quantity: 2, price: 1 };
  const oldState = getInitState();
  oldState.buyOrders.push(buyOrder);
  const expectedState = getInitState();
  const match = createMatchRecord(buyOrder, sellOrder, 1, 1);
  expectedState.matches.push(match);
  expectedState.sellOrders.push({
    id: 2,
    type: "sell",
    quantity: 1,
    price: 1
  });
  const actualState = getNewState(sellOrder, oldState);

  expect(actualState).toEqual(expectedState);
});

it("adding buy order to state with two matching sell orders", () => {
  const buyOrder = { id: 1, type: "buy", quantity: 1, price: 1 };
  const sellOrder_2 = { id: 2, type: "sell", quantity: 1, price: 1 };
  const sellOrder_3 = { id: 3, type: "sell", quantity: 1, price: 1 };
  const oldState = getInitState();
  oldState.sellOrders.push(sellOrder_2);
  oldState.sellOrders.push(sellOrder_3);
  const expectedState = getInitState();
  const match = createMatchRecord(buyOrder, sellOrder_2, 1, 1);
  expectedState.matches.push(match);
  expectedState.sellOrders.push(sellOrder_3);
  const actualState = getNewState(buyOrder, oldState);

  expect(actualState).toEqual(expectedState);
});

it("adding sell order to state with two matching buy orders", () => {
  const sellOrder = { id: 1, type: "sell", quantity: 1, price: 1 };
  const buyOrder_2 = { id: 2, type: "buy", quantity: 1, price: 1 };
  const buyOrder_3 = { id: 3, type: "buy", quantity: 1, price: 1 };
  const oldState = getInitState();
  oldState.buyOrders.push(buyOrder_2);
  oldState.buyOrders.push(buyOrder_3);
  const expectedState = getInitState();
  const match = createMatchRecord(buyOrder_2, sellOrder, 1, 1);
  expectedState.matches.push(match);
  expectedState.buyOrders.push(buyOrder_3);
  const actualState = getNewState(sellOrder, oldState);

  expect(actualState).toEqual(expectedState);
});

it("adding buy order to state with few matching sell orders and different prices", () => {
  const buyOrder_1 = { id: 1, type: "buy", quantity: 5, price: 4 };
  const upd_buyOrder_1 = { id: 1, type: "buy", quantity: 3, price: 4 };
  const sellOrder_2 = { id: 2, type: "sell", quantity: 2, price: 3 };
  const sellOrder_3 = { id: 3, type: "sell", quantity: 3, price: 2 };
  const sellOrder_4 = { id: 4, type: "sell", quantity: 3, price: 2 };
  const oldState = getInitState();
  oldState.sellOrders.push(sellOrder_2);
  oldState.sellOrders.push(sellOrder_3);
  oldState.sellOrders.push(sellOrder_4);
  const expectedState = getInitState();
  const match_1 = createMatchRecord(buyOrder_1, sellOrder_2, 4, 2);
  const match_2 = createMatchRecord(upd_buyOrder_1, sellOrder_3, 3, 3);
  expectedState.matches.push(match_1);
  expectedState.matches.push(match_2);
  expectedState.sellOrders.push(sellOrder_4);
  const actualState = getNewState(buyOrder_1, oldState);

  expect(actualState).toEqual(expectedState);
});

it("adding sell order to state with few matching buy orders and different prices", () => {
  const sellOrder_1 = { id: 1, type: "sell", quantity: 5, price: 1 };
  const upd_sellOrder_1 = { id: 1, type: "sell", quantity: 3, price: 1 };
  const buyOrder_2 = { id: 2, type: "buy", quantity: 2, price: 3 };
  const buyOrder_3 = { id: 3, type: "buy", quantity: 3, price: 2 };
  const buyOrder_4 = { id: 4, type: "buy", quantity: 3, price: 2 };
  const oldState = getInitState();
  oldState.buyOrders.push(buyOrder_2);
  oldState.buyOrders.push(buyOrder_3);
  oldState.buyOrders.push(buyOrder_4);
  const expectedState = getInitState();
  const match_1 = createMatchRecord(buyOrder_2, sellOrder_1, 2, 2);
  const match_2 = createMatchRecord(buyOrder_3, upd_sellOrder_1, 2, 3);
  expectedState.matches.push(match_1);
  expectedState.matches.push(match_2);
  expectedState.buyOrders.push(buyOrder_4);
  const actualState = getNewState(sellOrder_1, oldState);

  expect(actualState).toEqual(expectedState);
});

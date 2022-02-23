const { iterateAll } = require("..");

test("array of values", async () => {
  const input = [1, 2, 3, 4];
  const result = await iterateAll(input);
  expect(result).toEqual([1, 2, 3, 4]);
});

test("array of Promises", async () => {
  const input = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
    Promise.resolve(4),
  ];
  const result = await iterateAll(input);
  expect(result).toEqual([1, 2, 3, 4]);
});

test("array of mixed values and Promises", async () => {
  const input = [1, Promise.resolve(2), 3, Promise.resolve(4)];
  const result = await iterateAll(input);
  expect(result).toEqual([1, 2, 3, 4]);
});

test("set of mixed values and promises", async () => {
  const input = new Set([1, Promise.resolve(2), 3, Promise.resolve(4)]);
  const result = await iterateAll(input);
  expect(result).toEqual([1, 2, 3, 4]);
});

test("map", async () => {
  const input = new Map();
  input.set(1, 2);
  input.set(3, 4);
  const result = await iterateAll(input);
  expect(result).toEqual([
    [1, 2],
    [3, 4],
  ]);
});

test("generator of values", async () => {
  const makeInput = function* () {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
  };
  const input = makeInput();
  const result = await iterateAll(input);
  expect(result).toEqual([1, 2, 3, 4]);
});

test("generator of mixed values and Promises", async () => {
  const makeInput = function* () {
    yield 1;
    yield Promise.resolve(2);
    yield 3;
    yield Promise.resolve(4);
  };
  const input = makeInput();
  const result = await iterateAll(input);
  expect(result).toEqual([1, 2, 3, 4]);
});

test("async generator of values", async () => {
  const makeInput = async function* () {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
  };
  const input = makeInput();
  const result = await iterateAll(input);
  expect(result).toEqual([1, 2, 3, 4]);
});

test("async generator of mixed values and Promises", async () => {
  const makeInput = async function* () {
    yield Promise.resolve(1);
    yield 2;
    yield Promise.resolve(3);
    yield 4;
  };
  const input = makeInput();
  const result = await iterateAll(input);
  expect(result).toEqual([1, 2, 3, 4]);
});

test("async generator of mixed values and Promises, with pause in the middle", async () => {
  const makeInput = async function* () {
    yield Promise.resolve(1);
    yield 2;
    await new Promise((resolve) => setTimeout(resolve, 200));
    yield Promise.resolve(3);
    yield 4;
  };
  const input = makeInput();
  const result = await iterateAll(input);
  expect(result).toEqual([1, 2, 3, 4]);
});

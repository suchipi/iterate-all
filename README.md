# iterate-all

A utility function that converts any of these:

- `Iterable<T>`
- `Iterable<Promise<T>>`
- `AsyncIterable<T>`
- `AsyncIterable<Promise<T>>`

Into this:

- `Promise<Array<T>>`

## Usage

```
import {iterateAll} from "iterate-all";

async function* someAsyncGenerator() {
  yield 1;
  yield Promise.resolve(2);
  yield 3;
}

const results = await iterateAll(someAsyncGenerator());

console.log(results); // [1, 2, 3];
```

## Notes

- Each yielded value will be `await`ed before asking for the next value. As such, all execution will proceed serially; the same as if using `for..of` or `for await..of`.
- The `next` function on the iterable will always be called with no arguments. As such, when using a generator function to create your iterable, the result of any `yield` expression inside the generator function will always be undefined.
- If you find yourself wanting a synchronous version of this, `Array.from` (potentially combined with `Promise.all`) is probably sufficient for your needs.

## License

MIT

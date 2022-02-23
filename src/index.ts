const NOTHING = Symbol("NOTHING");

function isThenable<T>(value: unknown): value is Promise<T> {
  return (
    typeof value === "object" &&
    value != null &&
    // @ts-ignore accessing .then
    typeof value.then === "function"
  );
}

export async function iterateAll<T>(
  iterable: Iterable<T | Promise<T>> | AsyncIterable<T | Promise<T>>
): Promise<Array<T>> {
  const iteratorFactory =
    iterable[Symbol.asyncIterator || NOTHING] || iterable[Symbol.iterator];

  if (typeof iteratorFactory !== "function") {
    throw new Error(
      "The object you passed in doesn't appear to be iterable. " +
        "Make sure it has a Symbol.iterator or Symbol.asyncIterator property, " +
        "and that Symbol.iterator and Symbol.asyncIterator are defined."
    );
  }

  const iterator = iteratorFactory.call(iterable);

  const results: Array<T> = [];
  let done = false;

  while (!done) {
    let nextResult = iterator.next();
    if (isThenable(nextResult)) {
      nextResult = await nextResult;
    }

    if (nextResult.done) {
      done = true;
    } else {
      let value = nextResult.value;
      if (isThenable(value)) {
        value = await value;
      }

      results.push(value);
    }
  }

  return results;
}

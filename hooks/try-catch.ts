type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

export type Result<T, E = Error> = Success<T> | Failure<E>;

// Wraps a function to handle try-catch and return a standardized response
export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null } as Success<T>;
  } catch (error) {
    return { data: null, error: error as E } as Failure<E>;
  }
}

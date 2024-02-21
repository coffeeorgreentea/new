import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Define a generic type for the watch object that allows specifying expected types for each query parameter
interface UseQueryParamsOptions<T> {
  watch: Record<keyof T, (value: T[keyof T]) => void>;
  debounceDelay?: number;
  executeOnMount?: boolean;
}

// Use generic type T to type the return value of the hook and the watchedValues state
export function useQueryParams<T extends Record<string, any>>({
  watch,
  debounceDelay = 0,
  executeOnMount = true,
}: UseQueryParamsOptions<T>) {
  const router = useRouter();
  const [watchedValues, setWatchedValues] = useState<T>(() =>
    Object.keys(watch).reduce((acc, key) => {
      const queryValue = router.query[key];
      acc[key as keyof T] = (
        Array.isArray(queryValue) ? queryValue[0] : queryValue || ''
      ) as T[keyof T];
      return acc;
    }, {} as T)
  );

  useEffect(() => {
    if (executeOnMount || !router.isReady) {
      const newValues = Object.keys(watch).reduce((acc, key) => {
        const queryValue = router.query[key];
        acc[key as keyof T] = (
          Array.isArray(queryValue) ? queryValue[0] : queryValue || ''
        ) as T[keyof T];
        return acc;
      }, {} as T);
      setWatchedValues(newValues);
    }
  }, [router.query, router.isReady, watch, executeOnMount]);

  useEffect(() => {
    if (!debounceDelay) return;

    const handler = setTimeout(() => {
      Object.keys(watch).forEach((key) => {
        const queryValue = router.query[key];
        const value = (
          Array.isArray(queryValue) ? queryValue[0] : queryValue || ''
        ) as T[keyof T];
        if (value !== watchedValues[key]) {
          watch[key](value);
          setWatchedValues((prev) => ({ ...prev, [key]: value }));
        }
      });
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [router.query, watch, debounceDelay, watchedValues]);

  const setQueryParams = useCallback(
    (params: Partial<T>) => {
      const queryParams: Record<string, string | string[]> = {};

      // Iterate over each key in params to safely assign values to queryParams
      Object.keys(params).forEach((key) => {
        const value = params[key as keyof T];
        if (value !== undefined) {
          // Ensure we're not trying to assign undefined values
          queryParams[key] =
            typeof value === 'string' || Array.isArray(value)
              ? value
              : String(value);
        }
      });

      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, ...queryParams },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  return { watchedValues, setQueryParams };
}

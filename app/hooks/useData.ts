"use client";
import { useState, useEffect } from 'react';

interface LoadingState<T> {
  isLoading: boolean;
  error: Error | null;
  data: T | null;
}

export function createDataHook<T>(endpoint: string) {
  return function useData(): LoadingState<T> {
    const [state, setState] = useState<LoadingState<T>>({
      isLoading: true,
      error: null,
      data: null,
    });

    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch(`/api/${endpoint}`);
          const data = await response.json();
          setState({
            isLoading: false,
            error: null,
            data: data[endpoint] || [] });
        } catch (error) {
          setState({
            isLoading: false,
            error: error instanceof Error ? error : new Error('An unknown error occurred'),
            data: null
          });
        }
      }
      fetchData();
    }, []) ;
    return state;
  }
}

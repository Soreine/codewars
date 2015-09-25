module Fibonacci where

fibonacci :: Int -> Integer
fibonacci = (!!) memo
  where
    memo = map fibo [0..]
    fibo :: Int -> Integer
    fibo 0 = 0
    fibo 1 = 1
    fibo n = fibonacci (n-1) + fibonacci (n-2)

module MillionthFibo where

fib :: Integer -> Integer
fib 0 = 0
fib 1 = 1
fib 2 = 1
fib 3 = 2
fib n
  | n < 0 = let fn = fib (-n) in
            if (n `mod` 2) == 0
            then -fn
            else fn
  | n `mod` 2 == 0 = 2*fm*fm1 - fm*fm
  | otherwise =  fm*fm + fm1*fm1
      where fm = fib m
            fm1 = fib (m+1)
            m = n `quot` 2


-- https://mitpress.mit.edu/sicp/chapter1/node15.html

-- f(n) = f(n-1) + f(n-2)
--      = 2f(n-2) + f(n-3)
--      = 3f(n-3) + 2f(n-4)
--      = 5f(n-4) + 3f(n-5)
--      = f(5)*f(n-4) + f(4)*f(n-5)
-- f(n) = f(m)*f(n-(m-1)) + f(m-1)*f(n-m)
-- n = 2m
-- f(n) = f(m)*f(m+1) + f(m-1)*f(m) 
--      = f(m)*f(m) + 2*f(m)*f(m-1)
--      = 2*f(m)*f(m+1) - f(m)*f(m)
-- n = 2m + 1 (m = n/2)
-- f(n) = f(m)*f(m+2) + f(m-1)*f(m+1) 
--      = f(m)*f(m+1) + f(m)*f(m) + f(m+1)*f(m+1) - f(m+1)*f(m)
--      = f(m)*f(m) + f(m+1)*f(m+1)

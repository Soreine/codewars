module Codewars.G964.CheckChoose where
import Data.List
import Data.Maybe
      
checkchoose :: Integer -> Integer -> Integer
checkchoose m n = fromMaybe (-1) $
                  find (\x -> choose n x == m) [0..(n `div` 2 + 1)]
  where choose n 0 = 1
        choose 0 k = 0
        choose n k = choose (n-1) (k-1) * n `div` k

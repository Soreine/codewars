module Balanced.Parens where

balancedParens :: Integer -> [String]
balancedParens n = balPar 0 n
  where
    balPar :: Integer -> Integer -> [String]
    balPar 0 0 = [""]
    balPar _ 0 = []
    balPar opened toClose
      | opened == 0 = opening
      -- opened and toClose are positive
      | opened > toClose = []
      | otherwise = closing ++ opening
      where closing = map (')':) $ balPar (opened-1) (toClose-1)
            opening = map ('(':) $ balPar (opened+1) toClose


-------------------------------

memo :: (Int -> Int -> a) -> [[a]]
memo f = map (\x -> map (f x) [0..]) [0..]
                       
balancingPossibilities :: Int -> Integer
balancingPossibilities n = fastBalPos 0 n

balPosMemo :: [[Integer]]
balPosMemo = memo balPos

fastBalPos :: Int -> Int -> Integer
fastBalPos n m = balPosMemo !! n !! m

balPos :: Int -> Int -> Integer
balPos 0 0 = 1
balPos _ 0 = 0
balPos opened toClose
       | opened == 0 = opening
       -- opened and toClose are positive
       | opened > toClose = 0
       | otherwise = closing + opening
       where closing = fastBalPos (opened-1) (toClose-1)
             opening = fastBalPos (opened+1) toClose

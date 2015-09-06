module Codewars.Exercise.Suffixes where

  stringSuffix    :: String -> Int
  stringSuffix s  = strSuffix s
    where strSuffix [] = 0
          strSuffix xs = countMatch s xs + strSuffix (tail xs)
          countMatch [] _ = 0
          countMatch _ [] = 0
          countMatch (x:xs) (y:ys)
            | x == y      = 1 + countMatch xs ys
            | otherwise   = 0

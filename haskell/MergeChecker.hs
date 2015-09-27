module Codewars.Exercise.MergeChecker where

isMerge :: String -> String -> String -> Bool
isMerge as bs cs = isMerge' as bs cs || isMerge' as cs bs
  where isMerge' [] [] [] = True
        isMerge' (a:as) (b:bs) cs | a == b = isMerge as bs cs
        isMerge' _ _ _ = False

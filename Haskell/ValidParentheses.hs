module Codewars.Parentheses where

validParentheses :: String -> Bool
validParentheses xs = all (>= 0) counts && (last counts) == 0
                   where
                     counts = scanl countPar 0 xs
                     countPar '(' = (+) 1
                     countPar ')' = (-) 1

module Codewars.Kata.ZipValidate where
import Data.Char (isDigit)
  
zipValidate :: String -> Bool
zipValidate s = not (null s)
                && not (elem (head s) "05789")
                && length s == 6
                && all isDigit s

module Codewars.Exercise.Lucas where
  -- import Debug.Trace (trace)

  lucasmemoized :: [Integer]
  lucasmemoized = map lucasnum [0..]

  lucasnum   :: Int -> Integer
  lucasnum 0 = 2
  lucasnum 1 = 1
  lucasnum n
    -- | trace ("lucasnum " ++ show n) False = undefined
    | n > 0 = lucasmemoized !! (n - 1) + lucasmemoized !! (n - 2)
    | even n = lucasmemoized !! (-n)
    | otherwise = - lucasmemoized !! (-n)

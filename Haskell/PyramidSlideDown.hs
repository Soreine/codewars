module PyramidSlideDown where
  import Data.List
  --    /3/
  --   \7\ 4 
  --  2 \4\ 6 
  -- 8 5 \9\ 3
  -- Assuming pyramids are made of non negative integers
  longestSlideDown :: [[Int]] -> Int
  longestSlideDown pyramid = maximum $ foldl (bestSlides) [0] pyramid
    where
      surroundZero xs = [0] ++ xs ++ [0]
      bestSlides :: [Int] -> [Int] -> [Int]
      bestSlides slides floor = map (uncurry (+)) (zip floor best)
        where best = map (uncurry max) (zip (tail surrounded) surrounded)
              surrounded = surroundZero slides
                     

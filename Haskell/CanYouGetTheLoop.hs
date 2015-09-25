module CanYouGetTheLoop where
import CanYouGetTheLoop.Types

{-
data Node a
instance Eq a => Eq (Node a)

next :: Node a -> Node a
-}

loopSize :: Eq a => Node a -> Int
loopSize start = checkLoop 1 (tail chain)
  where chain = iterate next start
        checkLoop k xs = let (dropped, candidate) = break (== (head xs)) chain
                             size = k - (length dropped) in
                         if (size > 0) && isLoop size candidate xs
                         then size
                         else checkLoop (k+1) (tail xs)
        isLoop 0 _ _ = True
        isLoop size (x1:s1) (x2:s2) = (x1 == x2) && (isLoop (size-1) s1 s2)

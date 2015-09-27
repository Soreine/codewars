module CanYouGetTheLoop where
-- import CanYouGetTheLoop.Types
import Data.List (find)

data Node a
instance Eq a => Eq (Node a)

next :: Node a -> Node a
next = undefined
       
loopSize :: Eq a => Node a -> Int
loopSize start = checkLoop 1 (tail chain)
  where chain = iterate next start
        checkLoop k xs =
          let candidates = findCandidates (== (head xs)) k chain
          in case find (isLoop xs) candidates of
               Just (size, _) -> size
               Nothing -> checkLoop (k + 1) (tail xs)

        findCandidates :: (Eq a) => (a -> Bool) -> Int -> [a] -> [(Int, [a])]
        findCandidates _ 0 _ = []
        findCandidates predicate size s@(x:xs) =
          if predicate x
          then (size, s) : rest
          else rest
            where rest = findCandidates predicate (size - 1) xs

        isLoop _ (0, _) = True
        isLoop (x1:s1) (size, (x2:s2)) = x1 == x2 && isLoop s1 (size - 1, s2)

main =
  do hspec $ describe "loopChain" $
     do it "finds loop in list of 4 nodes" $
        do let
          node1 = Node 1 node2
          node2 = Node 2 node3
          node3 = Node 3 node4
          node4 = Node 4 node5
          node5 = Node 5 node6
          node6 = Node 6 node7
          node7 = Node 7 node8
          node8 = Node 8 node9
          node9 = Node 9 node10
          node10 = Node 10 node11
          node11 = Node 11 node12
          node12 = Node 12 node13
          node13 = Node 13 node14
          node14 = Node 14 node2
loopSize node1 `shouldBe` 3

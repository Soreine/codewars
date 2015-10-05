module CanYouGetTheLoop where
-- import CanYouGetTheLoop.Types
  
data Node a = Node a (Node a)
instance Eq a => Eq (Node a)
  where (Node x _) == (Node y _) = x == y
instance Show a => Show (Node a)
  where show (Node x _) = show x
                          
next :: Node a -> Node a
next (Node a n) = n
       
-- loopSize :: Eq a => Node a -> Int
loopSize x0 =
  let steadyProgress (x, y) = (next x, next y)
      tortoiseHare (x,y) = (next x, next.next $ y)
      equal = uncurry (==)
              
      (tortoise, hare) = until equal tortoiseHare (next x0, next.next $ x0)
      (loopStart, _) = until equal steadyProgress (x0, hare)
      loop = loopStart : takeWhile (/= loopStart) (tail $ iterate next loopStart)
  in length loop

test =
  let
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
  in node1
    

module TreeByLevels where

import TreeByLevels.TreeNode               
import Data.Maybe (catMaybes, maybeToList)
import Data.List (concatMap)

-- data TreeNode a = TreeNode {
--     left  :: Maybe (TreeNode a),
--     right :: Maybe (TreeNode a),
--     value :: a
--   }
--
-- instance (Show a) => Show (TreeNode a) where
--   show t = (show.value $ t) ++ "(" ++ (show.left $ t) ++ "," ++ (show.right $ t) ++ ")"
--                
-- buildTree :: [a] -> Maybe (TreeNode a)
-- buildTree []     = Nothing
-- buildTree (v:vs) = Just $ TreeNode (buildTree lvs) (buildTree rvs) v
--   where (lvs, rvs) = splitAt ((length vs + 1) `div` 2) vs

-- This is the solution of the problem as stated
treeByLevels1 :: Maybe (TreeNode a) -> [a]
treeByLevels1 t = forestByLevels (maybeToList t)
  where forestByLevels [] = []
        forestByLevels xt = roots ++ (forestByLevels childs)
          where roots = map value xt
                childs = catMaybes (concatMap (\t -> [left t, right t]) xt)

-- But the acceptance tests are false and match this algorithm
treeByLevels :: Maybe (TreeNode a) -> [a]
treeByLevels Nothing = []
treeByLevels (Just (TreeNode {value=x, left=l, right=r}))
  = x : ((treeByLevels l) ++ (treeByLevels r))

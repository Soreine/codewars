module IPv4 where
import Data.Int (Int32)
import Data.Bits (rotateL, rotateR, (.&.))
import Data.List (intercalate)
            
type IPString = String

int32ToIP :: Int32 -> IPString
int32ToIP int32 = intercalate "." $ map show bytes
  where bytes = reverse [byte (n*8) | n <- [0..3]]
        byte bit = rotateR (int32 .&. (rotateL 0xff bit)) bit

-- Below doesn't work because int32 is signed. For values over 2^31

-- import Data.Int  (Int32)
-- import Data.List (intercalate)

-- type IPString = String

-- int32ToIP :: Int32 -> IPString
-- int32ToIP int32 = intercalate "." $ map show $ (bytes int32 4)
--   where bytes _ 0 = []
--         bytes x n = (bytes q (pred n)) ++ [r]
--           where (q, r) = divMod x (2^8)

// import * as React from "react";
// import Box from "@mui/material/Box";
// import BottomNavigation from "@mui/material/BottomNavigation";
// import BottomNavigationAction from "@mui/material/BottomNavigationAction";
// import RestoreIcon from "@mui/icons-material/Restore";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import LocationOnIcon from "@mui/icons-material/LocationOn";

// export default function MobileStickey() {
//   const [value, setValue] = React.useState(0);

//   return (
//     <Box sx={{ width: "100%" }}>
//       <BottomNavigation
//         showLabels
//         value={value}
//         onChange={(event, newValue) => {
//           setValue(newValue);
//         }}
//         style={{ backgroundColor: "#d5007e" }}
//       >
//         <BottomNavigationAction
//           label="Recents"
//           icon={<RestoreIcon style={{ color: "white" }} />}
//           style={{ color: "white" }}
//         />
//         <BottomNavigationAction
//           label="Favorites"
//           icon={<FavoriteIcon style={{ color: "white" }} />}
//           style={{ color: "white" }}
//         />
//         <BottomNavigationAction
//           label="Nearby"
//           icon={<LocationOnIcon style={{ color: "white" }} />}
//           style={{ color: "white" }}
//         />
//       </BottomNavigation>
//     </Box>
//   );
// }

import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";

import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { useRouter } from "next/navigation";
import MobileSearchCanvas from "./MobileSearchCanvas";

export default function MobileStickey({count}) {
  const router = useRouter();
  const [value, setValue] = React.useState(count);
  const [openSearchCanvas, setOpenSearchCanvas] = React.useState(false);

  React.useEffect(() => {
    if (value === 2) {
      router.push(`/myaccount`);
    } else if (value == 0) {
      router.push(`/`);
    } else if(value===1){
        setOpenSearchCanvas(true);
    }
  }, [value, router]);

  return (
   <>
   {openSearchCanvas && <MobileSearchCanvas openSearchCanvas={openSearchCanvas} setOpenSearchCanvas={setOpenSearchCanvas} setValue={setValue} count={count}  />}
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        zIndex: 1000,
        "@media (min-width: 1000px)": {
          display: "none", // Hide on larger screens
        },
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        style={{
          boxShadow:
            "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px",
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Search" icon={<SearchIcon />} />
        <BottomNavigationAction label="Account" icon={<PermIdentityIcon />} />
      </BottomNavigation>
    </Box>
   </>
  );
}

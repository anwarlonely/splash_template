import React from 'react';
import SearchIcon from "@mui/icons-material/Search";
const inputClass = "flex-grow p-2 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-foreground rounded-l-lg transition-all duration-300";
const buttonClass = "bg-accent text-accent-foreground p-2 rounded-r-lg hover:bg-accent/80 transition-colors duration-300 flex items-center";

const SplashSearch = () => {
  return (
    <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden  transition-transform transform hover:scale-105">
      <input 
        type="text" 
        placeholder="Search for products..." 
        className={inputClass}
      />
      <button className={buttonClass} style={{backgroundColor:"#d5007e"}}>
        <SearchIcon style={{color:"white"}} />
      </button>
    </div>
  );
};

export default SplashSearch;

import { useTheme } from "../../hooks/useTheme";
import "./styles.scss";
import sun from "../../assets/img/sun.svg";
import moon from "../../assets/img/moon.svg";

export function Toggle() {
  const { theme, toggleTheme } = useTheme();

  return (

      <label htmlFor="themeInput">
        <input
          id="themeInput"
          type="checkbox"
          checked={theme === "light" ? false : true}
          onChange={toggleTheme}
        />

        {theme === "dark" ? (
          <img src={sun} alt="sol" />
        ) : (
          <img src={moon} alt="Lua" />
        )}
      </label>
   
  );
}

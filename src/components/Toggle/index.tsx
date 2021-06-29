import { useTheme } from "../../hooks/useTheme";
import './styles.scss'

export function Toggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme">
     
      <input
          id="themeInput"
          type="checkbox"
          checked={theme === "light" ? false : true}
          onChange={toggleTheme}
      />
       <label htmlFor="themeInput">
        theme
       
      </label>
    </div>
  );
}

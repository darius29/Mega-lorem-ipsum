import { Layers3 } from "lucide-react";
import "./Header.scss";

function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <Layers3 className="header__icon" size={30} aria-hidden="true" />
        <h1 className="header__title"> Mega Lorem Ipsum</h1>
      </div>
    </header>
  );
}

export default Header;

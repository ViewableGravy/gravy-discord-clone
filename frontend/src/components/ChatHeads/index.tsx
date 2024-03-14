import "./ChatHeads.scss";

type TChatHeads = React.FC<{
  children: React.ReactNode;
}>

export const ChatHeads: TChatHeads = ({ children }) => {


  return (
    <div className="ChatHeads">
        <div className="ChatHeads__icon">
          {children}
        </div>
        <div className="ChatHeads__selected"></div>
    </div>
  );
}

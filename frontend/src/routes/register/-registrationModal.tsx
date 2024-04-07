/***** BASE IMPORTS *****/
import classNames from "classnames"

/***** SHARED *****/
import { Modal } from "../../components/modal"

/***** UTILITIES *****/
import { useMatchMedia } from "../../utilities/hooks/useMatchMedia"
import { useAppViewport } from "../../utilities/hooks/useMedia"

/***** CONSTS *****/
import background from '../../assets/login-background.svg';

/***** COMPONENT START *****/
export const RegistrationModal = ({ children }: { children: React.ReactNode }) => {
  /***** HOOKS *****/
  const isMobile = useMatchMedia({ max: 510 })
  const isTiny = useAppViewport(['xs'])

  /***** RENDER *****/
  return (
    <Modal 
      isOpen 
      fade={{ modal: false, content: !isMobile }} 
      className={classNames('Register', { 
        "Register--mobile": isMobile, 
        "Register--tiny": isTiny
      })}
      background={(
        <img 
          src={background} 
          alt="background" 
          style={{ height: '100%', width: '100%', userSelect: "none" }} 
        />
      )}
    >
      {children}
    </Modal>
  )
}

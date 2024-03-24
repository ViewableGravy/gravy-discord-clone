/***** SHARED *****/
import { Flex } from "../../../components/utility/flex"
import { Padding } from "../../../components/utility/padding"
import { Text } from "../../../components/utility/text"

/***** CONSTS *****/
import './_QrCode.scss';

/***** COMPONENT START *****/
export const QRCode = () => {
  /***** RENDER HELPERS *****/
  const classes = {
    outer: "QRCode",
    placeholder: "QRCode__placeholder",
  }
  
  /***** RENDER *****/
  return (
    <div className={classes.outer}>
      <Flex column align="center">
        <Padding margin top={30} bottom={30}>
          <div className={classes.placeholder}></div>
        </Padding>
        <Padding margin bottom={8}>
          <Text xxxl primary semiBold>
            Log in with QR Code
          </Text>
        </Padding>
        <Text lg secondary align-center>
          Scan this with the <Text lg span secondary semiBold>Discord mobile app</Text> to log in instantly.
        </Text>
      </Flex>
    </div>
  )
}
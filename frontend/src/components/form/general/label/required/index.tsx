/***** BASE IMPORTS *****/
import React from "react"

/***** SHARED *****/
import { Text } from "../../../../utility/text";

/***** TYPE DEFINITIONS *****/
type TRequired = React.FC<{
  label: string;
  uppercase?: boolean;
}>

/***** COMPONENT START *****/
export const _Required: TRequired = ({ label, uppercase }) => (
  <Text span sm bold uppercase={uppercase}>
    {label} <Text error span>*</Text>
  </Text>
)
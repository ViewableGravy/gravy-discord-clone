import { createRouteCallback } from "../../models/base";
import { STATUS } from "../../models/status";

export const aliveRoute = createRouteCallback(({ builder }) => {
  return builder({ 
    status: STATUS.SUCCESS,
    data: "alive", 
  });
})
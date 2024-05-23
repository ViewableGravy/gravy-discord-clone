/***** BASE IMPORTS *****/
import axios from "axios";
import { createMiddlewareCallback } from "../models/base";

/***** CONSTS *****/
const secret = process.env.SECRET_KEY;

export const captchaMiddleware = createMiddlewareCallback(async ({ req, next, builder }) => {
  const { captchaToken } = req.body;
  if (!captchaToken) {
    return builder({
      status: 400,
      data: 'Captcha token is required'
    });
  }
  
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captchaToken}`;
  const headers = { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" };

  axios.post(verificationURL, { headers }).then(({ data }) => {
    if (!data?.success) {
      return builder({
        status: 400,
        data: 'Captcha token is invalid'
      });
    }
    
    return next();
  }).catch(() => {
    return builder({
      status: 500,
      data: 'An error occurred while validating captcha token'
    });
  });

});
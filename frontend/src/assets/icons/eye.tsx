
export const EyeIcon = ({ color, ...intrinsic }: React.SVGProps<SVGSVGElement>) => (
  // <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...intrinsic}>
  //   <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
  //   <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  // </svg>
  <svg xmlns="http://www.w3.org/2000/svg" id="🔍-System-Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" height={20} style={{ width: 22 }} {...intrinsic}>
    <svg id="ic_fluent_eye_show_24_regular" fill={color ?? '#f2f3f5'} fillRule="nonzero">
      <path d="M12,9.0046246 C14.209139,9.0046246 16,10.7954856 16,13.0046246 C16,15.2137636 14.209139,17.0046246 12,17.0046246 C9.790861,17.0046246 8,15.2137636 8,13.0046246 C8,10.7954856 9.790861,9.0046246 12,9.0046246 Z M12,10.5046246 C10.6192881,10.5046246 9.5,11.6239127 9.5,13.0046246 C9.5,14.3853365 10.6192881,15.5046246 12,15.5046246 C13.3807119,15.5046246 14.5,14.3853365 14.5,13.0046246 C14.5,11.6239127 13.3807119,10.5046246 12,10.5046246 Z M12,5.5 C16.613512,5.5 20.5960869,8.65000641 21.7011157,13.0643865 C21.8017,13.4662019 21.557504,13.8734775 21.1556885,13.9740618 C20.7538731,14.0746462 20.3465976,13.8304502 20.2460132,13.4286347 C19.3071259,9.67795854 15.9213644,7 12,7 C8.07693257,7 4.69009765,9.68026417 3.75285786,13.4331499 C3.65249525,13.8350208 3.24535455,14.0794416 2.84348365,13.979079 C2.44161275,13.8787164 2.19719198,13.4715757 2.29755459,13.0697048 C3.4006459,8.65271806 7.38448293,5.5 12,5.5 Z" id="🎨-Color">
      </path>
    </svg>
  </svg>
);


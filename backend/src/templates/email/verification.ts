
type TVerificationEmail = (props: {
  verificationToken: string;
  username: string;
  email: string;
  displayName: string;
}) => string;

if (!Bun.env.FRONTEND_URL)
  throw new Error("FRONTEND_URL must be set in the .env file");

export const verificationEmail: TVerificationEmail = ({ verificationToken }) => String.raw`
  <html>
    <body>
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email address</p>
      <a href="${Bun.env.FRONTEND_URL}/verify/${verificationToken}">Verify Email</a>
    </body>
  </html>
`;

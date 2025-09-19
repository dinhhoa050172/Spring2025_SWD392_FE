import { userService } from "@src/services/userService.js";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import routes from "@src/router/index.js";
import { message } from "@utils/message.js";

export default function EmailVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const email = searchParams.get("email");
        const code = searchParams.get("code");

        const response = await userService.emailVerify(email, code);
        if (response) {
          // Wait a short time to show the verification message
          setTimeout(() => {
            navigate(routes.auth.login);
          }, 1500);
        } else {
          setError(message.VERIFY_ERROR);
          setVerifying(false);
          setTimeout(() => {
            navigate(routes.auth.login);
          }, 1500);
        }
      } catch (err) {
        setError(message.VERIFY_ERROR);
        console.error(err);
        setVerifying(false);
        setTimeout(() => {
          navigate(routes.auth.login);
        }, 1500);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div>
      {verifying ? (
        <div>Đang xác thực email...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          Email xác thực thành công, đang chuyển hướng đến trang đăng nhập...
        </div>
      )}
    </div>
  );
}

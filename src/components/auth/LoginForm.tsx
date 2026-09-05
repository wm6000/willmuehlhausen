import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import {
  Button,
  Checkbox,
  Field,
  fieldDescribedBy,
  Form,
  Icon,
  Input,
  Row,
  Stack,
  Text,
  VisuallyHidden,
} from "@/ui";
import { PASSWORD_MIN_LENGTH, emailError, passwordError, safeReturnTo } from "@/lib/credentials";
import { useSession } from "@/components/auth/SessionContext";

/** Where a sign-in lands when nothing sent the visitor to the login page. */
const DEFAULT_DESTINATION = "/profile";

const EMAIL_HINT = "The address you'd sign up with.";
const PASSWORD_HINT = `At least ${PASSWORD_MIN_LENGTH} characters.`;

type Step = "email" | "password";
type Errors = { email: string | null; password: string | null };

const NO_ERRORS: Errors = { email: null, password: null };

/**
 * Email first, then password — the shape strava.com uses, and the reason is that the
 * email is what decides which second step you get. Here that second step is always a
 * password; once accounts can be linked to a provider, it stops being.
 *
 * Errors appear on submit, then track every keystroke, so a field that has already
 * complained clears itself the moment it's fixed rather than at the next submit.
 */
export function LoginForm() {
  const { signIn } = useSession();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [reveal, setReveal] = useState(false);
  const [errors, setErrors] = useState<Errors>(NO_ERRORS);

  function changeEmail(value: string) {
    setEmail(value);
    if (errors.email !== null) {
      setErrors((current) => ({ ...current, email: emailError(value) }));
    }
  }

  function changePassword(value: string) {
    setPassword(value);
    if (errors.password !== null) {
      setErrors((current) => ({ ...current, password: passwordError(value) }));
    }
  }

  function submit() {
    if (step === "email") {
      const error = emailError(email);
      setErrors({ ...NO_ERRORS, email: error });
      if (error === null) {
        setStep("password");
      }
      return;
    }

    const error = passwordError(password);
    setErrors({ ...NO_ERRORS, password: error });
    if (error !== null) {
      return;
    }

    signIn(email, remember);
    // `navigate` returns a promise in react-router 7. Nothing here depends on the
    // navigation settling, so the result is explicitly discarded rather than ignored.
    void navigate(safeReturnTo(params.get("returnTo"), DEFAULT_DESTINATION), { replace: true });
  }

  return (
    <Stack gap={5} className="login">
      <Form name="login" onSubmit={submit} className="login__form">
        <Stack gap={4}>
          {step === "email" ? (
            <Field
              id="login-email"
              label="Email"
              error={errors.email}
              hint={EMAIL_HINT}
            >
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={changeEmail}
                autoComplete="username"
                placeholder="you@example.com"
                invalid={errors.email !== null}
                describedBy={fieldDescribedBy("login-email", EMAIL_HINT, errors.email)}
              />
            </Field>
          ) : (
            <Stack gap={4}>
              <Row justify="between" gap={3} className="login__identity">
                <Text size="sm" tone="muted">
                  {email}
                </Text>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep("email");
                    setErrors(NO_ERRORS);
                    setPassword("");
                  }}
                >
                  Change
                </Button>
              </Row>

              <Field
                id="login-password"
                label="Password"
                error={errors.password}
                hint={PASSWORD_HINT}
              >
                <Input
                  id="login-password"
                  type={reveal ? "text" : "password"}
                  value={password}
                  onChange={changePassword}
                  autoComplete="current-password"
                  // Step two replaces step one in place. Without this, focus falls back
                  // to the body and a keyboard or screen-reader user loses their place.
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  invalid={errors.password !== null}
                  describedBy={fieldDescribedBy("login-password", PASSWORD_HINT, errors.password)}
                  trailing={
                    <Button variant="ghost" size="icon" onClick={() => setReveal((value) => !value)}>
                      <Icon name={reveal ? "eyeOff" : "eye"} size={18} />
                      <VisuallyHidden>{reveal ? "Hide password" : "Show password"}</VisuallyHidden>
                    </Button>
                  }
                />
              </Field>

              <Checkbox id="login-remember" checked={remember} onChange={setRemember}>
                Remember me
              </Checkbox>
            </Stack>
          )}

          <Button type="submit" variant="primary" size="lg" className="ui-box--full">
            {step === "email" ? "Continue" : "Log in"}
            <Icon name="arrowRight" size={16} />
          </Button>
        </Stack>
      </Form>

      <Text size="sm" tone="subtle" prose>
        This is a mock session. Any valid email and a password of at least {PASSWORD_MIN_LENGTH}{" "}
        characters signs you in; nothing is checked, and nothing leaves this browser. Creating an
        account, resetting a password and connecting Strava all arrive with the real backend.
      </Text>
    </Stack>
  );
}

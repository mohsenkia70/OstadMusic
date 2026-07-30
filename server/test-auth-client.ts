// Run with: MOCK_API_PORT=4002 NEXT_PUBLIC_API_URL=http://localhost:4002/api/v1 npx tsx server/test-auth-client.ts
// Exercises the ACTUAL lib/api/client.ts + lib/store/auth-store.ts code (not a re-implementation),
// against a local mock server matching the exact contract the user provided.

import { useAuthStore } from "../lib/store/auth-store";
import { ApiError } from "../lib/api/types";

let failures = 0;
function assert(cond: boolean, label: string) {
  if (cond) {
    console.log(`PASS: ${label}`);
  } else {
    console.log(`FAIL: ${label}`);
    failures++;
  }
}

async function run() {
  console.log("--- valid credentials ---");
  const user = await useAuthStore.getState().login("mohsenkia70@gmail.com", "Adm@in123");
  assert(user.firstName === "محسن", "returned firstName parsed correctly");
  assert(user.role === "Teacher", "returned role parsed correctly");

  const state1 = useAuthStore.getState();
  assert(state1.accessToken === "mock.jwt.token", "accessToken stored in auth store");
  assert(state1.user?.userId === "a6957e27-58bd-4cc3-8717-1b2d973c79ac", "user stored in auth store");
  assert(state1.isTokenExpired() === false, "freshly issued token is not considered expired");

  useAuthStore.getState().logout();
  const state2 = useAuthStore.getState();
  assert(state2.accessToken === null && state2.user === null, "logout() clears the store");

  console.log("\n--- invalid credentials ---");
  try {
    await useAuthStore.getState().login("mohsenkia70@gmail.com", "wrong-password");
    assert(false, "invalid login should throw");
  } catch (err) {
    assert(err instanceof ApiError, "invalid login throws an ApiError");
    assert((err as ApiError).status === 401, "invalid login surfaces HTTP 401");
    console.log("  error message shown to user:", (err as Error).message);
  }
  const state3 = useAuthStore.getState();
  assert(state3.error !== null, "store.error is set after failed login");
  assert(state3.accessToken === null, "store has no token after failed login");

  console.log(`\n${failures === 0 ? "ALL TESTS PASSED" : failures + " TEST(S) FAILED"}`);
  process.exit(failures === 0 ? 0 : 1);
}

run();

import { test as base } from '@playwright/test';

type UserRole = 'VISITOR' | 'OWNER' | 'GOV-USER' | 'CARRIER';

interface AuthFixture {
  setAuth: (role: UserRole) => Promise<void>;
}

export const test = base.extend<AuthFixture>({
  setAuth: async ({ page }, use) => {
    async function setAuth(role: UserRole) {
      const mockToken = 'mock-token';
      const mockUser = { role, name: `Test ${role}` };
      await page.evaluate(({ token, user }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }, { token: mockToken, user: mockUser });
    }
    await use(setAuth);
  }
});

export { expect } from '@playwright/test';
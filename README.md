# Playwright TypeScript Framework

[![CI](https://github.com/dilshana-dasthakeer/playwright-typescript-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/dilshana-dasthakeer/playwright-typescript-framework/actions/workflows/ci.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.55-2EAD33)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![License: MIT](https://img.shields.io/badge/License-MIT-blue)

End-to-end UI and API test automation with Playwright and TypeScript. The project is organised the way I run automation on a real team: page objects behind fixtures, a login saved once and reused, tagged suites, four browser projects, and a pipeline that runs them all on every push.

It tests [Sauce Demo](https://www.saucedemo.com) for the UI and the [Restful Booker](https://restful-booker.herokuapp.com) API.

## What it shows

| Area | How it is done |
|---|---|
| **Design** | Page Object Model. Pages hold locators and actions, tests hold the assertions. |
| **Fixtures** | Page objects are injected into tests by name. No setup code in the tests. |
| **Fast, stable login** | A setup project signs in once and saves the session. UI tests start already signed in. |
| **Locators** | `getByRole` and `getByTestId`. No XPath, no fixed sleeps. Playwright's auto-waiting does the waiting. |
| **Cross-browser** | Chromium, Firefox, WebKit and an emulated Pixel 7. |
| **API testing** | A typed client and fixtures that create a booking before a test and delete it afterwards, even when the test fails. |
| **Suites** | `@smoke` for critical paths, `@regression` for everything, `@api` for API tests. |
| **Failures** | Screenshot, video and trace are kept on failure. The trace opens in Playwright's trace viewer. |
| **Retries** | Two in CI, none locally, so flaky tests show up while you develop. |
| **CI** | GitHub Actions: type check, then the API job and a UI matrix across four projects. HTML reports are uploaded as artifacts. Runs on push, pull request and nightly. |
| **AI-assisted testing** | See [docs/ai-workflow.md](docs/ai-workflow.md) for how AI helps find test gaps and draft tests, and what stays with a person. |

## Tech stack

TypeScript · Playwright Test · Node.js 20+ · GitHub Actions

## Project structure

```
.
├── playwright.config.ts      projects, reporters, retries, trace and screenshot settings
├── src/
│   ├── pages/                LoginPage, InventoryPage, CartPage, CheckoutPage
│   ├── fixtures/             index.ts (UI page objects), api.ts (client, token, booking)
│   ├── api/                  BookingClient and the response types
│   └── data/                 users and test tables, booking builder
├── tests/
│   ├── auth.setup.ts         signs in once and saves the session
│   ├── ui/                   login, inventory and checkout specs
│   └── api/                  booking API spec
├── docs/ai-workflow.md
└── .github/workflows/ci.yml
```

## Getting started

You need Node.js 20 or newer.

```bash
git clone https://github.com/dilshana-dasthakeer/playwright-typescript-framework.git
cd playwright-typescript-framework
npm install
npx playwright install --with-deps
```

```bash
npm test                    # everything: setup, four UI projects and the API tests
npm run test:smoke          # critical paths only
npm run test:regression     # full regression
npm run test:api            # API tests only, no browser needed
npm run test:chromium       # one browser
npm run test:headed         # watch it run
npm run test:debug          # step through with the Playwright inspector
npm run report              # open the last HTML report
npm run typecheck           # TypeScript check
```

Open a trace from a failed run with `npx playwright show-trace test-results/<test>/trace.zip`.

### Configuration

| Variable | Meaning | Default |
|---|---|---|
| `BASE_URL` | Address of the web app | `https://www.saucedemo.com` |
| `API_BASE_URL` | Address of the API | `https://restful-booker.herokuapp.com` |
| `CI` | Turns on retries, `forbidOnly` and the JUnit report | unset |

## Test coverage

| Area | Scenarios |
|---|---|
| **Login** | Valid login, five invalid-login cases from a data table, log out, protected page redirects when signed out |
| **Products and cart** | Product count, price and name sorting, cart badge on add and remove, cart contents |
| **Checkout** | End-to-end purchase, subtotal equals item prices, total equals subtotal plus tax, three form-validation cases |
| **Booking API** | Health check, bad credentials, list, create, read back, update with and without a token, delete, unknown id |

## Design decisions

- **Saved login state.** Signing in through the UI before every test is slow and adds a failure point. One setup test signs in and every UI project reuses that session. Login tests opt out and start signed out.
- **Tags on the setup test.** The setup step is tagged `@smoke` and `@regression` so that `--grep` does not filter it out and leave the UI tests without a session.
- **Tests clean up after themselves.** The `booking` fixture deletes what it created, so API runs can repeat and run in parallel.
- **The API's quirks are asserted, not hidden.** Restful Booker answers a health check and a delete with 201, and bad credentials with 200 plus a reason. The tests check that behaviour and say so in a comment.
- **No `waitForTimeout`.** Assertions such as `toHaveText` retry until they pass or time out.

## Adding a test

1. Add or extend a page object in `src/pages/`. Locators are private fields, actions are methods.
2. Write the spec in `tests/ui/` and request the page objects you need from the fixture.
3. Add a tag: `{ tag: '@regression' }`, plus `'@smoke'` if it guards a critical path.
4. Run `npm run test:chromium`.

## Author

**Dilshana Dasthakeer**, Senior Software QA Engineer, ISTQB CTFL.
[GitHub](https://github.com/dilshana-dasthakeer) · [Linktree](https://linktr.ee/Dilshana6)

Licensed under the MIT License.

# How AI is used in this project

I use an AI assistant as a testing aid, not as a replacement for judgment. This page describes the
workflow, what the AI does well, and where a person has to take over. It matches how I work on
enterprise projects.

## The workflow

1. **Start from the requirement.** I write down the behaviour in plain words: for example, "a user can
   add products to the cart, and the badge shows the count."
2. **Find test gaps.** I give the AI the requirement and my existing test list and ask what is missing:
   boundary values, error states, sorting, empty input, permissions. It returns a list of candidate
   scenarios.
3. **Review the list myself.** I remove scenarios that duplicate others or are not worth the run time, and
   I add risks only someone who knows the product would see.
4. **Draft the tests.** For the scenarios I keep, the AI drafts the Page Object methods and the test
   bodies in this project's style.
5. **Run, then read every line.** I run the draft against the real site, fix wrong locators, and rewrite
   weak assertions. A test is only added when I can explain what it proves and why it could fail.
6. **Check that the test can fail.** I break the behaviour on purpose, or point at wrong data, to see the
   test go red. A test that cannot fail has no value.

## What the AI is good for here

- Listing edge cases I might not think of on a busy day
- Drafting repetitive page-object code and data tables
- Turning a list of scenarios into the project's test structure
- Explaining an unfamiliar error or a flaky wait

## What stays with me

- **Which risks matter.** The AI does not know the business, the users or the release history.
- **Assertions.** Drafts often check that an element exists, not that the behaviour is correct. I tighten
  them to check values.
- **Locators and waits.** I prefer `getByRole` and `getByTestId`, and I avoid fixed sleeps. Drafts do not
  always follow that, so I review them.
- **Test data and cleanup.** The API tests create and delete their own bookings, so runs never depend on
  each other.
- **Secrets and company code.** None of it goes into a prompt.

## Example: finding gaps in the checkout flow

This shows the kind of exchange the workflow produces. Starting list, written by hand:

- A user can complete a purchase
- Missing first name shows an error

Scenarios an AI assistant typically suggests for a list like this, and the decision I make for each:

| Suggested scenario | Decision |
|---|---|
| Missing last name shows an error | Keep. Added to the data table in `src/data/users.ts` |
| Missing postal code shows an error | Keep. Same table |
| Subtotal equals the sum of item prices | Keep. It catches pricing bugs, which are costly |
| Total equals subtotal plus tax | Keep |
| Checkout with an empty cart | Check the requirement first. Add a test only if the product has a rule for it |
| Very long names | Skip unless a length limit is stated |

## Limits

AI output is a draft. It can be wrong, outdated or confident about things that do not exist. Tests are
reviewed by a person and must pass in CI before they are merged.

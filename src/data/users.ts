/** Public demo accounts published on the Sauce Demo login page. */
export const PASSWORD = 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password: PASSWORD },
  lockedOut: { username: 'locked_out_user', password: PASSWORD },
  problem: { username: 'problem_user', password: PASSWORD },
} as const;

export const invalidLogins = [
  {
    description: 'locked out user',
    username: users.lockedOut.username,
    password: PASSWORD,
    error: 'Epic sadface: Sorry, this user has been locked out.',
  },
  {
    description: 'wrong password',
    username: users.standard.username,
    password: 'not_the_password',
    error: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    description: 'unknown user',
    username: 'no_such_user',
    password: PASSWORD,
    error: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    description: 'empty username',
    username: '',
    password: PASSWORD,
    error: 'Epic sadface: Username is required',
  },
  {
    description: 'empty password',
    username: users.standard.username,
    password: '',
    error: 'Epic sadface: Password is required',
  },
] as const;

export const checkoutErrors = [
  { description: 'missing first name', first: '', last: 'Dasthakeer', zip: '20000', error: 'Error: First Name is required' },
  { description: 'missing last name', first: 'Dilshana', last: '', zip: '20000', error: 'Error: Last Name is required' },
  { description: 'missing postal code', first: 'Dilshana', last: 'Dasthakeer', zip: '', error: 'Error: Postal Code is required' },
] as const;

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  onesie: 'Sauce Labs Onesie',
} as const;

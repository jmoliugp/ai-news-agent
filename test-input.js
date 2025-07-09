import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Testing user input...');

rl.question('Type something: ', answer => {
  console.log(`You typed: ${answer}`);
  rl.close();
  process.exit(0);
});

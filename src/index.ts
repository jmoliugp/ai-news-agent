const main = async (): Promise<void> => {
  console.log('Hello, TypeScript!');
};

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

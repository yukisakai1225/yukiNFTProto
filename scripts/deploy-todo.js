const hre = require("hardhat");

async function main() {
  const Todo = await hre.ethers.getContractFactory("todo");
  const todo = await Todo.deploy();
  await todo.deployed();
  console.log("Todo deployed to:", todo.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

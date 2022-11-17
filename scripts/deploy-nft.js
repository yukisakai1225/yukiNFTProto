const hre = require("hardhat");

async function main() {
  const YukiNFT = await hre.ethers.getContractFactory("yukiNFT");
  const nft = await YukiNFT.deploy();
  await nft.deployed();
  console.log("Nft deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

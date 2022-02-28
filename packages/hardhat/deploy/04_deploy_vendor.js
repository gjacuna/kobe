// deploy/01_deploy_vendor.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // You might need the previously deployed yourToken:
  // const koyweToken = await ethers.getContract("KoyweToken", deployer);

  // Todo: deploy the vendor

  await deploy("BCTVendor", {
    from: deployer,
    args: ["0x2f800db0fdb5223b3c3f354886d907a671414a7f"], // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    log: true,
  });

  const vendor = await ethers.getContract("BCTVendor", deployer);

//  // Todo: transfer the tokens to the vendor
//  console.log("\n 🏵  Sending all 999999900 tokens left to the vendor...\n");

//  const transferTransaction = await koyweToken.transfer(
//    vendor.address,
//    ethers.utils.parseEther("999999900")
//  );

//   // console.log("\n    ✅ confirming...\n");
//   await sleep(5000); // wait 5 seconds for transaction to propagate

  // console.log("\n 🤹  Sending ownership to frontend address...\n")
  // const ownershipTransaction = await vendor.transferOwnership("0x40f9bf922c23c43acdad71Ab4425280C0ffBD697" );
  // console.log("\n    ✅ confirming...\n");
  // const ownershipResult = await ownershipTransaction.wait();

  // ToDo: Verify your contract with Etherscan for public chains
  // if (chainId !== "31337") {
  //   try {
  //     console.log(" 🎫 Verifing Contract on Etherscan... ");
  //     await sleep(5000); // wait 5 seconds for deployment to propagate
  //     await run("verify:verify", {
  //       address: vendor.address,
  //       contract: "contracts/BCTVendor.sol:BCTVendor",
  //       constructorArguments: ["0x2f800db0fdb5223b3c3f354886d907a671414a7f"],
  //     });
  //   } catch (error) {
  //     console.log("⚠️ Contract Verification Failed: ", error);
  //   }
  // }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.tags = ["BCTVendor"];

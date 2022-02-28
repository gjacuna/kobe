// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  //const koyweToken = await ethers.getContract("KoyweToken", deployer);

  await deploy("KoyweCollectibles", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [ "0x2F800Db0fdb5223b3C3f354886d907A671414A7F"],
    log: true,
    waitConfirmations: 5,
  });

  

  // Getting a previously deployed contract
  const KoyweCollectibles = await ethers.getContract("KoyweCollectibles", deployer);

  // console.log("\n 🤹  Sending ownership to frontend address...\n")
  // const ownershipTransaction = await KoyweCollectibles.transferOwnership("0x40f9bf922c23c43acdad71Ab4425280C0ffBD697" );
  // console.log("\n    ✅ confirming...\n");
  // const ownershipResult = await ownershipTransaction.wait();

  /*  await YourContract.setPurpose("Hello");
  
    To take ownership of yourContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
    // await yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  if (chainId !== "31337") {
    try {
      console.log(" 🎫 Verifing Contract on Etherscan... ");
      await sleep(5000); // wait 5 seconds for deployment to propagate
      await run("verify:verify", {
        address: KoyweCollectibles.address,
        contract: "contracts/KoyweCollectibles.sol:KoyweCollectibles",
        constructorArguments: ["0x2F800Db0fdb5223b3C3f354886d907A671414A7F"],
      });
    } catch (error) {
      console.log("⚠️ Contract Verification Failed: ", error);
    }
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.tags = ["KoyweCollectibles"];

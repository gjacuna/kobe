import { useEffect, useState } from "react";
import { Button, Card, Input, Space } from "antd";
import {
  Balance,
  TokenBalance,
} from ".";
import {
  useContractReader,
} from "eth-hooks";
import { HOOK_OPTIONS } from "../constants";

const { ethers } = require("ethers");

export default function KoyweTreeMint({address, readContracts, writeContracts, tx, loadWeb3Modal}) {

  const treeAddress = readContracts && readContracts.KoyweCollectibles && readContracts.KoyweCollectibles.address;
  console.log("treeAddress",treeAddress);

  const mintPrice = useContractReader(readContracts, "KoyweCollectibles", "bctPrice", HOOK_OPTIONS);
  const isOpen = useContractReader(readContracts, "KoyweCollectibles", "mintOpen", HOOK_OPTIONS);

  console.log("mintPrice",mintPrice);

  const [isBCTAmountApproved, setIsBCTAmountApproved] = useState();

  const vendorApproval = useContractReader(readContracts, "PBCT", "allowance", [
    address, treeAddress
  ], HOOK_OPTIONS);
  console.log("vendorApproval",vendorApproval);

  useEffect(()=>{
    setIsBCTAmountApproved(vendorApproval && mintPrice && vendorApproval.gte(mintPrice))
  },[vendorApproval])

  const [buying, setBuying] = useState();
  const [approving, setApproving] = useState();

  return (
    <>
      <Space>
        <div style={{ padding: 8 }}>
          <div>Your BCT Balance:</div>
          <TokenBalance contracts = {readContracts} name = {"PBCT"} address = {address} /> BCT
        </div>
      </Space>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        {address && isOpen ?
        <>
          <Button
            loading={approving}
            onClick={async () => {
              setApproving(true);
              await tx(writeContracts.PBCT.approve(readContracts.KoyweCollectibles.address, mintPrice));
              setApproving(false);
            }}
            disabled={isBCTAmountApproved?true:false}
          >
            Approve BCT
          </Button>
          <Button
            loading={buying}
            onClick={async () => {
              setBuying(true);
              await tx(writeContracts.KoyweCollectibles.mintItem());
              setBuying(false);
            }}
            disabled={isBCTAmountApproved?false:true}
          >
            MINT for {mintPrice && ethers.utils.formatEther(mintPrice)} BCT
          </Button>
        </>
        :
        <>
          {isOpen ? 
          <Button type={"primary"} onClick={loadWeb3Modal}>CONNECT WALLET</Button>
          :
          <Button type={"primary"} disabled>NO MORE TREES TO MINT</Button>
          }
        </>
        }

      </div>
    </>
  );
}
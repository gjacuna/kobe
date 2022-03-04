import { CreditCardOutlined } from "@ant-design/icons";
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";
import { Button, Tooltip } from "antd";
import React, { useState } from "react";

// added display of 0 if price={price} is not provided

/*
  ~ What it does? ~

  Displays current ETH price and gives options to buy ETH through Wyre/Ramp/Coinbase
                            or get through Rinkeby/Ropsten/Kovan/Goerli

  ~ How can I use? ~

  <Ramp
    price={price}
    address={address}
  />

  ~ Features ~

  - Ramp opens directly in the application, component uses RampInstantSDK
  - Provide price={price} and current ETH price will be displayed
  - Provide address={address} and your address will be pasted into Wyre/Ramp instantly
*/

export default function Ramp(props) {
  const [modalUp, setModalUp] = useState("down");

  const type = "default";

  return (
    <div>
      <Tooltip title="Fund your wallet with cash">
        <Button
          size="large"
          shape="round"
          onClick={() => {
            new RampInstantSDK({
              hostAppName: "Koywe",
              hostLogoUrl: "https://scaffoldeth.io/scaffold-eth.png",
              // swapAmount: "100000000000000000", // 0.1 ETH in wei  ?
              defaultAsset: "MATIC_ETH",
              swapAsset: "MATIC_ETH,MATIC",
              userAddress: props.address,
            })
              .on("*", event => console.log(event))
              .show();
          }}
        >
          <CreditCardOutlined style={{ color: "#52c41a" }} />{" "}
          Fund Account
        </Button>
      </Tooltip>
    </div>
  );
}

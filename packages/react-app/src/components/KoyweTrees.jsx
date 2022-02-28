import { Card, List } from 'antd';
import { useState, useEffect } from "react";

export default function Trees(props) {
  const readContracts = props.readContracts;

  const [yourCollectibles, setYourCollectibles] = useState();
  useEffect(() => {
    const updateYourCollectibles = async () => {
      const collectibleUpdate = [];
      for (let tokenIndex = 0; tokenIndex < props.yourKTBalance; tokenIndex++) {
        try {
          console.log("GEtting token index", tokenIndex);
          const tokenId = await readContracts.KoyweCollectibles.tokenOfOwnerByIndex(props.address, tokenIndex);
          console.log("tokenId", tokenId);
          const tokenURI = await readContracts.KoyweCollectibles.tokenURI(tokenId);
          const jsonManifestString = atob(tokenURI.substring(29))
          console.log("jsonManifestString", jsonManifestString);
          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            console.log("jsonManifest", jsonManifest);
            collectibleUpdate.push({ id: tokenId, uri: tokenURI, owner: props.address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }

        } catch (e) {
          console.log(e);
        }
      }
      setYourCollectibles(collectibleUpdate.reverse());
    };
    updateYourCollectibles();
  }, [props.address, props.yourKTBalance]);
  
  return (
    <div style={{ width: 900, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <List
        grid={3}
        bordered
        dataSource={yourCollectibles}
        renderItem={item => {
          const id = parseInt(item.id,16);
          const name = item.name;
          return (
            <List.Item key={id}>
              <Card
                title={
                  <div>
                    <span style={{ fontSize: 16, marginRight: 8 }}>{name}</span>
                  </div>
                }
              >
                <div>
                  <a href={item.external_url} target="_blank">
                    <img src={item.image} style={{ maxWidth: 150 }} />
                  </a>
                </div>
                <div style={{ maxWidth: 150 }}>{item.description}</div>
              </Card>
            </List.Item>
          );
        }}
    />
  </div>
  );
}
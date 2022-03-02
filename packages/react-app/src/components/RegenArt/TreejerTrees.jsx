import React, { useEffect, useState } from 'react'
import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { Card, List } from 'antd'

const APIURL = 'https://api.thegraph.com/subgraphs/name/treejer/treejer-subgraph'
const TREEJER_BASE_URL = 'https://api.treejer.com/trees/'

const TreejerTrees = ({ address }) => {
  const tokensQuery = `
    {
      trees(first: 100, skip: 0, where:{ owner: "${address.toLowerCase()}" }, orderBy: "createdAt", orderDirection: "asc")
      {
          id
          createdAt
      }
    }
  `

  const [treejerCollection, setTreejerCollection] = useState([])

  useEffect(() => {
    async function getTreejerCollection() {
      if (address) {
        const client = new ApolloClient({
          uri: APIURL,
          cache: new InMemoryCache(),
        })
        const queryResult = await client
          .query({
            query: gql(tokensQuery),
          })
          .then(data => {
            data.data.trees.forEach(async tree => {
              const tree_id = parseInt(tree.id, 16)

              try {
                const jsonResponse = await fetch(TREEJER_BASE_URL + tree_id)
                const json = await jsonResponse.json()

                if (data.data.trees.length >= treejerCollection.length)
                  setTreejerCollection(treejerCollection => [...treejerCollection, json])
              } catch (e) {
                console.log(`Error loading Treejer json. ${e}`)
              }
            })
          })
          .catch(err => {
            console.log('Error fetching data: ', err)
          })
      }
    }

    getTreejerCollection()
  }, [address, tokensQuery, treejerCollection.length])

  // console.log(treejerCollection);

  return (
    <div style={{ width: 900, margin: 'auto', marginTop: 32, paddingBottom: 32 }}>
      <List
        grid={3}
        bordered
        dataSource={treejerCollection}
        renderItem={item => {
          const id = parseInt(item.id, 16)
          const { name } = item

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
                <div>{item.description ? item.description : name}</div>
              </Card>
            </List.Item>
          )
        }}
      />
    </div>
  )
}

export default TreejerTrees

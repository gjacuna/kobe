import { Link } from 'react-router-dom'
import { Image, Row, Table, Typography } from 'antd'
import styled from 'styled-components'

import { StyledButton } from '../common/StyledButton'

const { Text } = Typography
const StyledTable = styled(Table)`
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
`
const milesPipe = n => {
  const locale = 'en-US'

  if (typeof n === 'string') {
    const ns = n.replace(/\s/g, '')

    return parseFloat(ns).toLocaleString(locale)
  }

  return n.toLocaleString(locale)
}
const getData = (contracts, USDPrices) => {
  return [
    {
      key: '1',
      token: {
        title: 'BCT',
        icon: 'icon/toucan.svg',
      },
      tvl: '20k',
      potential: '28,325%',
      contract: {
        title: contracts.PBCT.address,
        url: contracts.PBCT.address,
      },
      co2: milesPipe('4000'),
      website: 'website1.com',
      value: `${USDPrices['toucan-protocol-base-carbon-tonne']?.usd} USD`,
      buy: {
        title: 'Buy me',
      },
    },
    {
      key: '2',
      token: {
        title: 'MOSS',
        icon: 'icon/moss.svg',
      },
      tvl: '102',
      potential: 'N/A %',
      contract: {
        title: contracts.PMCO2.address,
        url: contracts.PMCO2.address,
      },
      co2: '23',
      website: 'website1.io',
      value: `${USDPrices['moss-carbon-credit']?.usd} USD`,
      buy: {
        title: 'Buy me',
      },
    },
    {
      key: '3',
      token: {
        title: 'KLIMA',
        icon: 'icon/klima.svg',
      },
      tvl: '4235K',
      potential: '28,325%',
      contract: {
        title: contracts.KLIMA.address,
        url: contracts.KLIMA.address,
      },
      co2: milesPipe(1246),
      website: 'website1.eco',
      value: `${USDPrices['klima-dao']?.usd} USD`,
      buy: {
        title: 'Buy me',
      },
    },
  ]
}

export const TableToken = ({ contracts, USDPrices }) => {
  const columns = [
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
      render: tokenProp => (
        <Row justify="space-between" align="middle">
          <Text>{tokenProp.title}</Text>
          <Image src={tokenProp.icon} preview={false} height={42} />
        </Row>
      ),
    },
    {
      title: 'TVL',
      dataIndex: 'tvl',
      key: 'tvl',
    },
    {
      title: 'Potential yield',
      dataIndex: 'potential',
      key: 'potential',
    },
    {
      title: 'Contract',
      dataIndex: 'contract',
      key: 'contract',
      render: contract => (
        <Row justify="space-between" align="middle">
          <Text>{contract.title}</Text>
          <Link to={`/${contract.url}`}>
            <Image src="icon/leave.svg" preview={false} height={24} />
          </Link>
        </Row>
      ),
    },
    {
      title: 'CO2 Value (tons)',
      dataIndex: 'co2',
      key: 'co2',
    },
    {
      title: 'Official website',
      dataIndex: 'website',
      key: 'website',
    },
    {
      title: 'Value (USD)',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Buy token',
      dataIndex: 'buy',
      key: 'buy',
      render: props => <StyledButton $type="primary">{props.title}</StyledButton>,
    },
  ]
  const data = getData(contracts, USDPrices)

  return <StyledTable columns={columns} dataSource={data} pagination={false} />
}
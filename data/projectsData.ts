interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'A Token Bulk Sender',
    description: `A tool that allow users to bulk send tokens in few minutes with low fees.`,
    imgSrc: '/static/images/token-bulk-sender-1.png',
    href: 'https://www.bulksendtokens.xyz',
  },
  {
    title: 'Ethereum Wallet',
    description: `A simple Ethereum wallet that allow users to send, receive, swap and airdrop tokens.`,
    imgSrc: '/static/images/x-wallet-1.png',
    href: 'https://codecanyon.net/item/xwallet-an-airdrop-ethereum-wallet/50663324',
  },
]

export default projectsData

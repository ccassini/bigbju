import { writeContract } from '@wagmi/core'
import { config, chains } from './web3'
import { leaderboardABI } from './contract' // імпортуємо ABI
import { getAccount } from '@wagmi/core'

export async function submitScore(score: number) {
  const account = getAccount()
  if (!account?.address) {
    throw new Error('Гаманець не підключений')
  }

  const { hash } = await writeContract(config, {
    address: '0x2f057a0e5d2d539161085f9aa665a46380869c39', // ← адреса твого контракту
    abi: leaderboardABI,
    functionName: 'submitScore',
    args: [BigInt(score)],
    account: account.address,
    chainId: chains[0].id,
  })

  console.log('Tx Hash:', hash)
  return hash
}

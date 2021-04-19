import { BlindnetSdk } from './index'
import { str2ab } from './helper'

export async function asd(n: number) {
  if (n == 0) return
  else if (n % 2 == 0) await test(true)
  else await test(false)
  return asd(n - 1)
}

async function test(swap: boolean = false) {
  const jwt1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMCIsImhvdGV0SWQiOiJob3RlbDAiLCJpYXQiOjE1MTYyMzkwMjJ9.4KCp00fun1Drhh0QeuDkn-GEIm3XNZVS8hZMGSFMEGU"
  const jwt2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImhvdGV0SWQiOiJob3RlbDAiLCJpYXQiOjE1MTYyMzkwMjJ9.SWD8ihR-QJDcvBvBWjzrOKrGNTUd2ZSkIIlr2Il4WkA"
  const otjwt1 = ""
  let pass1a = 'pass1'
  let pass1b = 'fjsdlkjflkds'
  let pass2a = 'asd'
  let pass2b = 'fjsldjflkds'

  // if (swap) {
  //   let temp: string = undefined
  //   temp = pass1a
  //   pass1a = pass1b
  //   pass1b = temp
  // }

  console.log('STARTING')

  let { blindnetPassphrase: derived1a } = await BlindnetSdk.derivePasswords(pass1a)
  let { blindnetPassphrase: derived2a } = await BlindnetSdk.derivePasswords(pass2a)

  let blindnet = BlindnetSdk.init(jwt1)
  await blindnet.initUser(derived1a)
  console.log('initialized user 1')
  await blindnet.initUser(derived1a)
  console.log('loaded user 1')
  await blindnet.initUser(derived1a)
  console.log('loaded user 1 again')

  // blindnet = BlindnetSdk.init(jwt2)
  // await blindnet.initUser(pass2a)
  // console.log('initialized user 2')

  blindnet = BlindnetSdk.init(otjwt1)
  console.log('started unregistered user')

  const encData = await blindnet.encrypt(str2ab('sup bro?'), str2ab('{ "name": "asd" }'))
  console.log('encrypted', encData)

  blindnet = BlindnetSdk.init(jwt1)
  await blindnet.initUser(derived1a)
  console.log('user 1 loaded')
  const decData = await blindnet.decrypt(encData.dataId, encData.encryptedData, encData.encryptedMetadata)
  console.log("data:        ", String.fromCharCode.apply(null, new Uint16Array(decData.data)))
  console.log("metadata:    ", JSON.parse(String.fromCharCode.apply(null, new Uint16Array(decData.metadata))))

  blindnet = BlindnetSdk.init(jwt2)
  await blindnet.initUser(derived2a)
  console.log('initialized user 2')

  blindnet = BlindnetSdk.init(jwt1)
  await blindnet.initUser(derived1a)
  console.log('user 1 loaded')

  await blindnet.giveAccess('user1')
  console.log('gave access to user 2')

  blindnet = BlindnetSdk.init(jwt2)
  await blindnet.initUser(derived2a)
  console.log('user 2 loaded')
  const decData2 = await blindnet.decrypt(encData.dataId, encData.encryptedData, encData.encryptedMetadata)
  console.log("data:        ", String.fromCharCode.apply(null, new Uint16Array(decData.data)))
  console.log("metadata:    ", JSON.parse(String.fromCharCode.apply(null, new Uint16Array(decData.metadata))))

  // await blindnet.updatePassphrase(pass1b)
  // console.log('user 1 pass updated')

  console.log('\n\n')
}
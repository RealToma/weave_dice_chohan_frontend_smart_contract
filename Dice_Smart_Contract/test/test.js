/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
// test/Rematic.proxy.js
// Load dependencies
const { expect } = require('chai')
const { BigNumber } = require('ethers')

let DiseContract
let DiseFactory

// Start test block
describe('Dice Test', function () {
  beforeEach(async function () {
    DiseFactory = await ethers.getContractFactory('Dice')
    DiseContract = await DiseFactory.deploy()
  })

  // Test case
  it('Contract works correctly.', async function () {
    // eslint-disable-next-line prettier/prettier
    const [
      owner,
    ] = await ethers.getSigners()


    let tx = await DiseContract.connect(owner).test()
    await tx.wait()
    const r1 = await DiseContract.connect(owner).random(6)
    console.log(r1)
    tx = await DiseContract.connect(owner).test()
    await tx.wait()
    const r2 = await DiseContract.connect(owner).random(6)
    console.log(r2)
    tx = await DiseContract.connect(owner).test()
    await tx.wait()
    const r3 = await DiseContract.connect(owner).random(6)
    console.log(r3)
  })
})

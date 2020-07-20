const {caluclatetip,fharenate,celsius}=require('../src/math');
const { TestScheduler } = require('jest');


test('caliculate tip',()=>{
    const total=caluclatetip(10,.3)
    expect(total).toBe(13)
})
test('fherent',()=>{
    const fh=fharenate(32)
    expect(fh).toBe(0)
})
test('celisus',()=>{
    const celi=celsius(0);
    expect(celi).toBe(32)
})
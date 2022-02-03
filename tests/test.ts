import { Rest } from "../packages/rest";

var r = new Rest({})
r.setToken('faketoken')
r.request({method: 'GET', fullroute: '/gateway/bot'}).then(async rs => {
  console.log(await rs.json())
})
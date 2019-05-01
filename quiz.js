let Fernet = require('fernet');

let secret = new Fernet.Secret('TluxwB3fV_GWuLkR1_BzGs1Zk90TYAuhNMZP_0q4WyM=');
// Oh no! The code is going over the edge! What are you going to do?
let message = 'gAAAAABcuE-ZMfRJRckfRgmGtlas7FHlWAHgznWnS8BNPXHvMhVZa7mCo1-daOfHAF38OdrGIXtzkJhrl6TxcY1XxLyhUAN-bsvMFgc3-iXC_SwcYD6IibB2sPPvSc0Kxz6MjTcIuycOaXm5AqMxc3Ay07XUO-PCzCiYm7uVhxNz-yHZAfMhoYqoNh-VBx_DcOl280FGIAv-';
let token = new Fernet.Token({secret: secret, token: message, ttl:0});
let result = token.decode();

console.log(result);
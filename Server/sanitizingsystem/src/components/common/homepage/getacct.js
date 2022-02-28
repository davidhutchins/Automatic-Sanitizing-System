const axios = require('axios').default;
let allAccts = [];


async function getAccounts() 
{
    axios.get('http://localhost:2000/users/')
        .then(function (resp) {
            const accounts = resp.json();
            for (let i = 0; i < accounts.length; i++)
            {
                allAccts.push({
                    userId: accounts[i]._id,
                    password: accounts[i].pwd,
                    username: accounts[i].username,
                    isAdmin: false
                });
            }
            return allAccts;
        })   
}

module.exports = {getAccounts}
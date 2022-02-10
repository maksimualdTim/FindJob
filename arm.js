
import fetch from 'node-fetch';
import AmoCRM from 'amocrm-js';

const crm = new AmoCRM({
    domain: 'timofeev2001maksim',
    auth: {
      client_id: '9acb387e-eb4a-4ed8-bf5f-5e4e18a2dbee', // ID integration
      client_secret: 'U32k9dGvaRrFuOjaV7BT6zcLGhck7dGn9AslW9mGszOXNrQfPNlkZ4ZjzXTZRA4l',
      redirect_uri: 'https://ccb7-213-87-156-236.ngrok.io/',
      // code: 'def5020020ea8489e28d2563b8b4e8bf0e187672693ccb81b254b9bf9f9ea19b76ced8691bb0b67d8bedc29334a0f82b032bc0ab452ad6cbd79d8585f7f88b3aabad261e7da3dc50a31f4b84325342153db367701b797948bf6cf6c78dfa9e7076fec771e1501fe5364a204cbef18d2b8a7160a9116bd563170115fe365a2f7178eba073c11c2b81ce8fceb1abeca8c402eeccb7ca8a8867e709395d6dd4ebc73cd6f68f68de8eb7bbe8c9039d54f07281da558a82f6a8bc3950c61b50453524eba4a807476f013d5b82e1365d1f6293e4fb8bee0659d47a9700781bdd188769b2a302e8b07bb6f235a093c0f199ea92aefca150779ffe090f35c7765c4bbd350fce87ec4e7ce48604ff83795161b03ef178c52d89bcceaced6d74ab4ccd7c93d640c935f1c7d2e5735892519ff4f358b6fd9abf60a9f962ae5ffb032bdb297a4cc3f8b160e2277cc4ac0222be5b1fee7226e50a728a6ec5a1569c79342091efc99fa1f5ca7b3be75e3e9c8a837dcc02636ba2003fdf0a00191c0536273690d41a21aea1b1925c6b31182be60da8a04e47815dd157825e65ed5a8874d2e91cfd00b9a4fb605de63115fbb1ca07c90d968984c3f15e5b4eda45f3e0b0b0141de37f6630b3af51f674f3aaaa791bfdecc8', // Код авторизации
      server: {
          port: 8000
      }
    },
});

async function getAccount(){
  const response = await crm.request( 'GET', '/api/v4/account' );
  console.log(response.data)
  return response.data
}

const token_url = crm.connection.getAuthUrl()
console.log({token_url})

const account = await getAccount()
const tokens = crm.connection.getToken()

const access_token = tokens.access_token
const refresh_token = tokens.refresh_token



// main code
const domain = 'timofeev2001maksim'
const url = 'https://'+domain+'.amocrm.ru'

function prepareQuery(access_token, method = 'GET', data = []){
  let query = {
    method: method,
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  } 
  if(data.length !== 0)
    query.body = JSON.stringify(data)
  return query
}

async function makeTask(access_token, tasks){
  const response = await fetch(url+'/api/v4/tasks', prepareQuery(access_token, 'POST', tasks));
  return response.json()
}
async function getContancts(access_token) {
  const response = await fetch(url+'/api/v4/contacts?with=leads', prepareQuery(access_token));
  return response.json();
}

getContancts(access_token)
  .then(data => {

    let contacts = data._embedded.contacts
    let tasks = []

    contacts.forEach(contact => {

      let leads = contact._embedded.leads

        if(leads.length === 0){
          let task = {
            "entity_type": "contacts",
            "entity_id": contact.id,
            "text": "Контакт без сделок", 
            "complete_till": 1588885140,
          }
          tasks.push(task)
        }

    });

    makeTask(access_token, tasks).then(data => {console.log(data)})
  });

# `@discordtypesmodules/rest`

The rest librairie used with discordtypes.

# How to install ?

```npm i @discordtypesmodules/rest```

# How to configure ?

First, we will create a file that we will call index.js for example. Subsequently, we will have to import the ```@discordtypesmodules/rest``` library by writing 
```js
const {Rest} = require('@discordtypesmodules/rest')
```
Once this is done, we will be able to start configuring the rest module. We will write 
```js
//var rest corresponds to the variable that will define the rest module
var rest = new Rest();
```
You have different options in the Rest class, I invite you to look at the code to learn more.
For rest to work, you will have to set the bot token with the function 
```js
rest.setToken('token')
```
Once all this is done, we will be able to send our first request. To do this:
```js
//Rest.get will send a GET method with the requested route on the url passed in the api option on the Rest class options. By default the url is https://discord.com/api/v9
const firstRequest = async() => {
  console.log(await rest.get('/gateway/bot'))
}
firstRequest();
```

If you followed everything you should have code like this: 
```js
const {Rest} = require('@discordtypes/rest')

var rest = new Rest();
rest.setToken('token');
firstRequest = async() => {
  console.log(await rest.get('/gateway/bot'))
}
firstRequest();
```

# How to use ?

## REST

### There are 5 api methods in the REST class.

- <a href="README.md#get">GET</a>
- <a href="README.md#post">POST</a>
- <a href="README.md#patch">PATCH</a>
- <a href="README.md#put">PUT</a>
- <a href="README.md#delete">DELETE</a>

## GET
In the Rest class, the get function has 3 parameters: ```route``` is the route you want to execute the get request, ```options``` is an object with the [RequestOptions](rest/Rest.ts) and ```body``` is the request body.
For example:
```js
const get = async() => {
  console.log(await rest.get('/gateway/bot'))
}
get();
```

## POST
In the Rest class, the post function has 3 parameters: ```route``` is the route you want to execute the post request, ```body``` is the request body and ```options``` is an object with the [RequestOptions](rest/Rest.ts).
For example :
```js
//We trying to post a message to a channel
const post = async() => {
  await r.post('/channels/channnelid/messages', {
      "content": "Hello, World!",
      "tts": false,
      "embeds": [{
        "title": "Hello, Embed!",
        "description": "This is an embedded message."
      }]
    }
  )
}
post();
```

## PUT
The put method is similar to the POST request.
```js
rest.put('route', {
// body
}, {
// options
})
```

## PATCH
The patch method is similar to the POST request
```js
rest.patch('route', {
// body
}, {
// options
});
```

## DELETE
In the Rest class, the delete function has 2 parameters: ```route``` is the route you want to execute the post request and ```options``` is an object with the [RequestOptions](rest/Rest.ts).
For example:
```js
//deleting a message
const delete = async() => {
  await rest.delete('/channels/channelid/messages/messageid')
}
delete();
```
## An other example
```js
const example = async() => {
  await r.post('/channels/936983645183442984/messages', {
      "content": "Hello, World!",
      "tts": false,
      "embeds": [{
        "title": "Hello, Embed!",
        "description": "This is an embedded message."
      }]
    }
  ).then((req) => setTimeout(async() => await r.delete(`/channels/936983645183442984/messages/${req.id}`), 15000))
}
example()
```

## CDN

## How to configure ?
The cdn class is accessible by using 
```js
var rest = new Rest()
var cdn = rest.cdn
```
You can configure base url of the cdn by using 
```js
const {CDN} = require ('@discordtypesmodules/rest')
var rest = new Rest({cdn: new CDN({baseUrl: 'baseUrl')})
```

## How to use ?

All the methods of the cdn class are readble [here](CDN.ts)
the ImageURLOptions parameter is optional

## Image URL Options

```size```: the size of the image you want (16 - 4096)
```extension```: The extension you want to use (the basic allowed extensions: png, jpeg, webp, gif) 

## Exemples

### Getting user avatar url
```js
cdn.userAvatar(userId, userAvatarHash, ImageURLOptions)
```

### Getting user banner url
```js
cdn.userBanner(userId, userBannerHash, ImageURLOptions)
```

### Getting guild banner url
```js
cdn.guildBanner(guildId, guildBannerHash, ImageURLOptions)
```

# Contact ME
Discord: Nerzox#0001

# shiverview-faithplate

## Getting started

Get the main shiverview framework
```
$ git clone https://github.com/ssiops/shiverview.git
$ cd shiverview
$ npm install
```

Start required services:

0. [Mongodb](http://www.mongodb.org/) (2.6+)
0. [Redis](http://redis.io)

Note: both Mongodb and Redis should work in their default configuration

Install `shiverview-faithplate` on main framework

```
$ npm install --save akasfei/shiverview-faithplate
$ npm uninstall --save shiverview-boilerplate
```

Note: the second command is optional, it removes a demo app.

To start the server, use the following command:

```
$ node server -1
```

You can see [Project Shiverview](https://github.com/ssiops/shiverview) for more information.

## Testing

You can use the following command to perform testing:

```
$ node server --test --port 8088 --verbose
```

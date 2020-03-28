import keys from './keys';

import redis from 'redis';

// adding the retry strategy that will reconnect whenever it looses connection after 1 sec
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: parseInt(keys.redisPort),
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

const fibFun = (index: any) => {
    if (index < 2) {
        return 1;
    }
    return fibFun(index - 1) + fibFun(index - 2);
}

// listen when a new message comes and insert a hash set of message -> fib value
sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fibFun(parseInt(message)));
});

sub.subscribe('insert');
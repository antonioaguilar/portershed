import { connect, ConnectionOptions, NatsConnection, Msg } from '@nats-io/transport-node';

const options: ConnectionOptions = { servers: ['nats://localhost:4222'] };

const nats: NatsConnection = await connect(options);

const callback = (err: any, msg: Msg) => {
  console.log(msg.data.toString());
}

nats.subscribe('order.*', { callback });

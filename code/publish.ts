import { connect, ConnectionOptions, NatsConnection } from '@nats-io/transport-node';
import _ from 'lodash';

const options: ConnectionOptions = { servers: ['nats://localhost:4222'] };

const nats: NatsConnection = await connect(options);

setInterval(() => {
  const order_id = _.random(1, 3);
  const subject = `order.${order_id}`;
  const epoch = Date.now();
  const timestamp = new Date(epoch).toISOString();
  const amount = _.random(100.0, 500.0);
  const message = JSON.stringify({ order_id, timestamp, amount }, null, 0);

  // publish the message
  nats.publish(subject, message);
}, 500);
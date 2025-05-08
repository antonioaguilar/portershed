import { connect, ConnectionOptions, NatsConnection } from '@nats-io/transport-node';
import { jetstreamManager } from '@nats-io/jetstream';

const options: ConnectionOptions = { name: `replay-service}`, servers: ['nats://localhost:4222'] };

const nats: NatsConnection = await connect(options);

const sid = 'ORDERS';
const subject = 'order.1';
const jsm = await jetstreamManager(nats);

const first = await jsm.direct.getMessage(sid, { next_by_subj: subject });
console.log(`FIRST seq=${first.seq} ts=${first.timestamp} data=${first.data.toString()}`);

const last = await jsm.direct.getMessage(sid, { last_by_subj: subject });
console.log(`LAST seq=${last.seq} ts=${last.timestamp} data=${last.data.toString()}`);

for (let i = 1; i <= last.seq; i++) {
  const msg = await jsm.direct.getMessage(sid, { next_by_subj: subject, seq: i });

  if (msg) {
    console.log(`seq=${msg.seq}\t ts=${msg.timestamp}\t data=${msg.data.toString()}`);
  } else {
    console.log(`skipped i=${i}`);
    break;
  }
}

process.exit();
import { connect, ConnectionOptions, NatsConnection } from '@nats-io/transport-node';
import { jetstreamManager } from '@nats-io/jetstream';

const options: ConnectionOptions = { servers: ['nats://localhost:4222'] };

const nats: NatsConnection = await connect(options);

const sid = 'ORDERS';
const jsm = await jetstreamManager(nats);
await jsm.streams.add({ name: sid, subjects: [`order.*`], allow_direct: true });

// const js = jsm.jetstream();
// await jsm.streams.delete(sid);

// nats pub --count 100 "order.1" "{{Count}} id={{ID}} ts={{UnixNano}}"
// nats pub --count 1000 "order.1" "seq={{Count}} id={{ID}} ts={{UnixNano}}"
// nats pub --count 100000 "order.1" "ts={{UnixNano}} seq={{Count}}"
// nats pub --count 25 "order.1" "ts={{UnixNano}} seq={{Count}}"
// nats pub --count 25 "order.2" "ts={{UnixNano}} seq={{Count}}"
// nats pub --count 25 "order.3" "ts={{UnixNano}} seq={{Count}}"
// nats pub --count 25 "order.4" "ts={{UnixNano}} seq={{Count}}"
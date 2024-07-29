import axios from 'axios';
import { ChildProcess, fork } from 'child_process';
import { IntentBuilder } from '../classes/IntentBuilder';
import { EventEmitter } from 'events';

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

export declare interface ShardingManager {
    on(event: 'shardReady', listener: (data: { shardId: number, shardCount: number }) => void): this;
}
export class ShardingManager extends EventEmitter {
    shards: Map<number, ChildProcess> = new Map();

    constructor(
        public token: string,
        public intents: number | IntentBuilder
    ) {
        super();

        this.token = token;
        this.intents = intents instanceof IntentBuilder ? intents.toNumber() : intents;
    }

    async getShardCount() {
        try {
            let res = await axios.get(
                `https://discord.com/api/v10/gateway/bot`,
                { headers: { Authorization: `Bot ${this.token}` } }
            );
            return res.data.shards;
        } catch (error) {
            console.error(error);
            return 1;
        }
    }

    async spawn() {
        let shardCount = await this.getShardCount();
        for (let i = 0; i < shardCount; i++) {
            let cp = fork('', {
                stdio: 'inherit',
                execArgv: [
                    `${__dirname}/Shard.js`,
                    `${i}`,
                    `${shardCount}`,
                    `${this.token}`,
                    `${this.intents}`
                ]
            });
            cp.on('error', () => {
                cp.kill();
            });
            cp.on('message', (msg: any /* do this type later */) => {
                switch (msg.type) {
                    case 'ready':
                        this.emit('shardReady', msg.data);
                        break;
                
                    default:
                        break;
                }
            })

            this.shards.set(i, cp);
            await sleep(5000);
        }

        process.on('beforeExit', () => {
            for (let shard of this.shards.values()) {
                shard.kill();
            }
        });
    }
}

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
    private file: string = null;

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

    config(config: { file: string }) {
        this.file = config.file;
    }

    async spawn() {
        if(!this.file) throw new Error(`No file provided to spawn shards from\n${'HELP'.green} -> Use ShardingManager.config({ file: "path/to/file" }) to set the file path\n`);
        let shardCount = await this.getShardCount();
        for (let i = 0; i < shardCount; i++) {
            let cp = fork('', {
                stdio: 'inherit',
                execArgv: [
                    `${this.file}`,
                    `${i}`,
                    `${shardCount}`,
                    `${this.intents}`
                ]
            });
            cp.on('error', () => {
                cp.kill();
                // TODO respawn shard
            });
            // cp.on('message', (msg: any /* do this type later */) => {
            //     switch (msg.type) {
            //         case 'ready':
            //             this.emit('shardReady', msg.data);
            //             break;
                
            //         default:
            //             break;
            //     }
            // })

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

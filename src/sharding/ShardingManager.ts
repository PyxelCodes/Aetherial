import axios from 'axios';
import { ChildProcess, fork } from 'child_process';

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

export class ShardingManager {
    shards: Map<number, ChildProcess> = new Map();

    constructor(
        public token: string,
        public intents: number
    ) {
        this.token = token;
        this.intents = intents;
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
                    `./dist/backend/sharding/Shard.js`,
                    `${i}`,
                    `${shardCount}`,
                    `${this.token}`,
                ]
            });
            cp.on('error', () => {
                cp.kill();
            });

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

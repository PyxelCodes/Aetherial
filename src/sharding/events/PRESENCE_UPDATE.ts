import { PresenceState } from "../classes/PresenceState";

export class OP_PRESENCE_UPDATE {
    public readonly op = 0;
    constructor(
        public data: { d: PresenceState },
        presences: Map<string, PresenceState>
    ) {
        this.data = data;

        presences.set(this.data.d.user.id, this.data.d);
    }
}

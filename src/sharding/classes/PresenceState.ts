export interface PresenceState {
    user: {
        id: string;
    }
    status: 'online' | 'dnd' | 'idle';
    client_status: {
        web?: 'online' | 'dnd' | 'idle';
        mobile?: 'online' | 'dnd' | 'idle';
        desktop?: 'online' | 'dnd' | 'idle';
    }
    broadcast: string;
    activities: Activity[];
}

export interface Activity {
    type: number;
    timestamps: {
        start: number;
        end: number;
    }
    sync_id: string;
    state: string;
    session_id: string;
    party: string
    name: string;
    id: string;
    details: string;
    flags: number;
    created_at: number;
    assets: string
}
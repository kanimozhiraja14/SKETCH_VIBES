import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

const AdminFrames = () => (
    <div className="flex flex-col items-center justify-center py-20 glass rounded-2xl">
        <Construction size={48} className="mb-4" style={{ color: 'var(--gold)' }} />
        <h2 className="font-cinzel text-xl font-bold gradient-text mb-2">Frames Management</h2>
        <p className="text-sm text-center max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            Add, edit, or remove photo frame catalogue items. Connected to /api/frames endpoint.
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--gold)' }}>Extend this panel to fully manage your frames inventory.</p>
    </div>
);

export default AdminFrames;

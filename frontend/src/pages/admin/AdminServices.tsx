import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

const AdminServices = () => (
    <div className="flex flex-col items-center justify-center py-20 glass rounded-2xl">
        <Construction size={48} className="mb-4" style={{ color: 'var(--gold)' }} />
        <h2 className="font-cinzel text-xl font-bold gradient-text mb-2">Services Management</h2>
        <p className="text-sm text-center max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            Add, edit, or remove services. This panel is connected to the /api/services endpoint.
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--gold)' }}>Use the API directly or extend this panel to manage services.</p>
    </div>
);

export default AdminServices;

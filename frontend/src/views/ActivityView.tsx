import { useEffect, useState } from 'react'
import { getActivityLog } from '../api/DevTreeAPI'
import type { ActivityLog } from '../types'

export default function ActivityView() {
    const [logs, setLogs] = useState<ActivityLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getActivityLog()
            .then(setLogs)
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <p className="text-center text-slate-600">Cargando actividad...</p>
    }

    if (!logs.length) {
        return <p className="text-center text-slate-500">No hay actividad registrada</p>
    }

    return (
        <div className="space-y-4">
            {logs.map(log => (
                <div
                    key={log._id}
                    className="bg-white p-4 rounded shadow border-l-4 border-cyan-500"
                >
                    <p className="font-bold capitalize">
                        {log.action.replace('_', ' ').toLowerCase()} – {log.linkName}
                    </p>

                    {log.oldValue && (
                        <p className="text-sm text-gray-500">
                            Antes: {log.oldValue}
                        </p>
                    )}

                    {log.newValue && (
                        <p className="text-sm text-gray-500">
                            Ahora: {log.newValue}
                        </p>
                    )}

                    <p className="text-xs text-gray-400 mt-1">
                        {new Date(log.createdAt).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    )
}

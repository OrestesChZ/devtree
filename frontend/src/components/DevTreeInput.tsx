import { Switch } from '@headlessui/react'

type DevTreeInputProps = {
    item: {
        name: string
        image: string
        url: string
        enabled: boolean
    }
    handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleEnableLink: (socialNetwork: string) => void
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function DevTreeInput({
    item,
    handleUrlChange,
    handleEnableLink
}: DevTreeInputProps) {
    return (
        <div className="bg-white shadow-sm p-5 flex items-center gap-3 rounded-lg">
            {/* Icono */}
            <div
                className="w-12 h-12 bg-cover bg-center"
                style={{ backgroundImage: `url('${item.image}')` }}
            />

            {/* Input controlado */}
            <input
                type="text"
                className="flex-1 border border-gray-200 rounded-lg p-2"
                placeholder={`https://${item.name}.com/usuario`}
                name={item.name}
                value={item.url}
                onChange={handleUrlChange}
            />

            {/* Botón abrir link */}
            {item.enabled && item.url && (
                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                >
                    Abrir
                </a>
            )}

            {/* Switch */}
            <Switch
                checked={item.enabled}
                onChange={() => handleEnableLink(item.name)}
                className={classNames(
                    item.enabled ? 'bg-blue-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors'
                )}
            >
                <span className="sr-only">Activar link</span>
                <span
                    aria-hidden="true"
                    className={classNames(
                        item.enabled ? 'translate-x-5' : 'translate-x-0',
                        'inline-block h-5 w-5 transform bg-white rounded-full transition'
                    )}
                />
            </Switch>
        </div>
    )
}

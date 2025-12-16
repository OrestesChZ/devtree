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
                className="w-12 h-12 bg-cover bg-center rounded"
                style={{ backgroundImage: `url('${item.image}')` }}
            ></div>

            {/* Input CONTROLADO */}
            <input
                type="text"
                className="flex-1 border border-gray-200 rounded-lg p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder={`https://${item.name}.com/usuario`}
                name={item.name}
                value={item.url}
                onChange={handleUrlChange}
                disabled={!item.enabled}
            />

            {/* Switch */}
            <Switch
                checked={item.enabled}
                onChange={() => handleEnableLink(item.name)}
                className={classNames(
                    item.enabled ? 'bg-blue-600' : 'bg-gray-300',
                    'relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                )}
            >
                <span className="sr-only">Activar enlace</span>
                <span
                    aria-hidden="true"
                    className={classNames(
                        item.enabled ? 'translate-x-5' : 'translate-x-0',
                        'inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200'
                    )}
                />
            </Switch>
        </div>
    )
}

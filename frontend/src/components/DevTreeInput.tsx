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

export default function DevTreeInput({ item, handleUrlChange, handleEnableLink } : DevTreeInputProps) {
    return (
        <div className="bg-white shadow-sm p-5 flex items-center gap-3">
            <div 
                className="w-12 h-12 bg-cover bg-center"
                style={{ backgroundImage: `url('${item.image}')`}}
            ></div>
            <input 
                type="text"
                className="flex-1 border border-gray-100 rounded-lg p-2"
                placeholder={`https://${item.name}.com/usuario`}
                name={item.name}
                onChange={handleUrlChange}
            />
            <Switch
                checked={item.enabled} 
                onChange={() => handleEnableLink(item.name)}
                className={classNames(
                    item.enabled ? 'bg-blue-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                )}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={classNames(
                        false ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                />
            </Switch>
        </div>
    )
}
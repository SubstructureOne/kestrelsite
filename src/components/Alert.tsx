import React from "react"

type AlertProps = {
    alert: string
}

const Alert: React.FC<AlertProps> = ({alert}) => {
    return <div role="alert" className="rounded border-l-4 border-red-500 bg-red-50 p-4 col-span-6">
        <strong className="block font-medium text-red-800"> Something went wrong </strong>

        <p className="mt-2 text-sm text-red-700">
            {alert}
        </p>
    </div>
}

export default Alert

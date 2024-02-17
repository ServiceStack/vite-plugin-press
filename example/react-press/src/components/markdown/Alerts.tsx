import { cn } from "@/utils"

type Props = {
    className?: string
    title?: string
    children?: React.ReactNode
}

function Alert({ className, title, children }:Props) {
    return (
        <div className={cn(className, 'custom-block')}>
            <p className="custom-block-title">{title}</p>
            {children}
        </div>
    )
}

export default {
    Alert:   Alert,
    Tip:     ({ className, ...remaining}:Props) => <Alert title="TIP" className={cn('tip',className)} {...remaining} />,
    Info:    ({ className, ...remaining}:Props) => <Alert title="INFO" className={cn('info',className)} {...remaining} />,
    Warning: ({ className, ...remaining}:Props) => <Alert title="WARNING" className={cn('warning',className)} {...remaining} />,
    Danger:  ({ className, ...remaining}:Props) => <Alert title="DANGER" className={cn('danger',className)} {...remaining} />,
}

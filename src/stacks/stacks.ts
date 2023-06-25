import {NextjsSite, Queue, StackContext} from "sst/constructs"

export function KestrelSite({stack}: StackContext) {
    const queue = new Queue(
        stack,
        "billingQueue",
        {
            consumer: {
                function: {
                    handler: "src/functions/billingQueueConsumer.handler",
                }
            },
        },
    )
    const site = new NextjsSite(
        stack,
        "kestrelsite",
        {
            bind: [queue]
        }
    )
    site.attachPermissions(["secretsmanager:GetSecretValue"])
    stack.addOutputs({
        SiteUrl: site.url,
    })
}

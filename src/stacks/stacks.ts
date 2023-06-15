import {NextjsSite, Queue, StackContext} from "sst/constructs"

export function KestrelSite({stack}: StackContext) {
    const queue = new Queue(
        stack,
        "billingQueue",
        {
            consumer: {
                function: {
                    handler: "src/functions/billingQueueConsumer.handler",
                    environment: {
                        "POSTGRES_HOST": process.env.POSTGRES_HOST || "",
                        "POSTGRES_PORT": process.env.POSTGRES_PORT || "",
                        "POSTGRES_USER": process.env.POSTGRES_USER || "",
                        "POSTGRES_PASSWORD": process.env.POSTGRES_PASSWORD || "",
                        "POSTGRES_DATABASE": process.env.POSTGRES_DATABASE || "",
                    }
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

    stack.addOutputs({
        SiteUrl: site.url,
    })
}

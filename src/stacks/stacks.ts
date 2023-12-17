import { NextjsSite, Queue, StackContext } from "sst/constructs";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";

export function KestrelSite({ stack }: StackContext) {
    const queue = new Queue(stack, "billingQueue", {
        consumer: {
            function: {
                handler: "src/functions/billingQueueConsumer.handler",
            },
        },
    });
    const vpc = Vpc.fromLookup(stack, "main-vpc", {
        vpcId: "vpc-0c9a3dd9172dc53cf",
    });
    const site = new NextjsSite(stack, "kestrelsite", {
        bind: [queue],
        cdk: {
            server: {
                vpc,
                vpcSubnets: {
                    subnetType: SubnetType.PRIVATE_WITH_EGRESS,
                },
            },
        },
        environment: {
            STAGE: process.env.STAGE || "",
        },
    });
    site.attachPermissions(["secretsmanager:GetSecretValue"]);
    stack.addOutputs({
        SiteUrl: site.url,
    });
}

import { KResult } from "@/utils/errors";
import { ChargeInfo } from "@/utils/dbtypes";
import Alert from "./Alert";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import React from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
);

export const options = {
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
        legend: {
            position: "top" as const,
        },
        title: {
            display: true,
            text: "Chart.js Line Chart",
        },
    },
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
};

export const ChargesInfoTab = (
    chargesInfo: KResult<ChargeInfo[]> | undefined,
) => {
    let chargeTable;
    if (chargesInfo?.isErr) {
        chargeTable = <Alert alert={chargesInfo.error.friendly} />;
    } else if (chargesInfo === undefined) {
        chargeTable = <>Loading...</>;
    } else {
        const types = new Set(
            chargesInfo.value.map((charge) => charge.charge_type),
        );
        let datasets = [];
        for (const type of types) {
            let label, color;
            switch (type) {
                case "DataStorageByteHours":
                    label = "Storage";
                    color = "red";
                    break;
                case "DataTransferInBytes":
                    label = "Incoming traffic";
                    color = "blue";
                    break;
                case "DataTransferOutBytes":
                    label = "Outgoing traffic";
                    color = "yellow";
                    break;
                default:
                    label = type;
                    color = "grey";
                    break;
            }
            const dataset = {
                label,
                backgroundColor: color,
                data: chargesInfo.value
                    .filter((charge) => charge.charge_type == type)
                    .sort(
                        (charge1, charge2) =>
                            new Date(charge1.charge_time).getTime() -
                            new Date(charge2.charge_time).getTime(),
                    )
                    .map((charge) => ({
                        x: new Date(charge.charge_time)
                            .toISOString()
                            .split("T")[0],
                        y: charge.amount,
                    })),
            };
            console.log(`Data for ${type}: ${JSON.stringify(dataset.data)}`);
            datasets.push(dataset);
        }
        chargeTable = (
            <>
                <h2>Recent charges</h2>
                <Bar
                    width={1200}
                    height={600}
                    options={options}
                    data={{ datasets }}
                />
            </>
        );
    }
    return <div className="col-span-3 p-4 m-4">{chargeTable}</div>;
};

import { useEffect, useState } from "react";

function returnHasAndAmounts(limit: number): number {
    const rand1 = Math.random();
    const rand2 = Math.random();
    const rand3 = Math.random();
    const rand4 = Math.random();
    const hasItem = rand1 < rand2 ? rand3 < rand4 : rand3 > rand4;
    const dayAmount = Math.floor(Math.random() * 10);
    const amount = hasItem
        ? dayAmount === 0 ? 1 : dayAmount > limit ? limit : dayAmount
        : 1;

    return amount;
}

function setHousesInfoCB(limit: number) {
    const rand = Math.floor(Math.random() * 10);
    const length = rand < 4 ? 4 : rand;

    return Array.from({ length })
        .reduce<
            Map<number, {
                cAmount: number;
                fAmount: number;
                pAmount: number;
                visited: boolean;
            }>
        >((acc, _curr, index) => {
            const cAmount = returnHasAndAmounts(limit);
            const pAmount = returnHasAndAmounts(limit);
            const fAmount = returnHasAndAmounts(limit);

            acc.set(index, {
                cAmount,
                fAmount,
                pAmount,
                visited: false,
            });

            return acc;
        }, new Map());
}

function Neighbourhood() {
    const LIMIT = 4;
    const [housesInfo, setHousesInfo] = useState(() => setHousesInfoCB(LIMIT));

    useEffect(() => {
        setHousesInfo(setHousesInfoCB(LIMIT));
    }, []);

    function handleKnock(houseIndex: number) {
        setHousesInfo((prev) => {
            const newMap = new Map(prev);
            const houseInfo = newMap.get(houseIndex);
            if (houseInfo) {
                newMap.set(houseIndex, {
                    ...houseInfo,
                    visited: true,
                });
            }
            return newMap;
        });
    }

    const houses = Array.from(housesInfo.values()).map((info, index) => {
        const {
            cAmount,
            fAmount,
            pAmount,
            visited,
        } = info;

        return visited
            ? (
                <div key={index} className="house visited">
                    <h3>House {index + 1}</h3>
                    <p>
                        {`Please have some c: ${cAmount}`}
                    </p>
                    <p>
                        {`Please have some p: ${pAmount}`}
                    </p>
                    <p>
                        {`Please have some f: ${fAmount}`}
                    </p>
                </div>
            )
            : (
                <div key={index} className="house">
                    <h3>House {index + 1}</h3>
                    <button
                        onClick={() => handleKnock(index)}
                    >
                        Knock
                    </button>
                </div>
            );
    });

    return (
        <div className="neighbourhood">
            <div className="houses">{houses}</div>
        </div>
    );
}

export default Neighbourhood;

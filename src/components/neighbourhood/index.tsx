import { useEffect, useState } from "react";

function returnHasAndAmounts(limit: number): [boolean, number] {
    const rand1 = Math.random();
    const rand2 = Math.random();
    const rand3 = Math.random();
    const rand4 = Math.random();
    const hasItem = rand1 < rand2 ? rand3 < rand4 : rand3 > rand4;
    // const hasItem = Math.random() < 0.5;
    const dayAmount = Math.floor(Math.random() * 10);
    const amount = hasItem
        ? dayAmount === 0 ? 1 : dayAmount > limit ? limit : dayAmount
        : 0;

    return [hasItem, amount];
}

function setHousesInfoCB(limit: number) {
    const rand = Math.floor(Math.random() * 10);
    const length = rand < 4 ? 4 : rand;

    return Array.from({ length })
        .reduce<
            Map<number, {
                hasCarbs: boolean;
                carbAmount: number;
                hasFats: boolean;
                fatAmount: number;
                hasProteins: boolean;
                proteinAmount: number;
                visited: boolean;
            }>
        >((acc, _curr, index) => {
            const [hasCarbs, carbAmount] = returnHasAndAmounts(limit);
            const [hasProteins, proteinAmount] = returnHasAndAmounts(limit);
            const [hasFats, fatAmount] = returnHasAndAmounts(limit);

            acc.set(index, {
                hasCarbs,
                carbAmount,
                hasFats,
                fatAmount,
                hasProteins,
                proteinAmount,
                visited: false,
            });

            return acc;
        }, new Map());
}

function Neighbourhood() {
    const LIMIT = 4;
    const [day, setDay] = useState(1);
    const [housesInfo, setHousesInfo] = useState(() => setHousesInfoCB(LIMIT));

    useEffect(() => {
        setHousesInfo(setHousesInfoCB(LIMIT));
    }, [day]);

    console.log(
        "housesInfo:",
        JSON.stringify(Array.from(housesInfo.values()), null, 2),
    );

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
            hasCarbs,
            carbAmount,
            hasFats,
            fatAmount,
            hasProteins,
            proteinAmount,
            visited,
        } = info;

        return visited
            ? (
                <div key={index} className="house visited">
                    <h3>House {index + 1}</h3>
                    <p>
                        {hasCarbs
                            ? `🍚 Please have some carbs: ${carbAmount}`
                            : `🙏 Apologies, no carbs available`}
                    </p>
                    <p>
                        {hasProteins
                            ? `🫘 Please have some protein: ${proteinAmount}`
                            : `🙏 Apologies, no protein available`}
                    </p>
                    <p>
                        {hasFats
                            ? `🥜 Please have some fat: ${fatAmount}`
                            : `🙏 Apologies, no fat available`}
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

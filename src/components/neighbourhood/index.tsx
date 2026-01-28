import { useEffect, useState } from "react";

function returnHasAndAmounts(
    correctDay: number,
): [boolean, number] {
    const auspicious_number = 7;
    const rand1 = Math.random();
    const rand2 = Math.random();
    const rand3 = Math.random();
    const rand4 = Math.random();
    const hasItem = rand3 < rand4 ? rand1 < rand2 : rand1 > rand2;
    const dayAmount = Math.floor(Math.random() * correctDay);
    const amount = hasItem
        ? dayAmount === 0
            ? 1
            : dayAmount > auspicious_number
            ? auspicious_number
            : dayAmount
        : 0;

    return [hasItem, amount];
}

function setHousesInfoCB(day: number) {
    const correctDay = day <= 14 ? day : 28 - day;

    return Array.from({ length: correctDay })
        .reduce<
            Map<number, {
                hasS: boolean;
                hasF: boolean;
                hasFood: boolean;
                sAmount: number;
                fAmount: number;
                foodAmount: number;
                visited: boolean;
            }>
        >((acc, _curr, index) => {
            const [hasS, sAmount] = returnHasAndAmounts(correctDay);
            const [hasF, fAmount] = returnHasAndAmounts(correctDay);
            const [hasFood, foodAmount] = returnHasAndAmounts(
                correctDay,
            );

            acc.set(index, {
                hasS,
                sAmount,
                hasF,
                fAmount,
                hasFood,
                foodAmount,
                visited: false,
            });

            return acc;
        }, new Map());
}

function Neighbourhood() {
    const [day, setDay] = useState(1);
    const [housesInfo, setHousesInfo] = useState(() => setHousesInfoCB(day));

    useEffect(() => {
        setHousesInfo(setHousesInfoCB(day));
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

    const dayElement = (
        <div className="day-info">
            {day === 14 ? <h2>ༀ Day 14: Full Moon ༂</h2> : <h2>Day {day}</h2>}
            <input
                type="number"
                value={day}
                min={0}
                max={28}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const newDay = parseInt(event.target.value, 10);
                    if (!isNaN(newDay) && newDay >= 1) {
                        setDay(newDay);
                    }
                }}
            />
        </div>
    );

    const houses = Array.from(housesInfo.values()).map((info, index) => {
        const { fAmount, hasF, hasS, sAmount, visited, foodAmount, hasFood } =
            info;

        return visited
            ? (
                <div key={index} className="house visited">
                    <h3>House {index + 1}</h3>
                    <p>
                        {hasS
                            ? `✨ Please have some s: ${sAmount}`
                            : `🙏 Apologies, no s available`}
                    </p>
                    <p>
                        {hasF
                            ? `🌸 Please have some f: ${fAmount}`
                            : `🙏 Apologies, no f available`}
                    </p>
                    <p>
                        {hasFood
                            ? `🍚 Please have some food: ${foodAmount}`
                            : `🙏 Apologies, no food available`}
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
            {dayElement}
            <div className="houses">{houses}</div>
        </div>
    );
}

export default Neighbourhood;

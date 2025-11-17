import { useEffect, useState } from "react";

function setHousesInfoCB(day: number) {
    const correctDay = day <= 14 ? day : 28 - day;

    return Array.from({ length: correctDay })
        .reduce<
            Map<number, {
                hasSugar: boolean;
                hasFructose: boolean;
                sugarAmount: number;
                fructoseAmount: number;
                visited: boolean;
            }>
        >((acc, _curr, index) => {
            const sugarRand1 = Math.random();
            const sugarRand2 = Math.random();
            const sugarOperator = Math.random();
            const hasSugar = sugarOperator < Math.random()
                ? sugarRand1 < sugarRand2
                : sugarRand1 > sugarRand2;
            const sugarNumber = Math.floor(Math.random() * correctDay);
            const randSugarAmount = Math.floor(Math.random() * sugarNumber);
            const sugarAmount = hasSugar
                ? randSugarAmount === 0
                    ? 1
                    : randSugarAmount > 4
                    ? 4
                    : randSugarAmount
                : 0;

            const fructoseRand1 = Math.random();
            const fructoseRand2 = Math.random();
            const fructoseOperator = Math.random();
            const hasFructose = fructoseOperator < Math.random()
                ? fructoseRand1 < fructoseRand2
                : fructoseRand1 > fructoseRand2;
            const fructoseNumber = Math.floor(Math.random() * correctDay);
            const randFructoseAmount = Math.floor(
                Math.random() * fructoseNumber,
            );
            const fructoseAmount = hasFructose
                ? randFructoseAmount === 0
                    ? 1
                    : randFructoseAmount > 4
                    ? 4
                    : randFructoseAmount
                : 0;

            acc.set(index, {
                hasSugar,
                hasFructose,
                sugarAmount,
                fructoseAmount,
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

    console.log("housesInfo:", housesInfo);

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
            <h1>Day {day}</h1>
            <input
                type="number"
                value={day}
                min={1}
                onChange={(e) => {
                    const newDay = parseInt(e.target.value, 10);
                    if (!isNaN(newDay) && newDay >= 1) {
                        setDay(newDay);
                    }
                }}
            />
        </div>
    );

    const houses = Array.from(housesInfo.values()).map((info, index) => {
        const { fructoseAmount, hasFructose, hasSugar, sugarAmount, visited } =
            info;

        return visited
            ? (
                <div key={index} className="house">
                    <h2>House {index + 1} (Visited)</h2>
                    <p>
                        {hasSugar
                            ? `Please have some sugar: ${sugarAmount}`
                            : `Apologies, no sugar available`}
                    </p>
                    <p>
                        {hasFructose
                            ? `Please have some fructose: ${fructoseAmount}`
                            : `Apologies, no fructose available`}
                    </p>
                </div>
            )
            : (
                <div key={index}>
                    <h2>House {index + 1}</h2>
                    <button
                        onClick={() => {
                            handleKnock(index);
                        }}
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

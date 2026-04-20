import { type JSX, useEffect, useState } from "react";

type HouseDonation = {
    carbAmount: number;
    fatAmount: number;
    proteinAmount: number;
    sidesAmount: number;
    visited: boolean;
};
type HouseNumber = number;

function hasDonation() {
    const rand1 = Math.random();
    const rand2 = Math.random();
    const rand3 = Math.random();
    const rand4 = Math.random();
    return rand1 < rand2 ? rand3 < rand4 : rand3 > rand4;
}

function carbsDonation() {
    const PRIMES = [19, 23, 29, 31, 37, 43, 47, 53];
    const dayAmount = PRIMES[Math.floor(Math.random() * PRIMES.length)];
    const anotherChance = Math.random() < 0.5 ? 0 : dayAmount;
    const anotherChance1 = Math.random() < 0.5 ? 0 : dayAmount;

    return hasDonation()
        ? dayAmount
        : anotherChance === 0
        ? anotherChance1
        : anotherChance;
}

function fatsDonation() {
    const PRIMES = [7, 11, 13, 17, 19, 23];
    const dayAmount = PRIMES[Math.floor(Math.random() * PRIMES.length)];
    const anotherChance = Math.random() < 0.5 ? 0 : dayAmount;
    const anotherChance1 = Math.random() < 0.5 ? 0 : dayAmount;

    return hasDonation()
        ? dayAmount
        : anotherChance === 0
        ? anotherChance1
        : anotherChance;
}

function proteinsDonation() {
    const PRIMES = [11, 13, 17, 19, 23];
    const dayAmount = PRIMES[Math.floor(Math.random() * PRIMES.length)];
    const anotherChance = Math.random() < 0.5 ? 0 : dayAmount;
    const anotherChance1 = Math.random() < 0.5 ? 0 : dayAmount;

    return hasDonation()
        ? dayAmount
        : anotherChance === 0
        ? anotherChance1
        : anotherChance;
}

function sidesDonation() {
    const PRIMES = [13, 17, 19, 23, 29, 31, 37, 43];
    const dayAmount = PRIMES[Math.floor(Math.random() * PRIMES.length)];
    const anotherChance = Math.random() < 0.5 ? 0 : dayAmount;
    const anotherChance1 = Math.random() < 0.5 ? 0 : dayAmount;

    return hasDonation()
        ? dayAmount
        : anotherChance === 0
        ? anotherChance1
        : anotherChance;
}

function setNeighbourhoodDonationsCB(
    housesLimit: number,
): Map<HouseNumber, HouseDonation> {
    const rand = Math.floor(Math.random() * 10);
    const length = rand < housesLimit ? housesLimit : rand;

    return Array.from({ length })
        .reduce<Map<HouseNumber, HouseDonation>>((acc, _curr, index) => {
            const state: HouseDonation = {
                carbAmount: carbsDonation(),
                fatAmount: fatsDonation(),
                proteinAmount: proteinsDonation(),
                sidesAmount: sidesDonation(),
                visited: false,
            };
            acc.set(index, state);

            return acc;
        }, new Map());
}

function Neighbourhood(): JSX.Element {
    const HOUSES_LIMIT = 4;
    const [neighbourhoodDonations, setNeighbourhoodDonations] = useState(() =>
        setNeighbourhoodDonationsCB(HOUSES_LIMIT)
    );
    const [housesRevealed, setHousesRevealed] = useState(1);

    useEffect(() => {
        setNeighbourhoodDonations(setNeighbourhoodDonationsCB(HOUSES_LIMIT));
    }, []);

    function handleKnock(houseNumber: HouseNumber): void {
        setNeighbourhoodDonations((prev) => {
            const neighbourhoodDonations = new Map(prev);
            const houseDonation = neighbourhoodDonations.get(houseNumber);
            if (houseDonation) {
                neighbourhoodDonations.set(houseNumber, {
                    ...houseDonation,
                    visited: true,
                });
            }
            return neighbourhoodDonations;
        });

        setHousesRevealed((prev) => prev + 1);
    }

    const houses = Array.from(neighbourhoodDonations.values()).map(
        (houseDonation, index) => {
            const {
                carbAmount,
                fatAmount,
                proteinAmount,
                sidesAmount,
                visited,
            } = houseDonation;

            return visited
                ? (
                    <div key={String(index)} className="house visited">
                        <h3>House {index + 1}</h3>
                        <p>
                            {`Please have some carbs: ${carbAmount}`}
                        </p>
                        <p>
                            {`Please have some fat: ${fatAmount}`}
                        </p>
                        <p>
                            {`Please have some protein: ${proteinAmount}`}
                        </p>
                        <p>
                            {`Please have some sides: ${sidesAmount}`}
                        </p>
                    </div>
                )
                : (
                    <div key={String(index)} className="house">
                        <h3>House {index + 1}</h3>
                        <button
                            onClick={() => handleKnock(index)}
                        >
                            Knock
                        </button>
                    </div>
                );
        },
    );

    return (
        <div className="neighbourhood">
            <div className="houses">{houses.slice(0, housesRevealed)}</div>
        </div>
    );
}

export default Neighbourhood;

/**
 * function returnHasAndAmounts(): number {
    const rand1 = Math.random();
    const rand2 = Math.random();
    const rand3 = Math.random();
    const rand4 = Math.random();
    const hasItem = rand1 < rand2 ? rand3 < rand4 : rand3 > rand4;
    const PRIMES = [
        2,
        3,
        5,
        7,
        11,
        13,
        17,
        19,
        23,
        29,
        31,
        37,
        43,
        47,
        53,
        59,
        61,
        67,
        71,
        73,
        79,
        83,
        89,
        97,
    ];
    const dayAmount = PRIMES[Math.floor(Math.random() * PRIMES.length)];
    const anotherChance = Math.random() < 0.5 ? 0 : dayAmount;
    const anotherChance1 = Math.random() < 0.5 ? 0 : dayAmount;

    return hasItem
        ? dayAmount
        : anotherChance === 0
        ? anotherChance1
        : anotherChance;
}
 */

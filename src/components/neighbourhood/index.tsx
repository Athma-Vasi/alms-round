import { type JSX, useEffect, useState } from "react";

type FoodKind =
    // | "beans"
    | "burrito"
    | "pizzaPops"
    | "protein";
// | "crunchies"
// | "rice"
// | "seeds"
// | "side";

type HouseDonation =
    & {
        [Kind in FoodKind as `${Kind}Amount`]: number;
    }
    & {
        visited: boolean;
    };

type HouseNumber = number;
type TotalAlms = {
    [Kind in FoodKind as `${Kind}Total`]: number;
};

function hasDonation() {
    const rand1 = Math.random();
    const rand2 = Math.random();
    const rand3 = Math.random();
    const rand4 = Math.random();
    return rand1 < rand2 ? rand3 < rand4 : rand3 > rand4;
}

function receiveDonation(foodKind: FoodKind): number {
    const FOODKIND_PRIMES_TABLE: Record<FoodKind, number[]> = {
        // "beans": [11, 13, 17, 19],
        "burrito": [1],
        "pizzaPops": [1],
        "protein": [17, 19, 23, 29],
        // "crunchies": [17, 19, 23, 29, 31, 37, 41, 43, 47],
        // "rice": [41, 43, 47, 53, 59, 61, 67, 71, 73, 79],
        // "seeds": [17, 19, 23, 29],
        // "side": [23, 29, 31, 37, 41, 43, 47],
    };

    const PRIMES = FOODKIND_PRIMES_TABLE[foodKind];
    const amount = PRIMES[Math.floor(Math.random() * PRIMES.length)];

    return hasDonation() ? amount : 0;
}

function setNeighbourhoodDonationsCB(
    housesLimit: number,
): Map<HouseNumber, HouseDonation> {
    const rand = Math.floor(Math.random() * 10);
    const length = rand < housesLimit ? housesLimit : rand;

    return Array.from({ length })
        .reduce<Map<HouseNumber, HouseDonation>>((acc, _curr, index) => {
            const state: HouseDonation = {
                burritoAmount: receiveDonation("burrito"),
                pizzaPopsAmount: receiveDonation("pizzaPops"),
                proteinAmount: receiveDonation("protein"),
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

    function sumDonations(
        neighbourhoodDonations: Map<HouseNumber, HouseDonation>,
        housesRevealed: number,
    ): TotalAlms {
        const initialAcc: TotalAlms = {
            burritoTotal: 0,
            pizzaPopsTotal: 0,
            proteinTotal: 0,
        };

        return Array.from(neighbourhoodDonations)
            .reduce<TotalAlms>(
                (acc, [houseNumber, houseDonation]) => {
                    if (houseNumber >= housesRevealed) {
                        return acc;
                    }

                    const {
                        burritoAmount,
                        pizzaPopsAmount,
                        proteinAmount,
                    } = houseDonation;

                    acc.burritoTotal += burritoAmount;
                    acc.pizzaPopsTotal += pizzaPopsAmount;
                    acc.proteinTotal += proteinAmount;

                    return acc;
                },
                initialAcc,
            );
    }

    const houses = Array.from(neighbourhoodDonations.values()).map(
        (houseDonation, index) => {
            const {
                burritoAmount,
                pizzaPopsAmount,
                proteinAmount,
                visited,
            } = houseDonation;

            return visited
                ? (
                    <div key={String(index)} className="house visited">
                        <h3>🤗💐🌷🌹 House {index + 1} 🙏🌸🌺</h3>

                        <p>
                            {`Please have some burritoes: ${burritoAmount}`}
                        </p>
                        <p>
                            {`Please have some pizza pops: ${pizzaPopsAmount}`}
                        </p>
                        <p>
                            {`Please have some protein: ${proteinAmount}`}
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

    const {
        burritoTotal,
        pizzaPopsTotal,
        proteinTotal,
    } = sumDonations(neighbourhoodDonations, housesRevealed);

    const neighbourhoodAlmsElement = (
        <div className="totals">
            <h2>Neighbourhood Alms</h2>
            <p>{`Burritoes: ${burritoTotal}`}</p>
            <p>{`Pizza Pops: ${pizzaPopsTotal}`}</p>
            <p>{`Protein: ${proteinTotal}`}</p>
        </div>
    );

    return (
        <div className="neighbourhood">
            <div className="houses">{houses.slice(0, housesRevealed)}</div>
            {neighbourhoodAlmsElement}
        </div>
    );
}

export default Neighbourhood;

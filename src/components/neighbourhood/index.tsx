import { type JSX, useEffect, useState } from "react";

type FoodKind = "rice" | "bread" | "fat" | "beans" | "yoghurt";
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
        "beans": [17, 19, 23, 29, 31, 37, 43, 47],
        "bread": [43, 47, 53, 59, 61, 67, 71, 73, 79, 83],
        "fat": [11, 13, 17, 19, 23, 29, 31],
        "rice": [23, 29, 31, 37, 43, 47, 53],
        "yoghurt": [47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],
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
                beansAmount: receiveDonation("beans"),
                breadAmount: receiveDonation("bread"),
                fatAmount: receiveDonation("fat"),
                riceAmount: receiveDonation("rice"),
                yoghurtAmount: receiveDonation("yoghurt"),
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
            beansTotal: 0,
            breadTotal: 0,
            fatTotal: 0,
            riceTotal: 0,
            yoghurtTotal: 0,
        };

        return Array.from(neighbourhoodDonations)
            .reduce<TotalAlms>(
                (acc, [houseNumber, houseDonation]) => {
                    if (houseNumber >= housesRevealed) {
                        return acc;
                    }

                    const {
                        beansAmount,
                        breadAmount,
                        fatAmount,
                        riceAmount,
                        yoghurtAmount,
                    } = houseDonation;

                    acc.beansTotal += beansAmount;
                    acc.breadTotal += breadAmount;
                    acc.fatTotal += fatAmount;
                    acc.riceTotal += riceAmount;
                    acc.yoghurtTotal += yoghurtAmount;

                    return acc;
                },
                initialAcc,
            );
    }

    const houses = Array.from(neighbourhoodDonations.values()).map(
        (houseDonation, index) => {
            const {
                beansAmount,
                breadAmount,
                fatAmount,
                riceAmount,
                yoghurtAmount,
                visited,
            } = houseDonation;

            return visited
                ? (
                    <div key={String(index)} className="house visited">
                        <h3>House {index + 1}</h3>
                        <p>
                            {`Please have some beans: ${beansAmount}`}
                        </p>
                        <p>
                            {`Please have some bread: ${breadAmount}`}
                        </p>
                        <p>
                            {`Please have some fat: ${fatAmount}`}
                        </p>
                        <p>
                            {`Please have some rice: ${riceAmount}`}
                        </p>
                        <p>
                            {`Please have some yoghurt: ${yoghurtAmount}`}
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
        beansTotal,
        breadTotal,
        fatTotal,
        riceTotal,
        yoghurtTotal,
    } = sumDonations(neighbourhoodDonations, housesRevealed);

    const neighbourhoodAlmsElement = (
        <div className="totals">
            <h2>Neighbourhood Alms</h2>
            <p>{`Beans: ${beansTotal}`}</p>
            <p>{`Bread: ${breadTotal}`}</p>
            <p>{`Fat: ${fatTotal}`}</p>
            <p>{`Rice: ${riceTotal}`}</p>
            <p>{`Yoghurt: ${yoghurtTotal}`}</p>
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

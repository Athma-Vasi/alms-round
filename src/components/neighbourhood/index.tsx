import { type JSX, useEffect, useState } from "react";

type FoodKind = "beans" | "fibre" | "protein" | "rice" | "seeds" | "side";
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
        "fibre": [11, 13, 17, 19],
        "protein": [17, 19, 23, 29],
        "rice": [31, 37, 43, 47, 53, 59, 61, 67],
        "seeds": [17, 19, 23, 29],
        "side": [17, 19, 23, 29, 31, 37],
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
                fibreAmount: receiveDonation("fibre"),
                proteinAmount: receiveDonation("protein"),
                riceAmount: receiveDonation("rice"),
                seedsAmount: receiveDonation("seeds"),
                sideAmount: receiveDonation("side"),
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
            fibreTotal: 0,
            proteinTotal: 0,
            riceTotal: 0,
            seedsTotal: 0,
            sideTotal: 0,
        };

        return Array.from(neighbourhoodDonations)
            .reduce<TotalAlms>(
                (acc, [houseNumber, houseDonation]) => {
                    if (houseNumber >= housesRevealed) {
                        return acc;
                    }

                    const {
                        beansAmount,
                        fibreAmount,
                        proteinAmount,
                        riceAmount,
                        seedsAmount,
                        sideAmount,
                    } = houseDonation;

                    acc.beansTotal += beansAmount;
                    acc.fibreTotal += fibreAmount;
                    acc.proteinTotal += proteinAmount;
                    acc.riceTotal += riceAmount;
                    acc.seedsTotal += seedsAmount;
                    acc.sideTotal += sideAmount;

                    return acc;
                },
                initialAcc,
            );
    }

    const houses = Array.from(neighbourhoodDonations.values()).map(
        (houseDonation, index) => {
            const {
                beansAmount,
                fibreAmount,
                proteinAmount,
                riceAmount,
                seedsAmount,
                sideAmount,
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
                            {`Please have some fibre: ${fibreAmount}`}
                        </p>
                        <p>
                            {`Please have some protein: ${proteinAmount}`}
                        </p>
                        <p>
                            {`Please have some rice: ${riceAmount}`}
                        </p>
                        <p>
                            {`Please have some seeds: ${seedsAmount}`}
                        </p>
                        <p>
                            {`Please have some side: ${sideAmount}`}
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
        fibreTotal,
        proteinTotal,
        riceTotal,
        seedsTotal,
        sideTotal,
    } = sumDonations(neighbourhoodDonations, housesRevealed);

    const neighbourhoodAlmsElement = (
        <div className="totals">
            <h2>Neighbourhood Alms</h2>
            <p>{`Beans: ${beansTotal}`}</p>
            <p>{`Fibre: ${fibreTotal}`}</p>
            <p>{`Protein: ${proteinTotal}`}</p>
            <p>{`Rice: ${riceTotal}`}</p>
            <p>{`Rice: ${seedsTotal}`}</p>
            <p>{`Side: ${sideTotal}`}</p>
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

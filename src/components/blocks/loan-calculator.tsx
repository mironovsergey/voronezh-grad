"use client";
import {useState, useEffect, ChangeEvent, FC, useCallback} from "react";
import styled from "styled-components";
import {Unbounded} from "next/font/google";
import {Golos_Text} from "next/font/google";
import Link from "next/link";
import Input from "../elements/Input";

const unbounded = Unbounded({subsets: ["latin"]});
const golos = Golos_Text({subsets: ["latin"]});

const LoanCalculator: FC = () => {
    const [propertyPrice, setPropertyPrice] = useState<string>("4800000");
    const [downPayment, setDownPayment] = useState<string>("1000000");
    const [interestRate, setInterestRate] = useState<string>("21");
    const [loanTerm, setLoanTerm] = useState<string>("15");
    const [monthlyPayment, setMonthlyPayment] = useState<string>("32067");

    const formatNumber = (num: string): string => {
        return Number(num).toLocaleString("ru-RU").replace(/,/g, " ");
    };

    // Расчет ежемесячного платежа
    const calculateMonthlyPayment = useCallback(() => {
        const price = Number(propertyPrice);
        const down = Number(downPayment);
        const rate = Number(interestRate) / 100 / 12;
        const term = Number(loanTerm) * 12;

        if (price <= 0 || down < 0 || rate <= 0 || term <= 0 || down >= price) {
            setMonthlyPayment("0");
            return;
        }

        const loanAmount = price - down;
        const monthlyPaymentAmount = (loanAmount * (rate * Math.pow(1 + rate, term))) / (Math.pow(1 + rate, term) - 1);
        setMonthlyPayment(Math.round(monthlyPaymentAmount).toString());
    }, [propertyPrice, downPayment, interestRate, loanTerm]);

    // Рассчитываем платеж при изменении параметров
    useEffect(() => {
        calculateMonthlyPayment();
    }, [calculateMonthlyPayment]);

    // Универсальный обработчик для числовых полей
    // TODO: возможно стоит перенести в Input
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const value = e.target.value.replace(/[^\d]/g, "");
        setter(value);
    };

    return (
        <CalculatorContainer>
            <CalculatorTitle>Кредитный калькулятор</CalculatorTitle>

            <CalculatorInputsGrid>
                <Input
                    label="Стоимость квартиры"
                    value={formatNumber(propertyPrice)}
                    onChange={(e) => handleInputChange(e, setPropertyPrice)}
                    placeholder="Стоимость квартиры"
                    suffix="₽"
                />

                <Input
                    label="Первоначальный взнос"
                    value={formatNumber(downPayment)}
                    onChange={(e) => handleInputChange(e, setDownPayment)}
                    placeholder="Первоначальный взнос"
                    suffix="₽"
                />

                <Input
                    label="Ставка"
                    value={interestRate}
                    onChange={(e) => handleInputChange(e, setInterestRate)}
                    placeholder="Процентная ставка"
                    suffix="%"
                />

                <Input
                    label="Срок кредита"
                    value={loanTerm}
                    onChange={(e) => handleInputChange(e, setLoanTerm)}
                    placeholder="Срок кредита"
                    suffix="лет"
                />
            </CalculatorInputsGrid>

            <BottomContainer>
                <Disclaimer>
                    Приведенные расчеты носят предварительный характер. Окончательный расчет суммы кредита и размер
                    ежемесячного платежа производится банком.{" "}
                    <Link href="/">Для консультации обратитесь в наш отдел продаж.</Link>
                    <div className="btn btn-primary">Напишите нам</div>
                </Disclaimer>

                <ResultBlock>
                    <ResultLabel>Ежемесячный платеж</ResultLabel>
                    <ResultValue>{formatNumber(monthlyPayment)} ₽</ResultValue>
                </ResultBlock>
            </BottomContainer>
        </CalculatorContainer>
    );
};

// Стили компонентов
const CalculatorContainer = styled.div`
    background-color: #ebf4f7;
    padding: 120px 100px;
    border-radius: 0.5rem;
    margin: 0 calc((var(--container-width) - 50vw) / 2);
    width: 99vw;
    position: relative;
    left: 50%;
    right: 50%;
    transform: translateX(-50%);
    box-sizing: border-box;
    @media (max-width: 1599px) {
        padding: 120px 80px;
    }
    @media (max-width: 1279px) {
        padding: 120px 40px;
    }
`;

const CalculatorTitle = styled.h2`
    font-size: 40px;
    line-height: 1.2;
    font-weight: 500;
    margin-bottom: 40px;
    color: #000;
    margin-top: 0;
    @media (max-width: 640px) {
        font-size: 27px;
        margin-bottom: 32px;
    }
`;

const CalculatorInputsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--gutter);
    margin-bottom: 1.5rem;

    @media (max-width: 1279px) {
        grid-template-columns: repeat(2, 1fr);

    }

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`;

const Disclaimer = styled.div`
    font-size: 14px;
    margin-bottom: 12px;
    line-height: 1.4;
    max-width: 800px;
    font-family: ${golos.style.fontFamily};
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: -0.008em;
    color: rgba(134, 134, 139, 1);
    a {
        color: var(--color-black);
        text-decoration: none;
    }
`;

const BottomContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    border-top: 1px solid var(--color-dark_grey);
    padding-top: 12px;
    .btn {
        margin-top: 12px;
    }
    @media (max-width: 1279px) {
        flex-direction: column-reverse;
        gap: 32px;
    }
`;

const ResultBlock = styled.div`
    text-align: right;
    @media (max-width: 1279px) {
        align-self: flex-end;
    }
`;

const ResultLabel = styled.div`
    font-size: 17px;
    line-height: 150%;
    color: var(--color-dark_grey);
    margin-bottom: 8px;
    font-family: ${golos.style.fontFamily};
`;

const ResultValue = styled.div`
    font-size: 52px;
    line-height: 120%;
    font-weight: 600;
    color: var(--color-black);
    font-family: ${unbounded.style.fontFamily};
    @media (max-width: 640px) {
        font-size: 40px;
    }
`;

export default LoanCalculator;

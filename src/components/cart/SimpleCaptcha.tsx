
"use client";

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle } from 'lucide-react';

interface SimpleCaptchaProps {
    onVerified: (isVerified: boolean) => void;
}

export function SimpleCaptcha({ onVerified }: SimpleCaptchaProps) {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [answer, setAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);

    const generateNewNumbers = () => {
        setNum1(Math.floor(Math.random() * 10) + 1);
        setNum2(Math.floor(Math.random() * 10) + 1);
        setAnswer('');
        setIsCorrect(false);
        onVerified(false);
    };

    useEffect(() => {
        generateNewNumbers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const expectedAnswer = useMemo(() => num1 + num2, [num1, num2]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAnswer(value);
        const isVerified = parseInt(value, 10) === expectedAnswer;
        setIsCorrect(isVerified);
        onVerified(isVerified);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Security Check</CardTitle>
                <CardDescription>Please solve the simple math problem to continue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center p-4 bg-muted rounded-md font-mono text-lg">
                        <span>{num1}</span>
                        <span className="mx-2">+</span>
                        <span>{num2}</span>
                        <span className="mx-2">=</span>
                        <span>?</span>
                    </div>
                    <Input
                        type="number"
                        value={answer}
                        onChange={handleInputChange}
                        placeholder="Your answer"
                        className="max-w-[150px]"
                        disabled={isCorrect}
                        aria-label="Captcha answer input"
                    />
                     {isCorrect && <CheckCircle className="text-green-500 h-6 w-6" />}
                </div>
                 <Button variant="outline" size="sm" onClick={generateNewNumbers} disabled={isCorrect}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Question
                </Button>
            </CardContent>
        </Card>
    );
}

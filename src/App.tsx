import styles from "./app.module.css";
import { WORDS, type Challenge } from "./utils/words";
import { useEffect, useState } from "react";

import { Header } from "./module/Header";
import { Tip } from "./module/Tip";
import { Letter } from "./module/Letter";
import { Input } from "./module/Input";
import { Button } from "./module/Button";
import { LetterUsed, type LetterUsedProps } from "./module/LettersUsed";

export function App() {
  function handleRestartGame() {
    const isConfirmed = window.confirm(
      "Você tem certeza que deseja reiniciar? "
    );

    if (isConfirmed) {
      startGame();
    }
  }

  const [letter, setLetter] = useState("");
  const [lettersUsed, setLettersUsed] = useState<LetterUsedProps[]>([]);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [score, setScore] = useState(0); //Quantos acertos o user tem

  const ATTEMPTS_MARGIN = 5;

  function startGame() {
    const index = Math.floor(Math.random() * WORDS.length);
    const randomWord = WORDS[index];

    setChallenge(randomWord);

    setScore(0);
    setLetter("");
    setLettersUsed([]);

    console.log(randomWord);
  }

  function endGame(message: string) {
    alert(message);
    startGame();
  }

  function handleConfirm() {
    if (!challenge) {
      return;
    }

    if (!letter.trim()) {
      return alert("Digite um letra");
    }

    const value = letter.toUpperCase();
    const exists = lettersUsed.find(
      (used) => used.value.toLocaleUpperCase() === value
    );

    if (exists) {
      setLetter("");
      return alert(`Você ja utilizou a letra ${value}`);
    }

    const hits = challenge.word
      .toUpperCase()
      .split("")
      .filter((char) => char === value).length;

    const correct = hits > 0;
    const currentScore = score + hits;

    setLettersUsed((prevState) => [...prevState, { value, correct: correct }]);
    setScore(currentScore);

    setLetter("");
  }

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (!challenge) {
      return;
    }

    setTimeout(() => {
      if (score === challenge?.word.length) {
        return endGame("Parabéns, você descobriu a palavra!");
      }

      const attemptLimit = challenge.word.length + ATTEMPTS_MARGIN;
      if (lettersUsed.length === attemptLimit) {
        return endGame("Que pena, você usou todas as tentativas!");
      }
    }, 200);
  }, [score, lettersUsed.length]);

  if (!challenge) {
    return;
  }

  return (
    <div className={styles.container}>
      <main>
        <Header
          current={lettersUsed.length}
          max={challenge.word.length + ATTEMPTS_MARGIN}
          onRestart={handleRestartGame}
        />

        <Tip tip={challenge.tip} />

        <div className={styles.word}>
          {challenge.word.split("").map((letter, index) => {
            const letterUsed = lettersUsed.find(
              (used) => used.value.toUpperCase() === letter.toUpperCase()
            );

            return (
              <Letter
                key={index}
                value={letterUsed?.value}
                color={letterUsed?.correct ? "correct" : "default"}
              />
            );
          })}
        </div>

        <h4>Palpite</h4>
        <div className={styles.guess}>
          <Input
            autoFocus
            maxLength={1}
            placeholder="?"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
          />
          <Button title="Confirmar" onClick={handleConfirm} />
        </div>

        <LetterUsed data={lettersUsed} />
      </main>
    </div>
  );
}

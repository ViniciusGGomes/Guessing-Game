import styles from "./styles.module.css";
import { Letter } from "../Letter";

export type LetterUsedProps = {
  value: string;
  correct: boolean;
};

type Props = {
  data: LetterUsedProps[];
};

export function LetterUsed({ data }: Props) {
  return (
    <div className={styles.letterUser}>
      <h5>Letras Utilizadas</h5>

      <div>
        {data.map(({ value, correct }) => (
          <Letter
            value={value}
            size="small"
            color={correct ? "correct" : "wrong"}
          />
        ))}
      </div>
    </div>
  );
}

import React, { ChangeEvent, useEffect, useState, useRef } from "react";

function App() {
  const [word, setWord] = useState<string[]>("car".split(""));
  const [lettersGuesses, setLettersGuesses] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const centerPos = window.innerWidth / 2;
  const [failed, setFailed] = useState<number>(1);
  let ctx:any;

  useEffect(() => {
    const canvas = canvasRef.current;
    ctx = canvas?.getContext("2d");
    if (ctx == null) throw new Error("Could not get context");

    clearRect(ctx);
  });

  const hangman = (ctx: CanvasRenderingContext2D) => {
    console.log(failed)
    clearRect(ctx)
    ctx.lineWidth = 1;
    ctx.beginPath();

    if (failed > 0) {
      ctx.moveTo(centerPos - 50, 400);
      ctx.lineTo(centerPos, 350);
    }

    if (failed > 1) {
      ctx.lineTo(centerPos + 50, 400);
    }

    if (failed > 2) {
      ctx.moveTo(centerPos, 350);
      ctx.lineTo(centerPos, 200);
    }

    if (failed > 3) {
    ctx.moveTo(centerPos, 200);
    ctx.lineTo(centerPos + 100, 200);
    }

    if (failed > 4) {
    ctx.moveTo(centerPos, 250);
    ctx.lineTo(centerPos + 25, 200);
    }

    if (failed > 5) {
      ctx.moveTo(centerPos + 100, 200);
      ctx.lineTo(centerPos + 100, 250);
    }

    //head
    if (failed > 6) {
      ctx.arc(centerPos + 100, 260, 15, 0, 360);
    }

    if (failed > 7) {
    ctx.moveTo(centerPos + 100, 275);
    ctx.lineTo(centerPos + 100, 325);
    }

    if (failed > 8) {
    ctx.moveTo(centerPos + 100, 275);
    ctx.lineTo(centerPos + 75, 325);
    }

    if (failed > 9) {
    ctx.moveTo(centerPos + 100, 275);
    ctx.lineTo(centerPos + 125, 325);
    }

    if (failed > 10) {
    ctx.moveTo(centerPos + 100, 325);
    ctx.lineTo(centerPos + 75, 375);
    }

    if (failed > 11) {
      ctx.moveTo(centerPos + 100, 325);
      ctx.lineTo(centerPos + 125, 375);
      setTimeout(() => {
        console.log("you lost")
        clearRect(ctx)
      }, 400);
    }

    ctx.stroke();
  };

  const clearRect = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, window.innerWidth, 200);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newArr: string[] = [...lettersGuesses, e.target.value[0]];

    let winCount: number = 0;


    word.forEach((letter) => {
      if (newArr.includes(letter)) {
        winCount += 1;
      }
    });

    if(!word.includes(e.target.value[0]) && !lettersGuesses.includes(e.target.value[0])){
      setFailed(failed+1)
      hangman(ctx)
    }

    console.log(winCount, word?.length);
    if (winCount === word?.length) {
      console.log("u won");
      randomWord();
      setLettersGuesses([]);
    } else if (!lettersGuesses.includes(e.target.value[0])) {
      setLettersGuesses(newArr);
    }

    setTimeout(() => {
      e.target.value = "";
    }, 400);
  };

  const randomWord = async () => {
    try{
      const data = await fetch("https://random-word.ryanrk.com/api/en/word/random");
      const jsonData = await data.json();
      console.log(jsonData[0])
      setWord(jsonData[0].split(""))
    }catch(e){
      console.error(e)
    }
  };

  useEffect(() => {
    randomWord()
  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef} width={window.innerWidth} height={"400px"} />

      <div className="letters">
        {word?.map((letter) => {
          return <p>{lettersGuesses.includes(letter) ? letter : "_"}</p>;
        })}
      </div>

      <h3>Used Letters:</h3>
      <div className="usedLetters">
        {lettersGuesses.map((letter): JSX.Element => {
          return <>{letter},</>;
        })}
      </div>

      <input type="text" className="inputField" onChange={handleInputChange} />
    </div>
  );
}

export default App;

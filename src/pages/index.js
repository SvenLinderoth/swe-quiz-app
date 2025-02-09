import { useState, useRef, useEffect } from "react";
import Confetti from "react-confetti";
import {
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import words from "../data/words.json";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shuffledWords, setShuffledWords] = useState([]);
  const inputRef = useRef(null);

  const categories = Object.keys(words);

  useEffect(() => {
    if (selectedCategory) {
      // Shuffle the words whenever a category is selected
      const shuffled = [...words[selectedCategory]];
      shuffled.sort(() => Math.random() - 0.5); // Shuffle array randomly
      setShuffledWords(shuffled);
      setCurrentWordIndex(0);
      setScore(0);
      setIsCorrect(null);
      setShowConfetti(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const handleKeydown = (e) => {
      // Only allow pressing the right arrow if the answer is correct
      if (e.key === "ArrowRight" && isCorrect === true) {
        handleNext();
      }
    };

    // Attach event listener for keydown event
    window.addEventListener("keydown", handleKeydown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [currentWordIndex, isCorrect]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentWord = shuffledWords[currentWordIndex];
    if (userInput.trim().toLowerCase() === currentWord.swedish.toLowerCase()) {
      setScore(score + 1);
      setIsCorrect(true);
      setShowConfetti(true);
    } else {
      setScore(score - 1); // Deduct 1 point for incorrect answer
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    setCurrentWordIndex(currentWordIndex + 1);
    setUserInput("");
    setIsCorrect(null);
    setShowConfetti(false);
  };

  // Focus the input field after moving to the next question
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWordIndex]);

  if (!selectedCategory) {
    return (
      <Container>
        <Typography variant="h3" gutterBottom>
          Choose a Category
        </Typography>
        {categories.map((category) => (
          <Button
            key={category}
            variant="contained"
            color="primary"
            onClick={() => handleCategorySelect(category)}
            style={{ margin: "10px" }}>
            {category}
          </Button>
        ))}
      </Container>
    );
  }

  const currentWord = shuffledWords[currentWordIndex];
  const totalQuestions = shuffledWords.length;

  // Check if all questions are answered
  const isQuizComplete = currentWordIndex >= totalQuestions;

  return (
    <Container>
      {showConfetti && <Confetti />} {/* Confetti animation when correct */}
      <Typography variant="h3" gutterBottom>
        {selectedCategory}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Score: {score}
      </Typography>
      {!isQuizComplete && (
        <Typography
          variant="h6"
          style={{ position: "absolute", top: "20px", right: "20px" }}>
          {currentWordIndex + 1}/{totalQuestions}{" "}
          {/* Display current question */}
        </Typography>
      )}
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setSelectedCategory(null)}
        style={{ marginBottom: "10px" }}>
        Back to Categories
      </Button>
      {/* If quiz is complete, show results */}
      {isQuizComplete ? (
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Quiz Completed!
            </Typography>
            <Typography variant="h5" gutterBottom>
              You scored: {score}/{totalQuestions}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setSelectedCategory(null)}>
              Try Another Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card
          style={{
            backgroundColor:
              isCorrect === true
                ? "#ccffcc"
                : isCorrect === false
                ? "#ffcccc"
                : "#ffffff",
          }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {currentWord.english}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Translate to Swedish"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isCorrect === true} // Disable input after correct answer
                inputRef={inputRef} // Focus the input field
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
                disabled={isCorrect === true} // Disable submit button after correct answer
              >
                Submit
              </Button>
            </form>
            {isCorrect === true && (
              <Button
                variant="contained"
                color="success"
                style={{ marginTop: "10px" }}
                onClick={handleNext}>
                Next
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

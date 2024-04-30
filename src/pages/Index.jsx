import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { FaArrowRight, FaArrowLeft, FaArrowUp, FaArrowDown } from "react-icons/fa";

const gridSize = 20;
const gridCount = gridSize * gridSize;

const Index = () => {
  const [snake, setSnake] = useState([2, 1, 0]);
  const [apple, setApple] = useState(5);
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(300);
  const [gameOver, setGameOver] = useState(false);
  const toast = useToast();

  const createGrid = () => {
    let elements = [];
    for (let i = 0; i < gridCount; i++) {
      elements.push(<Box key={i} w="20px" h="20px" bg={snake.includes(i) ? "green.500" : i === apple ? "red.500" : "gray.200"} border="1px" borderColor="gray.100" />);
    }
    return elements;
  };

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prev) => {
      let newSnake = [...prev];
      let head = prev[0];

      switch (direction) {
        case "RIGHT":
          head = head % gridSize === gridSize - 1 ? head - (gridSize - 1) : head + 1;
          break;
        case "LEFT":
          head = head % gridSize === 0 ? head + (gridSize - 1) : head - 1;
          break;
        case "DOWN":
          head = head + gridSize >= gridCount ? head % gridSize : head + gridSize;
          break;
        case "UP":
          head = head - gridSize < 0 ? gridCount - (gridSize - (head % gridSize)) : head - gridSize;
          break;
        default:
          return prev;
      }

      if (newSnake.includes(head)) {
        setGameOver(true);
        toast({
          title: "Game Over",
          description: "You ate yourself!",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return prev;
      }

      newSnake.unshift(head);

      if (head === apple) {
        let newApple = Math.floor(Math.random() * gridCount);
        while (newSnake.includes(newApple)) {
          newApple = Math.floor(Math.random() * gridCount);
        }
        setApple(newApple);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, gameOver, apple, toast]);

  useEffect(() => {
    const handle = setInterval(moveSnake, speed);
    return () => clearInterval(handle);
  }, [moveSnake, speed]);

  const changeDirection = (newDirection) => {
    setDirection(newDirection);
  };

  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction !== "DOWN") changeDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") changeDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") changeDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") changeDirection("RIGHT");
          break;
        default:
          break;
      }
    },
    [direction],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Flex wrap="wrap" w={`${gridSize * 20}px`} h={`${gridSize * 20}px`}>
        {createGrid()}
      </Flex>
      <Flex mt="4">
        <Button onClick={() => changeDirection("UP")} m="1" leftIcon={<FaArrowUp />} isDisabled={gameOver}>
          Up
        </Button>
        <Button onClick={() => changeDirection("LEFT")} m="1" leftIcon={<FaArrowLeft />} isDisabled={gameOver}>
          Left
        </Button>
        <Button onClick={() => changeDirection("DOWN")} m="1" leftIcon={<FaArrowDown />} isDisabled={gameOver}>
          Down
        </Button>
        <Button onClick={() => changeDirection("RIGHT")} m="1" leftIcon={<FaArrowRight />} isDisabled={gameOver}>
          Right
        </Button>
      </Flex>
      {gameOver && (
        <Button
          colorScheme="teal"
          mt="4"
          onClick={() => {
            setGameOver(false);
            setSnake([2, 1, 0]);
            setDirection("RIGHT");
            setApple(5);
          }}
        >
          Restart Game
        </Button>
      )}
    </Flex>
  );
};

export default Index;

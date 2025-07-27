import {Flex, Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import btcSrc from "../assets/google1.jpeg";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <Box  w={"full"} h={"85vh"}>
      <motion.div
        style={{
          height: "80vh",
        }}
        animate={{
          translateY: "20px",
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
      <Flex justify="center" align="center" width="100%">
        <Image
          width="400px"
          height="400px"
          objectFit={"contain"}
          src={btcSrc}
          
        />
        </Flex>
      </motion.div>

      <Text
        fontSize={"6xl"}
        textAlign={"center"}
        fontWeight={"thin"}
        color={"BlackAlpha.700"}
        mt={"-20"}
      >
        FinsageAI
      </Text>
    </Box>
  );
};

export default Home;

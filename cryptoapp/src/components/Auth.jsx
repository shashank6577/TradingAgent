// src/components/Auth.jsx

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Signup Successful",
        status: "success",
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Signup Failed",
        description: err.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Successful",
        status: "success",
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Login Failed",
        description: err.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt="8" boxShadow="lg" p="6" rounded="md" bg="white">
      <Heading size="lg" textAlign="center" mb="4" color="blue.500">
        Fin<span style={{ color: "#EA4335" }}>S</span>ag
        <span style={{ color: "#FBBC05" }}>e</span>AI
      </Heading>

      <Tabs variant="enclosed">
        <TabList>
          <Tab>Login</Tab>
          <Tab>Signup</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4}>
              <FormControl id="login-email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="login-password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="blue" width="full" onClick={handleLogin}>
                Login
              </Button>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4}>
              <FormControl id="signup-email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="signup-password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="green" width="full" onClick={handleSignup}>
                Signup
              </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Auth;
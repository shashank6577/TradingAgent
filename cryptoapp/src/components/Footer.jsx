// src/components/Footer.jsx

import { Box, Text, Center } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      bg="white"
      borderTop="1px solid #e5e5e5"
      py={4}
      mt={10}
      width="100%"
    >
      <Center>
        <Text fontSize="sm" color="gray.600">
          © {new Date().getFullYear()} FinSageAI — Built for Google Hackathon
        </Text>
      </Center>
    </Box>
  );
};

export default Footer;
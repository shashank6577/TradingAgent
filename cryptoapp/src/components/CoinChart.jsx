import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";
import { getIndicators } from "../utils/indicators";

const Portfolio = () => {
  const [coinName, setCoinName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const toast = useToast();

  const handleAddCoin = async () => {
    if (!coinName || !quantity || !buyPrice) {
      toast({
        title: "All fields are required",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    try {
      await addDoc(collection(db, "portfolios"), {
        coinName: coinName.toLowerCase(),
        quantity: Number(quantity),
        buyPrice: Number(buyPrice),
        addedAt: new Date().toISOString(),
      });
      setCoinName("");
      setQuantity("");
      setBuyPrice("");
      toast({
        title: "Coin added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error adding coin",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this coin?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "portfolios", id));
      toast({
        title: "Coin deleted",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting coin",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchPortfolio = async () => {
    const snapshot = await getDocs(collection(db, "portfolios"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const enriched = await Promise.all(
      data.map(async (item) => {
        let currentPrice = 0;
        let rsi = null;
        let sma7 = null;
        let sma21 = null;

        try {
          const priceRes = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${item.coinName}&vs_currencies=inr`
          );
          currentPrice = priceRes.data[item.coinName]?.inr || 0;

          const indicators = await getIndicators(item.coinName);
          rsi = indicators.rsi;
          sma7 = indicators.sma7;
          sma21 = indicators.sma21;
        } catch (err) {
          console.error("Error fetching price or indicators for:", item.coinName);
        }

        const profit = (currentPrice - item.buyPrice) * item.quantity;

        let recommendation = "Hold";
        if (rsi !== null && sma7 !== null && sma21 !== null) {
          if (rsi < 30) recommendation = "Strong Buy";
          else if (rsi > 70) recommendation = "Strong Sell";
          else if (currentPrice > sma21 && rsi >= 40 && rsi <= 60) recommendation = "Hold";
          else if (currentPrice < sma21 && rsi < 40) recommendation = "Buy";
          else if (sma7 > sma21 && currentPrice > sma7 && rsi > 60) recommendation = "Sell";
        }

        return {
          ...item,
          currentPrice,
          profit,
          rsi,
          sma7,
          sma21,
          recommendation,
        };
      })
    );

    setPortfolio(enriched);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "portfolios"), () => {
      fetchPortfolio();
    });

    fetchPortfolio();
    return () => unsubscribe();
  }, []);

  return (
    <Box p="5" maxW="800px" mx="auto">
      <Heading mb="6" textAlign="center">
        Your Crypto Portfolio
      </Heading>

      <VStack spacing="4">
        <Input
          placeholder="Coin Name (e.g., bitcoin)"
          value={coinName}
          onChange={(e) => setCoinName(e.target.value)}
        />
        <Input
          placeholder="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <Input
          placeholder="Buy Price"
          type="number"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleAddCoin}>
          Add Coin
        </Button>
      </VStack>

      <Box mt="10">
        {portfolio.map((coin) => (
          <Box
            key={coin.id}
            p="5"
            my="3"
            borderWidth="1px"
            borderRadius="md"
            boxShadow="sm"
          >
            <Heading size="md" textTransform="uppercase">
              {coin.coinName}
            </Heading>
            <Text>Qty: {coin.quantity}</Text>
            <Text>Buy @ ₹{coin.buyPrice}</Text>
            <Text>Current Price: ₹{coin.currentPrice}</Text>
            <Text>Profit/Loss: ₹{coin.profit.toFixed(2)}</Text>
            <Text>RSI: {coin.rsi || "N/A"}</Text>
            <Text>SMA-7: {coin.sma7 || "N/A"}</Text>
            <Text>SMA-21: {coin.sma21 || "N/A"}</Text>
            <Text fontWeight="bold">Recommendation: {coin.recommendation}</Text>
            <Button
              mt="3"
              size="sm"
              colorScheme="red"
              onClick={() => handleDelete(coin.id)}
            >
              Delete
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Portfolio;
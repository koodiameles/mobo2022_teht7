import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, TextInput, Image, Text, FlatList}  from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { API_URL, API_KEY } from '@env';

export default function App() {
  
  const [euro, setEuro] = useState("0")
  const [selectedCurrency, setSelectedCurrency] = useState("")
  const [selectedCurrencyAmount, setSelectedCurrencyAmount] = useState("10")
  const [currencyList, setCurrencyList] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("Loading currencies... please wait a moment")


  let myHeaders = new Headers();
  if (API_KEY !== undefined) {
    // console.log(API_KEY)
    myHeaders.append("apikey", `${API_KEY}`);
  } else {
    console.log("API_KEY is undefined")
    myHeaders.append("apikey", "PnSXHVRgbGesrjmGohwRzx1f3uvvQAai");
  }

  let requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };

  const convertFromSelectedCurrencyToEUR = async () => {
    try {
      const response = await fetch(
        `https://api.apilayer.com/exchangerates_data/convert?to=EUR&from=${selectedCurrency}&amount=${selectedCurrencyAmount}`,
         requestOptions
      )
      const jsonData = await response.json();
      const conversionResult = jsonData.result.toString();
      setEuro(conversionResult);
    }
    catch (err) {
      console.log("error")
    }
  }

  //fetch currencyList on first render
  useEffect(() => {
    const fetchCurrencyList = async () => {
      const response = await fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
      const json = await response.json();
      setCurrencyList(Object.keys(json.symbols))
    }

    fetchCurrencyList()
  }, [])

  useEffect(() => {
    if (currencyList.length > 1) {
      setFetchStatus("")
    }
  }, [currencyList])


  return (
    <>
      <View style={styles.containerHeader}>
        <Text style={styles.assignmentHeaderText}>TEHT 7 EUROMUUNNIN</Text>
        <Text style={styles.loadingStatus}>{fetchStatus}</Text>
      </View>
      <View style={styles.container}>
        <TextInput 
          keyboardType="numeric" 
          style={styles.input} 
          onChangeText={setSelectedCurrencyAmount} 
          value={selectedCurrencyAmount}
        />
        <Picker
          style={{width: 200, height: 15, backgroundColor: '#6495ED', color: '#FFF'}}
          selectedValue={selectedCurrency}
          onValueChange={(itemValue, itemIndex) => setSelectedCurrency(itemValue)}
        >
          <Picker.Item label="Select currency" value="Select currency" />
          {currencyList.map((symbol) => {
            return <Picker.Item key={symbol} label={symbol} value={symbol} />;
          })}
        </Picker>
        <View style={{display: 'flex', flexDirection: 'row', margin: 10}}>
          <View style={{flex: 1, marginHorizontal: 30}}>
            <Button color="green" onPress={() => convertFromSelectedCurrencyToEUR()} title="Convert" />
          </View>
        </View>
      </View>
      <View style={styles.container2}>
        <Text style={{color:"#6495ED", fontSize:24}}>IN EUROS:</Text>
        <Text style={{color:"#6495ED", fontSize:24}}>{euro}</Text>
      </View>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  picker: {
    backgroundColor: 'white',
    color: 'white',
    // flex: 1,
  },
  list: {
    backgroundColor: 'black',
  },
  containerHeader: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  container2: {
    flex: 2,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  input: {
    width:"80%", 
    borderColor: 'gray', 
    borderWidth: 1,
    margin: 5,
    color:"white",
  },
  assignmentHeaderText: {
    fontSize: 40,
    color:"#6495ED",
  },
  loadingStatus: {
    fontSize: 20,
    color:"red",
  },
  image: {
    height: 90,
    width: 90,
  }
});
 

